import { useState } from 'react'

export default function Intro({ onEnter }) {
  // 그냥 사라지면 화면이 '툭' 끊긴다. 빠지는 연출을 먼저 보여주고 그다음에 넘긴다.
  // 시간은 styles.css 의 introOut 길이와 맞춰야 중간에 깜빡이지 않는다.
  const [leaving, setLeaving] = useState(false)
  const start = () => {
    if (leaving) return // 연속으로 눌러도 한 번만
    setLeaving(true)
    setTimeout(onEnter, 300)
  }

  return (
    <div className={`intro${leaving ? ' leaving' : ''}`}>
      <div className="intro-inner">
        <svg className="intro-illustration" viewBox="0 0 300 190" aria-hidden="true">
          <defs>
            <filter id="intro-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="22" />
            </filter>
          </defs>
          {/* 은은한 배경 광원 하나만 남기고, 실제 도형은 4개 축을 뜻하는
              나침반/레이더 모양으로 정밀하게 그렸다 — 흐릿한 파스텔 뭉치보다
              "정밀 검사" 컨셉에 맞는 계기판 느낌을 준다. */}
          <circle cx="150" cy="95" r="70" fill="#8f93c4" opacity="0.35" filter="url(#intro-blur)" />
          <g stroke="#3a3f72" strokeWidth="1.3" fill="none" opacity="0.8">
            <circle cx="150" cy="95" r="68" opacity="0.3" />
            <line x1="150" y1="27" x2="150" y2="163" />
            <line x1="82" y1="95" x2="218" y2="95" />
            <line x1="102" y1="47" x2="198" y2="143" />
            <line x1="198" y1="47" x2="102" y2="143" />
          </g>
          <g fill="#454a7d">
            <circle cx="150" cy="27" r="4" />
            <circle cx="150" cy="163" r="4" />
            <circle cx="82" cy="95" r="4" />
            <circle cx="218" cy="95" r="4" />
            <circle cx="102" cy="47" r="3" />
            <circle cx="198" cy="143" r="3" />
            <circle cx="198" cy="47" r="3" />
            <circle cx="102" cy="143" r="3" />
          </g>
          <circle cx="150" cy="95" r="5.5" fill="#242540" />
        </svg>
        <div className="intro-mark"><span /><span /><span /><span /></div>
        <div className="eyebrow accent">MBTI</div>
        <h1 style={{ margin: '6px 0 4px' }}>초정밀<br />성격유형 검사</h1>
        <p className="caption-en">Personality Assessment Report</p>
        <p className="small muted" style={{ margin: '0 0 28px' }}>
          칼 융의 심리유형론에서 갈라져 나온 4가지 축(에너지 방향·정보 처리·결정 기준·생활양식)을
          바탕으로 만든 검사입니다.
        </p>
        <button className="btn" onClick={start}>시작하기</button>
      </div>
    </div>
  )
}
