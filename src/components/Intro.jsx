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
        {/* 시작 화면에 온기를 주려고 넣은 캐릭터 3인. 특정 유형을 가리키지 않는다 —
            16유형 중 셋만 그리면 "얘는 무슨 유형이냐"가 되고, 실존 인물을 닮게
            그리면 초상권 문제가 된다. 성격이 저마다 다르다는 느낌만 준다. */}
        <img className="intro-illustration" src="./types/trio.webp" alt="" aria-hidden="true" />
        {/* 4가지 축을 레고 블록처럼. 장식이면서 동시에 이 검사가 무엇을 재는지
            한 줄로 보여준다 — 글자는 코드로 그리므로 틀릴 일이 없다. */}
        <div className="axis-blocks" aria-hidden="true">
          {[['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']].map(([a, b]) => (
            <span className="axis-pair" key={a}>
              <span className="axis-block">{a}</span>
              <span className="axis-block alt">{b}</span>
            </span>
          ))}
        </div>

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
