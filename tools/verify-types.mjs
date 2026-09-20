import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
// 개발 서버(vite.config.js 의 5181)가 기본. 미리보기 서버로 돌리려면 VERIFY_URL 로 지정한다.
const URL = process.env.VERIFY_URL || 'http://localhost:5181/'
const CODES = ['ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP','ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENTJ','ENFJ']
const AXIS_POLES = [['E','I'],['S','N'],['T','F'],['J','P']]

function patternFor(code) {
  const firstHalf = AXIS_POLES.map((poles, i) => code[i] === poles[0] ? 5 : 1)
  const secondHalf = AXIS_POLES.map((poles, i) => code[i] === poles[1] ? 5 : 1)
  const pattern = []
  for (let r = 0; r < 6; r++) pattern.push(...firstHalf)
  for (let r = 0; r < 6; r++) pattern.push(...secondHalf)
  return pattern
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, defaultViewport: { width: 480, height: 1200 } })
const results = []

try {
  for (const code of CODES) {
    const page = await browser.newPage()
    try {
      await page.goto(URL, { waitUntil: 'networkidle0' })
      await page.evaluate(() => document.fonts.ready)

      await page.evaluate(() => {
        const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '시작하기')
        if (b) b.click()
      })
      await new Promise(r => setTimeout(r, 200))

      await page.evaluate(() => {
        const tile = [...document.querySelectorAll('.tile')].find(b => b.textContent.includes('간단 검사'))
        if (tile) tile.click()
      })
      await new Promise(r => setTimeout(r, 200))

      await page.evaluate((pattern) => {
        const labelFor = { 1: '전혀 아니다', 2: '아니다', 3: '보통이다', 4: '그렇다', 5: '매우 그렇다' }
        const rows = document.querySelectorAll('.likert-row')
        rows.forEach((row, i) => {
          const btn = row.querySelector(`button[aria-label="${labelFor[pattern[i]]}"]`)
          if (btn) btn.click()
        })
      }, patternFor(code))
      await new Promise(r => setTimeout(r, 200))

      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('제출'))
        if (btn) btn.click()
      })
      await new Promise(r => setTimeout(r, 400))

      const check = await page.evaluate(() => {
        const codeEl = document.querySelector('.type-code-lg')
        const h2 = document.querySelector('h2')
        const panels = [...document.querySelectorAll('.panel')]
        const strengthsPanel = panels.find(p => p.textContent.includes('강점'))
        const growthPanel = panels.find(p => p.textContent.includes('성장 포인트'))
        const relPanel = panels.find(p => p.textContent.includes('관계에서'))
        const workPanel = panels.find(p => p.textContent.includes('일할 때'))
        const famousPanel = panels.find(p => p.textContent.includes('이 유형이라고 밝힌'))
        const specPanel = panels.find(p => p.textContent.includes('널리 언급되는'))
        return {
          shownCode: codeEl?.textContent?.trim(),
          nickname: h2?.textContent?.trim(),
          strengthsCount: strengthsPanel?.querySelectorAll('li').length ?? 0,
          growthCount: growthPanel?.querySelectorAll('li').length ?? 0,
          hasRelationships: !!relPanel && relPanel.textContent.length > 20,
          hasWork: !!workPanel && workPanel.textContent.length > 20,
          hasFamousContent: !!famousPanel,
          hasSpeculatedContent: !!specPanel,
          bodyHasError: document.body.innerText.includes('undefined') || document.body.innerText.includes('NaN'),
        }
      })

      results.push({ target: code, ...check, pass: check.shownCode === code && !check.bodyHasError && check.strengthsCount === 5 && check.growthCount === 4 && check.hasRelationships && check.hasWork })
    } catch (e) {
      results.push({ target: code, error: String(e), pass: false })
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}

console.log(JSON.stringify(results, null, 2))
const failed = results.filter(r => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} PASS`)
if (failed.length) console.log('FAILED:', failed.map(f => f.target).join(', '))
