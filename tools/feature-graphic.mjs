// 플레이스토어 그래픽 이미지 생성기  (npm run feature)
//
// 구글 플레이 목록 맨 위에 걸리는 1024 × 500 가로 이미지다. 검색 결과에서
// 앱 아이콘 바로 옆에 붙어 보이므로 아이콘과 톤이 같아야 한다.
// (tools/make-icons.mjs 와 같은 색·같은 계기판 문양을 쓴다)
//
// 안전 영역: 구글이 기기에 따라 좌우를 잘라낸다. 글자는 가운데 800px 안에 둔다.

import puppeteer from 'puppeteer-core'
import { mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const W = 1024, H = 500, OUT = 'store'
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
].find((p) => p && existsSync(p))
if (!CHROME) { console.error('크롬을 못 찾았습니다.'); process.exit(1) }

const html = `
<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;display:flex;align-items:center;
 font-family:'Pretendard Variable',-apple-system,'Segoe UI','Malgun Gothic',Arial,sans-serif;
 background:
  radial-gradient(60% 110% at 24% 8%, #5f57a6 0%, rgba(95,87,166,0) 62%),
  linear-gradient(118deg,#3a3572 0%,#221d4b 54%,#13112b 100%)}
.sheen{position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(70% 90% at 22% 0%, rgba(255,255,255,.2), rgba(255,255,255,0) 60%),
  radial-gradient(120% 120% at 60% 120%, rgba(0,0,0,.42), rgba(0,0,0,0) 60%)}
.copy{position:relative;padding-left:112px;width:560px}
.eyebrow{font-size:21px;letter-spacing:.3em;font-weight:700;color:#e0b471;margin-bottom:16px}
.title{font-size:62px;font-weight:800;letter-spacing:-.02em;line-height:1.18;
  background:linear-gradient(176deg,#ffffff 10%,#e6e0ff 55%,#c2b8ee 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 6px 20px rgba(10,6,36,.5))}
.rule{width:78px;height:5px;border-radius:4px;margin:22px 0 18px;
  background:linear-gradient(90deg,#f3dca8,#c89b4e);box-shadow:0 0 18px rgba(236,196,124,.5)}
.tag{font-size:21px;line-height:1.5;color:#cfc8f0;font-weight:500}
.art{position:absolute;right:96px;top:50%;transform:translateY(-50%)}
.art .glow{position:absolute;inset:-70px;border-radius:50%;
  background:radial-gradient(closest-side, rgba(168,156,255,.4), rgba(168,156,255,0) 70%);filter:blur(14px)}
.art svg{position:relative;filter:drop-shadow(0 0 30px rgba(176,164,255,.45))}
</style></head><body>
  <div class="copy">
    <div class="eyebrow">MBTI</div>
    <div class="title">초정밀<br>성격유형 검사</div>
    <div class="rule"></div>
    <div class="tag">48문항 간단 검사 · 100문항 정밀 검사<br>축마다 퍼센트까지, 궁합까지 한 번에</div>
  </div>
  <div class="art">
    <div class="glow"></div>
    <svg viewBox="0 0 300 300" width="320" height="320">
      <defs>
        <linearGradient id="ln" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#ded6ff"/>
          <stop offset="100%" stop-color="#a99ae4"/></linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f6ddaa"/><stop offset="50%" stop-color="#e0b471"/>
          <stop offset="100%" stop-color="#b98f46"/></linearGradient>
      </defs>
      <circle cx="150" cy="150" r="128" fill="none" stroke="url(#gold)" stroke-width="7"/>
      <g stroke="url(#ln)" stroke-width="10" stroke-linecap="round">
        <line x1="150" y1="46" x2="150" y2="254"/><line x1="46" y1="150" x2="254" y2="150"/>
        <line x1="76" y1="76" x2="224" y2="224"/><line x1="224" y1="76" x2="76" y2="224"/>
      </g>
      <g fill="url(#ln)">
        <circle cx="150" cy="46" r="21"/><circle cx="150" cy="254" r="21"/>
        <circle cx="46" cy="150" r="21"/><circle cx="254" cy="150" r="21"/>
        <circle cx="76" cy="76" r="14"/><circle cx="224" cy="224" r="14"/>
        <circle cx="224" cy="76" r="14"/><circle cx="76" cy="224" r="14"/>
      </g>
      <circle cx="150" cy="150" r="36" fill="url(#gold)"/>
    </svg>
  </div>
<div class="sheen"></div></body></html>`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'] })
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
