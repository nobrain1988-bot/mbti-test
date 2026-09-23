import { useState, useEffect, useCallback, useRef } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { questionsFor } from './lib/questions.js'
import { computeResult } from './lib/scoring.js'
import { TYPES } from './lib/types.js'
import { initAds, showBanner, showInterstitialOnExit } from './lib/ads.js'
import { setSoundEnabled, playResult } from './lib/sound.js'
import * as store from './lib/storage.js'
import Intro from './components/Intro.jsx'
import Quiz from './components/Quiz.jsx'
import ResultView from './components/ResultView.jsx'
import TypeLibrary from './components/TypeLibrary.jsx'
import History from './components/History.jsx'
import Settings from './components/Settings.jsx'
import Compatibility from './components/Compatibility.jsx'
import { IconTest, IconBook, IconHistory } from './components/icons.jsx'

// 출시 후 실제 스토어 주소로 바꾼다. 공유 문구 끝에 붙는다.
const STORE_URL = 'https://play.google.com/store/apps/details?id=com.obok.mbti'

async function shareResult(code) {
  const t = TYPES[code]
  const text = `나는 ${code} · ${t.nickname}\n"${t.line}"\n\n초정밀 MBTI 검사\n${STORE_URL}`
  try {
    if (navigator.share) { await navigator.share({ title: 'MBTI', text }); return }
  } catch { return }
  try {
    await navigator.clipboard.writeText(text)
    alert('결과가 클립보드에 복사됐어요.')
  } catch { alert(text) }
}

