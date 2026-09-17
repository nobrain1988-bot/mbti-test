import { useState } from 'react'
import * as store from '../lib/storage.js'
import { setSoundEnabled, playMark } from '../lib/sound.js'

export default function Settings({ open, onClose, onClearData }) {
  const [sound, setSound] = useState(() => store.getSettings().sound !== false)

  const toggleSound = () => {
    const next = !sound
    setSound(next)
    setSoundEnabled(next)
    store.setSettings({ sound: next })
    if (next) playMark() // 켜는 순간 어떤 소리인지 한 번 들려준다
  }

  if (!open) return null
  return (
    <div className="sheet-bg" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip" />
        <h2 style={{ marginBottom: 14 }}>설정</h2>

        <div className="panel">
          <div className="eyebrow">이 검사에 대하여</div>
          <p className="small" style={{ margin: 0 }}>
            칼 융의 심리유형론에서 갈라져 나온 4가지 축을 바탕으로 새로 작성한 문항을 씁니다.
            공식 MBTI® 검사지를 사용하지 않으며, 결과는 자기이해를 돕는 참고 도구일 뿐
            의학적·심리학적 진단이 아닙니다. 실제로 성격은 연속적인 스펙트럼이라, 축마다
            퍼센트를 함께 보여드립니다.
          </p>
        </div>

        <button
          className="btn ghost row"
          style={{ justifyContent: 'space-between', marginBottom: 10 }}
          onClick={toggleSound}
          aria-pressed={sound}
        >
          <span>효과음</span>
          <span style={{ color: sound ? 'var(--ink)' : 'var(--muted)', fontWeight: 700 }}>
            {sound ? '켜짐' : '꺼짐'}
          </span>
        </button>

        <button className="btn ghost" onClick={onClearData}>저장된 결과·기록 전부 지우기</button>
        <button className="btn ghost" style={{ marginTop: 10 }} onClick={onClose}>닫기</button>
      </div>
    </div>
  )
}
