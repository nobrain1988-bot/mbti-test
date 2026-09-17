import { useState } from 'react'
import { TYPES, TYPE_CODES } from '../lib/types.js'
import TypeContent from './TypeContent.jsx'

export default function TypeLibrary({ onOpenCompat }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="screen">
      <div className="eyebrow">16가지 유형</div>
      <h1 style={{ marginBottom: 4 }}>유형사전</h1>
      <p className="caption-en" style={{ marginBottom: 16 }}>16 Personality Types</p>

      <button className="tile" onClick={() => onOpenCompat?.()}>
        <span style={{ minWidth: 0 }}>
          <span className="t-title">궁합 보기</span>
          <span className="t-sub" style={{ display: 'block' }}>두 유형을 골라 어떻게 다르고 비슷한지 확인</span>
        </span>
      </button>

      <div className="grid">
        {TYPE_CODES.map((code) => (
          <button key={code} className="grid-item type-tile" onClick={() => setOpen(code)}>
            <div className="type-code">{code}</div>
            <div className="cap">{TYPES[code].nickname}</div>
          </button>
        ))}
      </div>

      {open && (
        <div className="sheet-bg" onClick={() => setOpen(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grip" />
            <TypeContent code={open} />
            <button className="btn ghost" onClick={() => onOpenCompat?.(open)}>이 유형과 궁합 보기</button>
            <button className="btn ghost" style={{ marginTop: 10 }} onClick={() => setOpen(null)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  )
}
