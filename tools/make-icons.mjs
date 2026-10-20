// 앱 아이콘 · 스플래시 원본 생성기  (npm run icons)
//
// 왜 브라우저로 그리는가: 예전엔 sharp 로 도형을 계산해서 그렸는데, 글자(MBTI)를
// 넣으려니 글꼴을 못 찾아 네모로 깨졌다. 크롬으로 HTML 을 찍으면 글꼴·그라데이션·
// 둥근 모서리가 전부 제대로 나온다. (tools/feature-graphic.mjs 와 같은 방식)
//
// 문양: 앱 시작화면의 캐릭터와 같은 결의 얼굴 + MBTI 글자.
// 작게 줄여도 얼굴이 먼저 읽히고, 스토어처럼 크게 보이는 자리에서는 글자까지 읽힌다.
//
// 만드는 것:
//   assets/icon.png             1024  일반 아이콘
//   assets/icon-foreground.png  1024  적응형 앞면 (배경 투명, 잘림 안전지대 안에)
//   assets/icon-background.png  1024  적응형 뒷면
//   assets/splash.png           2732  실행 화면
//   assets/splash-dark.png      2732  실행 화면(다크) — 라이트 전용 앱이라 동일
//   public/pwa-*.png                  홈 화면에 추가용
//   store/icon-512.png          512   플레이 콘솔 '앱 아이콘' 칸

import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'assets')
const PUB = join(ROOT, 'public')
const STORE = join(ROOT, 'store')

// 앱과 같은 색 (src/styles.css 의 --accent 계열)
const C = {
  bgTop: '#e7e9f7',
  bgBottom: '#c6cae6',
  hair: '#3a3f72',
  hairLit: '#4a4f85',
  skin: '#f6ddc4',
  ink: '#242540',
  text: '#3a3f72',
  blush: '#e9a8a0',
  paper: '#f6f6f4',
  cream: '#f6f3ea',   // icon-face.png 의 배경색과 정확히 같아야 한다
}

// 시작화면 캐릭터(3D 렌더 원본)에서 머리만 잘라 둔 것. tools 로 직접 그리지 않고
// 진짜 캐릭터를 쓴다 — CSS 로 흉내 내면 원본보다 초라해진다.
const FACE = 'data:image/png;base64,' +
  (await readFile(join(OUT, 'icon-face.png'))).toString('base64')

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => p && existsSync(p))
if (!CHROME) { console.error('크롬을 못 찾았습니다.'); process.exit(1) }

// 문양(얼굴 + 글자). scale 로 전체 크기를 줄여 적응형 아이콘 안전지대에 맞춘다.
const markHtml = (scale) => `
  <div class="mark" style="transform: scale(${scale})">
    <img class="face" src="${FACE}" alt="">
    <div class="word">MBTI</div>
  </div>`

const page = (size, { bg = true, mark = true, scale = 1 }) => `
<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:${size}px; height:${size}px; overflow:hidden;
         background:${bg ? C.cream : 'transparent'};
         display:flex; align-items:center; justify-content:center;
         font-family:'Pretendard Variable', -apple-system, 'Segoe UI', 'Malgun Gothic', Arial, sans-serif; }

  /* 1024 기준으로 그리고 다른 크기는 통째로 확대/축소한다 */
  .mark { width:1024px; height:1024px; transform-origin:center;
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; }

  /* 얼굴은 배경째로 잘라온 이미지다. 아이콘 배경색을 같게 맞춰서 경계가 안 보인다. */
  .face { width:540px; height:540px; display:block; }

  .word { font-size:140px; font-weight:800; letter-spacing:.07em;
          color:${C.text}; line-height:1; margin-top:0; }
</style></head><body>${mark ? markHtml(scale) : ''}</body></html>`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'] })
const shot = async (file, size, opts) => {
  const p = await browser.newPage()
  await p.setViewport({ width: size, height: size, deviceScaleFactor: 1 })
  await p.setContent(page(size, opts), { waitUntil: 'networkidle0' })
  await p.evaluate(() => document.fonts.ready)
  await p.screenshot({ path: file, omitBackground: opts.bg === false })
  await p.close()
  console.log('  ✓', file.replace(ROOT, '').replace(/^[\/]/, ''))
}

try {
  await mkdir(OUT, { recursive: true })
  await mkdir(PUB, { recursive: true })
  await mkdir(STORE, { recursive: true })

  await shot(join(OUT, 'icon.png'), 1024, { scale: 1.08 })
  // 적응형 앞면: 런처가 바깥을 잘라내므로 더 작게 그린다
  await shot(join(OUT, 'icon-foreground.png'), 1024, { bg: false, scale: 0.8 })
  await shot(join(OUT, 'icon-background.png'), 1024, { mark: false })

  // 실행화면 — 앱 배경과 같은 종이톤. 아이콘만 작게.
  const splash = join(OUT, 'splash.png')
  const p = await browser.newPage()
  await p.setViewport({ width: 2732, height: 2732 })
  await p.setContent(
    page(2732, { scale: 0.5 }),
    { waitUntil: 'networkidle0' },
  )
  await p.evaluate(() => document.fonts.ready)
  await p.screenshot({ path: splash })
  await p.close()
  console.log('  ✓ assets/splash.png')
  await sharp(splash).toFile(join(OUT, 'splash-dark.png'))
  console.log('  ✓ assets/splash-dark.png')

  // 마스커블(홈 화면에 추가) 은 런처가 원형 등으로 잘라내므로 더 작게 그린다
  await shot(join(PUB, 'pwa-maskable-512.png'), 512, { scale: 0.88 })

  // 나머지 크기는 1024 원본을 줄여 쓴다
  const base = join(OUT, 'icon.png')
  for (const [file, size, dir] of [
    ['pwa-192.png', 192, PUB], ['pwa-512.png', 512, PUB], ['icon-512.png', 512, STORE],
  ]) {
    await sharp(base).resize(size, size).png().toFile(join(dir, file))
    console.log('  ✓', (dir === PUB ? 'public/' : 'store/') + file)
  }

  await writeFile(join(OUT, 'icon.html'), page(1024, { scale: 1.08 }), 'utf8')
  console.log('  ✓ assets/icon.html (원본 — 브라우저로 열어 확인 가능)')
} finally {
  await browser.close()
}

console.log('\n생성 완료. 안드로이드 런처 아이콘까지 반영하려면')
console.log('npx @capacitor/assets generate --android 가 이어서 돌아야 한다.')
