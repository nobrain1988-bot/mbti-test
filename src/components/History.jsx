import { useEffect, useState } from 'react'
import * as store from '../lib/storage.js'
import { TYPES } from '../lib/types.js'
import TypeContent from './TypeContent.jsx'

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function History({ refreshKey }) {
  const [list, setList] = useState([])
  const [open, setOpen] = useState(null)

  useEffect(() => { setList(store.getHistory()) }, [refreshKey])

  if (!list.length) {
    return (
      <div className="screen">
        <div className="eyebrow">기록</div>
        <h1 style={{ marginBottom: 8 }}>아직 기록이 없어요</h1>
        <p className="small muted">검사를 마치면 여기에 날짜별로 남습니다.</p>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="eyebrow">기록</div>
      <h1 style={{ marginBottom: 14 }}>지난 검사 {list.length}번</h1>

      {list.map((e, i) => (
        <button key={i} className="tile" onClick={() => setOpen(e)}>
          <span className="t-icon type-code" style={{ minWidth: 56 }}>{e.code}</span>
          <span style={{ minWidth: 0 }}>
            <span className="t-title">{TYPES[e.code]?.nickname || e.code}</span>
            <span className="t-sub" style={{ display: 'block' }}>
              {formatDate(e.at)} · {e.track === 'short' ? '간단 검사' : '정밀 검사'}
            </span>
          </span>
        </button>
      ))}

      {open && (
        <div className="sheet-bg" onClick={() => setOpen(null)}>
          <div className="sheet" onClick={(ev) => ev.stopPropagation()}>
            <div className="sheet-grip" />
            <TypeContent code={open.code} />
            <button className="btn ghost" onClick={() => setOpen(null)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  )
}
