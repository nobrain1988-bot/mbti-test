import TypeContent from './TypeContent.jsx'
import { IconShare } from './icons.jsx'

const AXIS_LABEL = {
  EI: '에너지의 방향',
  SN: '정보를 받아들이는 방식',
  TF: '결정을 내리는 기준',
  JP: '생활양식',
}

// 한쪽으로 크게 기운 결과(예: S 15% / N 85%)에서는 좁은 쪽 막대보다 글자가 길어서
// 흰 글씨가 흰 바탕으로 삐져나와 안 읽혔다. 그 경우 글자를 막대 바깥으로 옮기고
// 색을 뒤집는다. 26% 는 "P 100%" 같은 가장 긴 라벨이 들어가는 최소 폭이다.
const LABEL_FITS_AT = 26

function AxisBar({ axisKey, r }) {
  const leftOut = r.percentA < LABEL_FITS_AT
  const rightOut = r.percentB < LABEL_FITS_AT
  return (
    <div className="axis-row">
      <div className="axis-label small muted">{AXIS_LABEL[axisKey]}</div>
      <div className="axis-bar">
        <div className="axis-fill" style={{ width: `${r.percentA}%` }} />
        <span
          className={`axis-tag left${leftOut ? ' out' : ''}`}
          style={leftOut ? { left: `calc(${r.percentA}% + 9px)` } : undefined}
        >
          {r.poleA} {r.percentA}%
        </span>
        <span
          className={`axis-tag right${rightOut ? ' out' : ''}`}
          style={rightOut ? { right: `calc(${r.percentB}% + 9px)` } : undefined}
        >
          {r.percentB}% {r.poleB}
        </span>
      </div>
    </div>
  )
}

export default function ResultView({ code, axes, track, onShare, onRetake, onCompat }) {
  return (
    <div>
      {axes && (
        <div className="panel" style={{ marginBottom: 18 }}>
          <p className="caption-en" style={{ margin: '0 0 4px' }}>Results Report</p>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            {track === 'short' ? '간단 검사 · 48문항' : '정밀 검사 · 100문항'} 결과
          </div>
          {Object.entries(axes).map(([k, r]) => <AxisBar key={k} axisKey={k} r={r} />)}
          <p className="small muted" style={{ margin: '10px 0 0' }}>
            50%에 가까울수록 그 축에서 어느 한쪽으로 뚜렷하게 기울지 않았다는 뜻입니다.
          </p>
        </div>
      )}

      <TypeContent code={code} />

      <div style={{ marginTop: 8 }}>
        {onShare && (
          <button className="btn ghost row" onClick={onShare}><IconShare /> 결과 공유하기</button>
        )}
        {onCompat && (
          <button className="btn ghost" style={{ marginTop: 10 }} onClick={onCompat}>이 유형과 궁합 보기</button>
        )}
        {onRetake && (
          <button className="btn ghost" style={{ marginTop: 10 }} onClick={onRetake}>다시 검사하기</button>
        )}
      </div>
    </div>
  )
}
