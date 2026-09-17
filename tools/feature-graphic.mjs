// 플레이스토어 그래픽 이미지 생성기  (npm run feature)
//
// 구글 플레이 목록 맨 위에 걸리는 1024 × 500 짜리 가로 이미지다.
// 검색 결과와 추천 자리에서 앱 아이콘보다 먼저 보이는 그림이라, 여기서
// '무슨 앱인지'와 '분위기'가 한눈에 안 잡히면 눌리지 않는다.
//
// 왜 브라우저로 그리는가: 글자를 그림으로 찍어내는 도구(sharp)는 한글 글꼴을
// 제대로 못 찾는 경우가 많다. 크롬은 그냥 잘 그린다.
//
// 안전 영역 주의: 구글이 기기에 따라 좌우를 잘라낸다. 글자는 가운데 800px 안에 둔다.

import puppeteer from 'puppeteer-core'
import { mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const W = 1024
const H = 500
const OUT = 'store'

const CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
]
const chrome = CANDIDATES.find((p) => p && existsSync(p))
if (!chrome) { console.error('크롬을 못 찾았습니다.'); process.exit(1) }

// 앱 시작 화면과 같은 나침반 도형. 4가지 축을 뜻한다.
const compass = `
<svg viewBox="0 0 300 300" width="300" height="300">
  <defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter></defs>
  <circle cx="150" cy="150" r="110" fill="#8f93c4" opacity="0.30" filter="url(#b)"/>
  <g stroke="#3a3f72" stroke-width="1.8" fill="none" opacity="0.8">
    <circle cx="150" cy="150" r="108" opacity="0.3"/>
    <line x1="150" y1="42" x2="150" y2="258"/>
    <line x1="42" y1="150" x2="258" y2="150"/>
    <line x1="74" y1="74" x2="226" y2="226"/>
    <line x1="226" y1="74" x2="74" y2="226"/>
  </g>
  <g fill="#454a7d">
    <circle cx="150" cy="42" r="6"/><circle cx="150" cy="258" r="6"/>
    <circle cx="42" cy="150" r="6"/><circle cx="258" cy="150" r="6"/>
    <circle cx="74" cy="74" r="4.5"/><circle cx="226" cy="226" r="4.5"/>
    <circle cx="226" cy="74" r="4.5"/><circle cx="74" cy="226" r="4.5"/>
  </g>
  <circle cx="150" cy="150" r="8.5" fill="#242540"/>
</svg>`

const html = `
<!doctype html><html><head><meta charset="utf-8"><style>
  :root {
    --bg: #f6f6f4; --ink: #16181c; --muted: #82858c; --accent: #3a3f72;
    --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', 'Apple SD Gothic Neo', Roboto, sans-serif;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: ${W}px; height: ${H}px; overflow: hidden; background: var(--bg); font-family: var(--sans); }
  .wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; }
  /* 완전한 단색이면 납작해 보인다. 아주 옅은 인디고 기운만 얹는다 */
  .bg { position: absolute; inset: 0; background: radial-gradient(120% 95% at 70% 45%, #eceCf4 0%, #f6f6f4 58%); }

  /* 글자 — 좌우가 잘려도 살아남게 왼쪽 안전 영역 안에 둔다 */
  .copy { position: relative; padding-left: 112px; width: 520px; }
  .mark {
    width: 44px; height: 44px; border-radius: 12px; margin-bottom: 20px;
    background: linear-gradient(165deg, #6b6fa8, #3a3f72);
    display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 4px; padding: 8px;
  }
  .mark span { background: rgba(18,18,40,.45); border-radius: 3px; }
  .eyebrow { font-size: 14px; letter-spacing: .18em; font-weight: 700; color: var(--accent); margin-bottom: 10px; }
  .title { font-size: 57px; font-weight: 800; letter-spacing: -.03em; line-height: 1.12; color: var(--ink); }
  .rule { width: 76px; height: 2px; background: var(--accent); opacity: .5; margin: 22px 0 18px; }
  .tag { font-size: 21px; line-height: 1.45; color: #2f3138; font-weight: 500; }
  .sub { font-size: 14px; letter-spacing: .10em; text-transform: uppercase; color: var(--muted); margin-top: 18px; }

  .art { position: absolute; right: 96px; top: 50%; transform: translateY(-50%); }
</style></head><body>
  <div class="wrap">
    <div class="bg"></div>
    <div class="art">${compass}</div>
    <div class="copy">
      <div class="mark"><span></span><span></span><span></span><span></span></div>
      <div class="eyebrow">MBTI</div>
      <div class="title">초정밀<br>성격유형 검사</div>
      <div class="rule"></div>
      <div class="tag">48문항 간단 검사 · 100문항 정밀 검사<br>축마다 퍼센트까지 보여줍니다</div>
      <div class="sub">Personality Assessment Report</div>
    </div>
  </div>
</body></html>`

const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--hide-scrollbars'] })
try {
  await mkdir(OUT, { recursive: true })
  const page = await browser.newPage()
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)

  const file = join(OUT, 'feature-graphic.png')
  if (existsSync(file)) await rm(file)
  await page.screenshot({ path: file })
  console.log(`  ✓ ${file}  (${W}×${H})`)
} finally {
  await browser.close()
}
