import { useState } from 'react'
import { TYPE_CODES, TYPES } from '../lib/types.js'
import { compareTypes, AXIS_LABEL } from '../lib/compatibility.js'

function TypeGrid({ value, onPick }) {
  return (
    <div className="grid" style={{ marginBottom: 18 }}>
      {TYPE_CODES.map((code) => (
        <button
          key={code}
          className={`grid-item type-tile${value === code ? ' on' : ''}`}
          onClick={() => onPick(code)}
        >
          <div className="type-code">{code}</div>
          <div className="cap">{TYPES[code].nickname}</div>
        </button>
      ))}
    </div>
  )
}

// 궁합 — initialA 가 있으면(방금 나온 내 결과) 그걸 먼저 채워두고 상대 유형만 고르면 된다.
export default function Compatibility({ initialA, onClose }) {
  const [typeA, setTypeA] = useState(initialA || null)
  const [typeB, setTypeB] = useState(null)

  const reset = () => { setTypeA(null); setTypeB(null) }

  if (!typeA || !typeB) {
    return (
      <div className="sheet-bg" onClick={onClose}>
        <div className="sheet" onClick={(e) => e.stopPropagation()}>
          <div className="sheet-grip" />
          <p className="caption-en" style={{ margin: '0 0 2px' }}>Compatibility Check</p>
          <h2 style={{ marginBottom: 4 }}>궁합 볼 유형 두 개를 골라주세요</h2>
          <p className="small muted" style={{ margin: '0 0 20px' }}>
            "몇 % 잘 맞음" 같은 점수는 없습니다 — 두 유형이 어떻게 다르고 비슷한지만 보여드려요.
          </p>

          {!typeA ? (
            <>
              <div className="eyebrow">첫 번째 유형</div>
              <TypeGrid value={typeA} onPick={setTypeA} />
            </>
          ) : (
            <>
              <div className="between" style={{ marginBottom: 12 }}>
                <span className="eyebrow" style={{ marginBottom: 0 }}>첫 번째 유형 — {typeA}</span>
                <button className="link" onClick={reset}>다시 선택</button>
              </div>
              <div className="eyebrow">두 번째 유형</div>
              <TypeGrid value={typeB} onPick={setTypeB} />
            </>
          )}

          <button className="btn ghost" onClick={onClose}>닫기</button>
        </div>
      </div>
    )
  }

  const { results, sameCount } = compareTypes(typeA, typeB)

  return (
    <div className="sheet-bg" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip" />
        <p className="caption-en" style={{ margin: '0 0 10px' }}>Compatibility Check</p>

        <div className="row" style={{ justifyContent: 'center', gap: 14, marginBottom: 6 }}>
          <span className="type-code-lg" style={{ margin: 0 }}>{typeA}</span>
          <span className="muted">×</span>
          <span className="type-code-lg" style={{ margin: 0 }}>{typeB}</span>
        </div>
        <p className="small muted center" style={{ margin: '0 0 20px' }}>
          4개 축 중 {sameCount}개가 같은 성향이에요.
        </p>

        {results.map((r) => (
          <div className="panel" key={r.axisKey}>
            <div className="between" style={{ marginBottom: 8 }}>
              <span className="eyebrow" style={{ marginBottom: 0 }}>{AXIS_LABEL[r.axisKey]}</span>
              <span className="small" style={{ fontWeight: 700 }}>{r.letterA} · {r.letterB}</span>
            </div>
            <p style={{ margin: 0 }}>{r.text}</p>
          </div>
        ))}

        <p className="small muted" style={{ margin: '4px 0 18px' }}>
          "좋은 궁합·나쁜 궁합" 판정이 아니라, 서로 어떤 점에서 비슷하고 다른지 참고하는 용도입니다.
        </p>

        <button className="btn ghost" onClick={reset}>다른 조합 보기</button>
        <button className="btn ghost" style={{ marginTop: 10 }} onClick={onClose}>닫기</button>
      </div>
    </div>
  )
}
