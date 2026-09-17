// 플레이스토어 스크린샷 생성기  (npm run shots)
//
// 왜 스크립트인가: 스크린샷을 손으로 찍으면 화면을 고칠 때마다 다시 찍어야 하고,
// 크기·어느 화면을 담을지가 사람 기억에만 남는다. 여기서 정해 두면 UI 를 고친 뒤
// 한 줄로 다시 뽑는다. 아이콘(make-icons.mjs)과 같은 생각이다.
//
// 이 PC 에는 안드로이드 스튜디오가 없으므로 에뮬레이터로는 못 찍는다.
// 대신 이미 깔려 있는 크롬을 폰 크기로 띄워서 진짜 앱을 조작하며 찍는다.
// (puppeteer-core 는 브라우저를 따로 내려받지 않는다 — 있는 크롬을 쓴다)
//
// 구글 플레이 휴대전화 스크린샷 규격: 9:16 또는 16:9, 짧은 변 320px 이상.
// 1080 × 1920 으로 뽑는다 — 스토어에서 가장 선명하게 보이는 크기다.
//
// 미리보기 서버가 떠 있어야 한다:  npm run preview
// ⚠️ 이 폴더의 앱들이 포트를 나눠 쓴다(vite.config.js 참고). 4173 같은 기본 포트를 쓰면
//    옆 앱(타로)의 서버에 붙어서 엉뚱한 앱 화면이 찍힌다 — 실제로 한 번 그렇게 찍혔다.
//    포트가 밀렸으면:  SHOTS_URL=http://localhost:4178/ npm run shots

import puppeteer from 'puppeteer-core'
import { mkdir, readdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

// 폰 화면 크기는 'CSS 픽셀' 로 360×640 이고, 여기에 화면 배율 3배가 붙어
// 실제 파일은 1080×1920 이 된다. 이 둘을 헷갈리면 안 된다.
const W = 360
const H = 640
const DSF = 3
const OUT = 'store/screenshots'
const URL = process.env.SHOTS_URL || 'http://localhost:4177/'

// 결과 화면에 쓸 유형. INFJ 는 '직접 밝힌 인물'과 '널리 언급되는 인물' 두 서랍이
// 모두 차 있어서 결과 화면이 가장 충실해 보인다.
const SHOWCASE = 'INFJ'
const AXIS_POLES = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']]

// 간단 검사 48문항을 그 유형이 나오도록 채우는 응답 패턴.
// (문항은 축별로 번갈아 배치되고, 앞 절반은 A극·뒤 절반은 B극 표현이다)
//
// ⚠️ 전부 1 과 5 로만 찍으면 결과가 0% / 100% 로 나온다. 검증용(verify-types.mjs)으로는
// 그게 맞지만, 스토어 스크린샷에서는 "성격은 스펙트럼" 이라는 이 앱의 메시지와 정면으로
// 어긋나고 조작한 화면처럼 보인다. 그래서 여기서는 축마다 세기를 다르게 섞어
// 실제 사용자에게 나올 법한 값(대략 I 71 / N 85 / F 65 / J 60)이 나오게 한다.
const AGREE    = [[4, 4, 5, 4, 3, 4], [5, 4, 5, 5, 4, 4], [4, 3, 4, 4, 4, 3], [4, 3, 4, 3, 4, 3]]
const DISAGREE = [[2, 2, 3, 2, 2, 3], [2, 1, 2, 2, 1, 2], [3, 2, 3, 2, 3, 2], [3, 3, 2, 3, 3, 2]]

function patternFor(code) {
  const pattern = []
  for (let half = 0; half < 2; half++) {
    for (let r = 0; r < 6; r++) {
      for (let a = 0; a < 4; a++) {
        const matches = code[a] === AXIS_POLES[a][half]
        pattern.push((matches ? AGREE : DISAGREE)[a][r])
      }
    }
  }
  return pattern
}

const CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
]
const chrome = CANDIDATES.find((p) => p && existsSync(p))
if (!chrome) {
  console.error('크롬(또는 엣지)을 못 찾았습니다. 경로를 tools/shots.mjs 에 추가해 주세요.')
  process.exit(1)
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// 글자로 버튼을 찾아 누른다. 좌표로 누르면 화면을 조금만 고쳐도 엉뚱한 데를 누른다.
async function clickText(page, selector, text) {
  const done = await page.evaluate((sel, s) => {
    const el = [...document.querySelectorAll(sel)].find((e) => e.textContent.includes(s))
    if (!el) return false
    el.click()
    return true
  }, selector, text)
  if (!done) throw new Error(`"${text}" 를 못 찾았습니다 (${selector})`)
}

// 리커트 문항을 채운다. from ~ to 번째 문항만 채우면 '풀다 만' 화면을 찍을 수 있다.
async function answer(page, pattern, from, to) {
  await page.evaluate((pat, a, b) => {
    const labelFor = { 1: '전혀 아니다', 2: '아니다', 3: '보통이다', 4: '그렇다', 5: '매우 그렇다' }
    const rows = [...document.querySelectorAll('.likert-row')].slice(a, b)
    rows.forEach((row, i) => {
      const btn = row.querySelector(`button[aria-label="${labelFor[pat[a + i]]}"]`)
      if (btn) btn.click()
    })
  }, pattern, from, to)
}

// 시트 안의 16유형 그리드에서 특정 유형을 고른다
async function pickType(page, code) {
  const ok = await page.evaluate((c) => {
    const el = [...document.querySelectorAll('.sheet .type-tile')]
      .find((x) => x.querySelector('.type-code')?.textContent.trim() === c)
    if (!el) return false
    el.click()
    return true
  }, code)
  if (!ok) throw new Error(`${code} 타일을 못 찾았습니다`)
}

async function shot(page, n, name) {
  const file = join(OUT, `${String(n).padStart(2, '0')}-${name}.png`)
  await page.screenshot({ path: file })
  console.log(`  ✓ ${file}`)
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: 'new',
  args: [`--window-size=${W},${H}`, '--hide-scrollbars'],
})

