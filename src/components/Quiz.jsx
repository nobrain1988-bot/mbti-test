import { useState } from 'react'
import { LIKERT } from '../lib/questions.js'
import { playMark } from '../lib/sound.js'

// 예전엔 한 문항씩 넘기는 방식이었다. 문항 수가 최대 100개까지 늘어나면서
// "한 개 누르고 다음, 또 누르고 다음"이 지치는 반복이 됐고, 이전 답을 고치기도
// 번거로웠다. 그래서 실제 시험지·설문지처럼 전체를 한 번에 스크롤해서 훑어보고,
// 어느 문항이든 위아래로 자유롭게 오가며 답을 고치는 방식으로 바꿨다.
// (뒤로가기 버튼이 따로 필요 없다 — 스크롤해서 올라가면 그게 뒤로가기다.)
export default function Quiz({ items, onDone }) {
  const [answers, setAnswers] = useState({})
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === items.length

  const select = (id, value) => {
    playMark()
    setAnswers((a) => ({ ...a, [id]: value }))
  }

  return (
    <div className="screen">
      <div className="paper-sticky">
        <div className="between">
          <span className="paper-progress-text">{answeredCount} / {items.length} 답변 완료</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(answeredCount / items.length) * 100}%` }} />
        </div>
      </div>

      <div className="paper-list">
        {items.map((q, i) => {
          const selected = answers[q.id] ?? null
          return (
            <div className="paper-q" key={q.id}>
              <p className="paper-qtext"><span className="paper-qnum">{i + 1}.</span>{q.text}</p>
              <div className="likert-row">
                {LIKERT.map((l) => (
                  <button
                    key={l.value}
                    className={`likert-dot-btn${selected === l.value ? ' on' : ''}`}
                    onClick={() => select(q.id, l.value)}
                    aria-label={l.label}
                    aria-pressed={selected === l.value}
                  >
                    {l.value}
                  </button>
                ))}
              </div>
              <div className="between likert-ends">
                <span className="small muted">전혀 아니다</span>
                <span className="small muted">매우 그렇다</span>
              </div>
            </div>
          )
        })}
      </div>

      <button className="btn" disabled={!allAnswered} onClick={() => onDone(answers)} style={{ marginTop: 8 }}>
        {allAnswered ? '제출하고 결과 보기' : `아직 ${items.length - answeredCount}개 문항이 남았어요`}
      </button>
    </div>
  )
}
