// 앱 아이콘 · 스플래시 원본 생성기  (npm run icons)
//
// 왜 스크립트인가: 아이콘을 손으로 그려 PNG 로 갖고 있으면, 색을 한 번 바꿀 때마다
// 다시 그려야 하고 '무슨 색이었는지'가 파일 안에 갇힌다. 여기서는 앱과 같은 색 상수를
// 쓰고 도형을 계산해서 그린다 → 색·모양을 바꾸려면 이 파일만 고치면 된다.
// (타로 앱의 tools/make-icons.mjs 와 같은 방식, 문양만 이 앱에 맞게 새로 그렸다)
//
// 문양: 2x2 사각형 4개 = 이 검사의 4가지 축(E/I·S/N·T/F·J/P)을 상징한다.
//
// 만드는 것 (assets/):
//   icon.png             1024  일반 아이콘 (배경+문양)
//   icon-foreground.png  1024  적응형 아이콘 앞면 (문양만, 여백 넉넉히)
//   icon-background.png  1024  적응형 아이콘 뒷면 (배경만)
//   splash.png           2732  실행 화면 (앱과 같은 종이톤 배경)
//   splash-dark.png      2732  실행 화면 (다크) — 이 앱은 라이트 전용이라 동일하게 둔다
//
// 이 파일들을 @capacitor/assets 가 읽어서 안드로이드의 수십 가지 크기로 뽑아준다.
// (안드로이드 프로젝트 생성 전까지는 assets/ 원본과 public/ PWA 아이콘까지만 의미가 있다)

import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'assets')
const PUB = join(ROOT, 'public')
const STORE = join(ROOT, 'store')

// 앱과 같은 색 (src/styles.css 의 --accent 계열과 일치시킬 것)
const C = {
  bgDeep: '#0f1115',
  bgLift: '#1c1e33',   // 아이콘 배경의 은은한 인디고 광원
  paper: '#f6f6f4',    // 앱 배경과 같은 종이톤 — 실행화면에 쓴다
  inkHi: '#8f93c4',
  inkMid: '#6b6fa8',
  inkLo: '#3a3f72',
  inkDeep: '#242540',
}

const defs = `
  <radialGradient id="bg" cx="50%" cy="42%" r="72%">
    <stop offset="0%"   stop-color="${C.bgLift}"/>
    <stop offset="100%" stop-color="${C.bgDeep}"/>
  </radialGradient>`

// 문양: 2x2 사각형. 좌상단→우하단으로 밝→어두운 인디고 그라데이션이 흐르게
// 하나의 그라데이션을 네 사각형이 같이 나눠 쓴다(각자 다른 색을 넣는 것보다
// 한 덩어리로 읽힌다). colors 는 어두운 배경/밝은 배경에 따라 바꿔 넣는다.
function mark(size, scale = 1, colors = [C.inkHi, C.inkMid, C.inkLo]) {
  const box = size * 0.6 * scale
  const gap = size * 0.05 * scale
  const sq = (box - gap) / 2
  const r = sq * 0.26
  const left = (size - box) / 2
  const top = (size - box) / 2

  const grad = `
    <linearGradient id="accent" x1="${left}" y1="${top}" x2="${left + box}" y2="${top + box}"
                    gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="${colors[0]}"/>
      <stop offset="55%"  stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>`

  const at = (col, row) => ({ x: left + col * (sq + gap), y: top + row * (sq + gap) })
  const positions = [at(0, 0), at(1, 0), at(0, 1), at(1, 1)]
  const rects = positions
    .map((p) => `<rect x="${p.x.toFixed(2)}" y="${p.y.toFixed(2)}" width="${sq.toFixed(2)}" height="${sq.toFixed(2)}" rx="${r.toFixed(2)}" fill="url(#accent)"/>`)
    .join('\n    ')

  return grad + '\n    ' + rects
}

const svgIcon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>${defs}</defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  ${mark(size, 1)}
</svg>`

// 적응형 아이콘 앞면: 시스템이 원형·둥근네모로 잘라내므로 가운데 안전지대 안에만 그린다.
const svgForeground = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${mark(size, 0.62)}
</svg>`

const svgBackground = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>${defs}</defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
</svg>`

// 실행화면은 앱 배경과 같은 종이톤으로 간다. 앱 자체가 흰 배경인데 실행화면만
// 검으면 앱을 열 때마다 검은 화면이 번쩍하고 흰 화면으로 넘어간다.
const svgSplash = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${C.paper}"/>
  ${mark(size, 0.34, [C.inkMid, C.inkLo, C.inkDeep])}
</svg>`

// 마스커블 아이콘: 안드로이드가 원형·둥근네모 등으로 잘라낸다.
const svgMaskable = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>${defs}</defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  ${mark(size, 0.66)}
</svg>`

const png = (svg, file, dir = OUT) =>
  sharp(Buffer.from(svg)).png().toFile(join(dir, file)).then(() => console.log('  ✓', file))

await mkdir(OUT, { recursive: true })
await mkdir(PUB, { recursive: true })
await Promise.all([
  png(svgIcon(1024), 'icon.png'),
  png(svgForeground(1024), 'icon-foreground.png'),
  png(svgBackground(1024), 'icon-background.png'),
  png(svgSplash(2732), 'splash.png'),
  png(svgSplash(2732), 'splash-dark.png'),

  // 홈 화면에 추가(PWA)용 — 폰 브라우저에서 앱처럼 띄울 때 쓴다.
  png(svgIcon(192), 'pwa-192.png', PUB),
  png(svgIcon(512), 'pwa-512.png', PUB),
  png(svgMaskable(512), 'pwa-maskable-512.png', PUB),

  // 플레이 콘솔 '앱 아이콘' 칸에 올릴 512×512 (store/ 에 스토어 자료를 모아 둔다)
  mkdir(STORE, { recursive: true }).then(() => png(svgIcon(512), 'icon-512.png', STORE)),
])

// 원본 SVG 도 남긴다. 스토어 그래픽·홍보물에서 확대해 써야 할 때 필요하다.
await writeFile(join(OUT, 'icon.svg'), svgIcon(1024), 'utf8')
console.log('  ✓ icon.svg (벡터 원본)')
console.log('\nassets/ · public/ 생성 완료 — 안드로이드 프로젝트를 만든 뒤(npx cap add android)')
console.log('npx @capacitor/assets generate --android 를 실행하면 런처 아이콘까지 자동 반영된다.')
