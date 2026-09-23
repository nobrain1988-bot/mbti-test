import { TYPES } from '../lib/types.js'

// 유형 설명 본문 — 내 결과 화면과 유형사전 상세 시트가 공통으로 쓴다.
export default function TypeContent({ code }) {
  const t = TYPES[code]
  if (!t) return null
  return (
    <>
      <div className="type-code-lg">{code}</div>
      <h2 style={{ margin: '4px 0 6px' }}>{t.nickname}</h2>
      <p className="muted" style={{ margin: '0 0 20px' }}>{t.line}</p>

      {t.overview?.map((para, i) => (
        <p key={i} className="small" style={{ margin: i === 0 ? '0 0 12px' : '0 0 20px', lineHeight: 1.7 }}>{para}</p>
      ))}

      <div className="panel">
        <div className="eyebrow">강점</div>
        <ul className="plain-list">{t.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>
      <div className="panel">
        <div className="eyebrow">성장 포인트</div>
        <ul className="plain-list">{t.growth.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>
      <div className="panel">
        <div className="eyebrow">관계에서</div>
        <p style={{ margin: 0 }}>{t.relationships}</p>
      </div>
      <div className="panel">
        <div className="eyebrow">일할 때</div>
        <p style={{ margin: 0 }}>{t.work}</p>
      </div>

      <div className="panel">
        <div className="eyebrow">이 유형이라고 밝힌 사람들</div>
        {t.famous?.length ? (
          <>
            <ul className="plain-list">
              {t.famous.map((f) => (
                <li key={f.name}>{f.name}<span className="muted"> — {f.note}</span></li>
              ))}
            </ul>
            <p className="small muted" style={{ margin: '10px 0 0' }}>
              추측이 아니라 본인이 방송·인터뷰·언론을 통해 직접 밝힌 경우만 실었습니다.
              시간이 지나 다시 검사하면 유형이 바뀔 수 있어요.
            </p>
          </>
        ) : (
          <p className="small muted" style={{ margin: 0 }}>
            아직 본인이 직접 밝힌 걸 확인하지 못했어요. 추측만으로 채우지는 않습니다.
          </p>
        )}
      </div>

      {t.speculated?.length > 0 && (
        <div className="panel">
          <div className="eyebrow">이 유형이라고 전해지는 인물</div>
          <ul className="plain-list">
            {t.speculated.map((f) => (
              <li key={f.name}>{f.name}<span className="muted"> — {f.note}</span></li>
            ))}
          </ul>
          <p className="small muted" style={{ margin: '10px 0 0' }}>
            본인이 밝힌 게 아니라 언론 보도나 성격유형 분석가들 사이에서 전해지는 이야기입니다.
            확인된 사실이 아닙니다.
          </p>
        </div>
      )}
    </>
  )
}
