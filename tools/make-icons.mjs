// 앱 아이콘 · 스플래시 원본 생성기  (npm run icons)
//
// 왜 브라우저로 그리는가: 예전엔 sharp 로 도형을 계산해 그렸는데 글꼴을 못 찾아
// 글자가 깨졌고, 그라데이션·발광 같은 효과도 표현이 안 됐다. 크롬으로 HTML 을
// 찍으면 전부 의도대로 나온다. (tools/feature-graphic.mjs 와 같은 방식)
//
// 문양: 4가지 축을 뜻하는 계기판 + MBTI 글자.
//   · 캐릭터 얼굴도 시도했지만 "애들 장난 같다"는 피드백을 받고 뺐다.
//     캐릭터는 시작 화면에 남아 있고, 아이콘은 '정밀 검사' 톤으로 간다.
//   · 금색은 포인트다. 같은 남색 계열만 쓰면 단조로워서 고급스러움이 안 산다.
//   · 한글 부제('성격유형 검사')는 사장님 요청으로 넣었다. 48px 에서는 뭉개지지만
//     스토어 목록(512px)과 폰에서 실제로 보는 크기(96px~)에서는 읽히고,
//     한글이 있어야 무슨 앱인지 한눈에 들어온다.

import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'assets')
const PUB = join(ROOT, 'public')
const STORE = join(ROOT, 'store')

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => p && existsSync(p))
if (!CHROME) { console.error('크롬을 못 찾았습니다.'); process.exit(1) }

const BG = `
  radial-gradient(72% 58% at 30% 10%, #5f57a6 0%, rgba(95,87,166,0) 60%),
  linear-gradient(150deg,#3a3572 0%,#221d4b 52%,#13112b 100%)`

// mark: 계기판 지름(px), word: 글자 크기(px). 둘 다 1024 기준.
const html = ({ size = 1024, mark = 492, word = 192, sub = 68, bg = true, showWord = true }) => `
<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${size}px;height:${size}px;overflow:hidden;position:relative;
 display:flex;align-items:center;justify-content:center;
 font-family:'Pretendard Variable',-apple-system,'Segoe UI',Arial,sans-serif;
 background:${bg ? BG : 'transparent'}}
.sheen{position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(90% 65% at 28% 8%, rgba(255,255,255,.22), rgba(255,255,255,0) 58%),
  radial-gradient(120% 90% at 50% 112%, rgba(0,0,0,.44), rgba(0,0,0,0) 62%)}
.w{position:relative;display:flex;flex-direction:column;align-items:center;gap:10px;
   transform:scale(${size / 1024});transform-origin:center}
.glow{position:absolute;width:${mark * 1.35}px;height:${mark * 1.35}px;border-radius:50%;
  top:${-mark * 0.17}px;
  background:radial-gradient(closest-side, rgba(168,156,255,.38), rgba(168,156,255,0) 70%);
  filter:blur(14px)}
svg{position:relative;filter:drop-shadow(0 0 30px rgba(176,164,255,.45))}
.s{position:relative;font-size:${sub}px;font-weight:700;letter-spacing:.04em;
  color:#efe9ff;margin-top:${Math.round(sub * 0.18)}px;
  text-shadow:0 4px 16px rgba(8,5,30,.7), 0 0 26px rgba(173,160,255,.35)}
.t{position:relative;font-size:${word}px;font-weight:800;letter-spacing:-.01em;line-height:1;
  background:linear-gradient(176deg,#ffffff 6%,#e6e0ff 48%,#bcb2ea 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 8px 22px rgba(10,6,36,.55)) drop-shadow(0 0 36px rgba(173,160,255,.35))}
</style></head><body>
<div class="w">
  <div class="glow"></div>
  <svg viewBox="0 0 300 300" width="${mark}" height="${mark}">
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
  ${showWord ? '<div class="t">MBTI</div><div class="s">성격유형 검사</div>' : ''}
</div>
${bg ? '<div class="sheen"></div>' : ''}</body></html>`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars'] })
const shot = async (file, size, opts = {}) => {
  const p = await browser.newPage()
  await p.setViewport({ width: size, height: size, deviceScaleFactor: 1 })
  await p.setContent(html({ size, ...opts }), { waitUntil: 'networkidle0' })
  await p.evaluate(() => document.fonts.ready)
  await p.screenshot({ path: file, omitBackground: opts.bg === false })
  await p.close()
  console.log('  ✓', file.slice(ROOT.length + 1).split(sep).join('/'))
}

try {
  await mkdir(OUT, { recursive: true })
  await mkdir(PUB, { recursive: true })
  await mkdir(STORE, { recursive: true })

  await shot(join(OUT, 'icon.png'), 1024)
  // 적응형 앞면 — 런처가 바깥을 잘라내므로 작게 그린다
  await shot(join(OUT, 'icon-foreground.png'), 1024, { bg: false, mark: 388, word: 152, sub: 54 })
  await shot(join(OUT, 'icon-background.png'), 1024, { mark: 0, showWord: false })
  // 마스커블도 잘림을 감안해 여유를 둔다
  await shot(join(PUB, 'pwa-maskable-512.png'), 512, { mark: 408, word: 160, sub: 57 })

  // 실행화면 — 아이콘과 같은 배경에 문양만 작게
  await shot(join(OUT, 'splash.png'), 2732, { mark: 320, word: 126, sub: 45 })
  await sharp(join(OUT, 'splash.png')).toFile(join(OUT, 'splash-dark.png'))
  console.log('  ✓ assets/splash-dark.png')

  const base = join(OUT, 'icon.png')
  for (const [file, size, dir, label] of [
    ['pwa-192.png', 192, PUB, 'public/'], ['pwa-512.png', 512, PUB, 'public/'],
    ['icon-512.png', 512, STORE, 'store/'],
  ]) {
    await sharp(base).resize(size, size).png().toFile(join(dir, file))
    console.log('  ✓', label + file)
  }

  await writeFile(join(OUT, 'icon.html'), html({}), 'utf8')
  console.log('  ✓ assets/icon.html (브라우저로 열어 확인 가능)')
} finally {
  await browser.close()
}

console.log('\n생성 완료. 안드로이드 런처 아이콘은 이어서 @capacitor/assets 가 반영한다.')