// ──────────────────────────────────────────────────────────────
// 검사 — 트랙 선택 → 문항 → 결과
// ──────────────────────────────────────────────────────────────
function TestView({ onFinished, onOpenCompat, registerBack }) {
  const [phase, setPhase] = useState('pick') // pick | quiz | result
  const [track, setTrack] = useState(null)
  const [result, setResult] = useState(null)

  // 안드로이드 뒤로가기를 이 화면이 직접 처리한다. true 를 주면 '내가 처리했다'는 뜻.
  // 문항을 푸는 중에 그냥 나가면 최대 100개 답한 게 통째로 사라지므로 한 번 물어본다.
  useEffect(() => {
    registerBack(() => {
      if (phase === 'quiz') {
        if (confirm('검사를 그만두시겠어요?\n지금까지 답한 내용은 저장되지 않습니다.')) {
          setResult(null); setTrack(null); setPhase('pick')
        }
        return true
      }
      if (phase === 'result') {
        setResult(null); setTrack(null); setPhase('pick')
        return true
      }
      return false // 트랙 고르는 화면이면 앱 껍데기가 알아서 처리한다
    })
  }, [phase, registerBack])

  const start = (tr) => {
    setTrack(tr)
    setPhase('quiz')
  }

  const onDone = useCallback((answers) => {
    const items = questionsFor(track)
    const r = computeResult(answers, items)
    store.addHistory({ code: r.code, track, axes: r.axes })
    playResult()
    setResult(r)
    setPhase('result')
    onFinished()
  }, [track, onFinished])

  // 전면광고는 결과를 다 보고 빠져나갈 때만. 결과가 나오기 직전에 띄우면
  // 기다리던 걸 가로막는 꼴이라 구글 정책에 걸리고 재방문율도 깎인다.
  const retake = async () => {
    await showInterstitialOnExit()
    setResult(null)
    setTrack(null)
    setPhase('pick')
  }

  if (phase === 'pick') {
    return (
      <div className="screen">
        <div className="eyebrow">검사 시작</div>
        <h1 style={{ marginBottom: 18 }}>어느 쪽으로 하시겠어요?</h1>

        <button className="tile" onClick={() => start('short')}>
          <span style={{ minWidth: 0 }}>
            <span className="row" style={{ gap: 8 }}>
              <span className="t-title">간단 검사</span>
              <span className="tier-tag">STANDARD</span>
            </span>
            <span className="t-sub" style={{ display: 'block' }}>48문항 · 약 6분</span>
          </span>
        </button>
        <button className="tile" onClick={() => start('full')}>
          <span style={{ minWidth: 0 }}>
            <span className="row" style={{ gap: 8 }}>
              <span className="t-title">정밀 검사</span>
              <span className="tier-tag">COMPREHENSIVE</span>
            </span>
            <span className="t-sub" style={{ display: 'block' }}>100문항 · 약 15분</span>
          </span>
        </button>
      </div>
    )
  }

  if (phase === 'quiz') {
    return <Quiz items={questionsFor(track)} onDone={onDone} />
  }

  return (
    <div className="screen">
      <ResultView
        code={result.code}
        axes={result.axes}
        track={track}
        onShare={() => shareResult(result.code)}
        onRetake={retake}
        onCompat={() => onOpenCompat(result.code)}
      />
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// 앱 껍데기 + 탭바
// ──────────────────────────────────────────────────────────────
const TABS = [
  { key: 'test', Icon: IconTest, label: '검사' },
  { key: 'library', Icon: IconBook, label: '유형사전' },
  { key: 'history', Icon: IconHistory, label: '기록' },
]

export default function App() {
  const [entered, setEntered] = useState(false)
  const [tab, setTab] = useState('test')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [compatSeed, setCompatSeed] = useState(undefined) // undefined = 닫힘, null|code = 열림(초기값)
  const [dataVersion, setDataVersion] = useState(0)

  // 검사 화면이 자기 뒤로가기 처리를 여기에 등록해 둔다
  const testBack = useRef(() => false)
  const registerBack = useCallback((fn) => { testBack.current = fn }, [])

  useEffect(() => {
    initAds()
    setSoundEnabled(store.getSettings().sound !== false)
  }, [])

  // 안드로이드 하드웨어 뒤로가기. 처리 안 하고 두면 캡시터 기본 동작이
  // "웹뷰 히스토리 없으면 앱 종료"라, 검사 도중에 눌러도 그냥 꺼진다.
  // 열린 것부터 차례로 닫고, 더 닫을 게 없을 때만 종료한다.
  useEffect(() => {
    let remove = null
    CapacitorApp.addListener('backButton', () => {
      if (!entered) { CapacitorApp.exitApp(); return }
      if (compatSeed !== undefined) { setCompatSeed(undefined); return }
      if (settingsOpen) { setSettingsOpen(false); return }
      // 검사 탭일 때만 물어본다 — 다른 탭에서는 TestView 가 떠 있지도 않은데
      // 이전에 등록해 둔 처리가 남아 뒤로가기를 잘못 삼킨다
      if (tab === 'test' && testBack.current()) return
      if (tab !== 'test') { setTab('test'); return }
      CapacitorApp.exitApp()
    }).then((h) => { remove = h }).catch(() => {}) // 웹 브라우저에서는 그냥 없는 기능
    return () => { remove?.remove() }
  }, [entered, compatSeed, settingsOpen, tab])
  // 배너는 시작 화면을 지난 뒤부터 띄운다 — 시작 화면 하단은 '시작하기' 버튼 자리다.
  useEffect(() => { if (entered) showBanner() }, [entered])

  const onFinished = () => setDataVersion((n) => n + 1)
  const clearData = () => {
    store.clearUserData()
    setDataVersion((n) => n + 1)
    setSettingsOpen(false)
  }

  const screen =
    tab === 'test' ? <TestView onFinished={onFinished} onOpenCompat={(code) => setCompatSeed(code)} registerBack={registerBack} /> :
    tab === 'library' ? <TypeLibrary onOpenCompat={(code) => setCompatSeed(code ?? null)} /> :
    <History refreshKey={dataVersion} />

  return (
    <div className="app">
      {!entered && <Intro onEnter={() => setEntered(true)} />}

      <button className="gear" onClick={() => setSettingsOpen(true)} aria-label="설정">⚙</button>

      {screen}

      <nav className="tabbar">
        <div className="tabbar-inner">
          {TABS.map(({ key, Icon, label }) => (
            <button key={key} className={`tab ${tab === key ? 'on' : ''}`} onClick={() => setTab(key)}>
              <Icon />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} onClearData={clearData} />

      {compatSeed !== undefined && (
        <Compatibility initialA={compatSeed} onClose={() => setCompatSeed(undefined)} />
      )}
    </div>
  )
}