try {
  if (existsSync(OUT)) for (const f of await readdir(OUT)) await rm(join(OUT, f))
  await mkdir(OUT, { recursive: true })

  const page = await browser.newPage()
  await page.setViewport({ width: W, height: H, deviceScaleFactor: DSF, isMobile: true, hasTouch: true })

  console.log(`크롬: ${chrome}`)
  console.log(`주소: ${URL}`)
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)

  // 1. 시작 화면 — 이 앱의 첫인상
  await page.waitForSelector('.intro')
  await wait(600)
  await shot(page, 1, 'intro')

  // 2. 트랙 선택 — 48문항/100문항 두 갈래가 이 앱의 차별점이다
  await clickText(page, 'button', '시작하기')
  await wait(500)
  await page.waitForSelector('.tile')
  await shot(page, 2, 'tracks')

  // 3. 시험지 화면 — OMR 답안지처럼 스크롤로 훑으며 채우는 모습
  const pattern = patternFor(SHOWCASE)
  await clickText(page, '.tile', '간단 검사')
  await wait(400)
  await page.waitForSelector('.paper-q')
  await answer(page, pattern, 0, 3)     // 앞 3문항만 마킹 → '푸는 중' 으로 보인다
  await wait(300)
  await shot(page, 3, 'quiz')

  // 4. 결과 — 축별 퍼센트 바가 이 앱이 유형 코드만 던지지 않는다는 증거다
  await answer(page, pattern, 3, 48)
  await wait(300)
  await clickText(page, 'button', '제출')
  await wait(700)
  await page.waitForSelector('.type-code-lg')
  await shot(page, 4, 'result')

  // 5. 유형사전 — ASO 상 개별 유형 검색량이 크다. 16유형이 다 있다는 걸 보여준다
  await clickText(page, '.tab', '유형사전')
  await wait(500)
  await page.waitForSelector('.type-tile')
  await shot(page, 5, 'library')

  // 6. 궁합 보기 — "MBTI 궁합" 은 검색량이 큰 단어다. 설명에 적는 것보다 보여주는 게 낫다.
  //    결과 스크린샷이 INFJ 라서 INFJ × ENFP 로 이어지게 골랐다.
  await clickText(page, '.tile', '궁합')
  await wait(500)
  await pickType(page, 'INFJ')
  await wait(350)
  await pickType(page, 'ENFP')
  await wait(500)
  await shot(page, 6, 'compatibility')

  console.log('\n끝. store/screenshots/ 에 6장.')
} finally {
  await browser.close()
}
