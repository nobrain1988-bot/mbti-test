// 채점 로직.
//
// 문항은 1~5점(리커트)이고, 3점(보통이다)을 기준으로 -2~+2로 중심화한다.
// 한 축 안에서 두 극(예: E와 I)은 문항 수가 다를 수 있으므로(예: 간단판 4문항 vs 3문항),
// 합계가 아니라 '극별 평균'으로 비교해야 문항 수 차이가 결과를 왜곡하지 않는다.
//
// percent(포지션 비율)는 두 극의 평균 차이(-4~+4)를 0~100%로 펼친 값이다.
// 정확히 50/50이면 둘 중 어느 쪽으로도 기울지 않았다는 뜻 — 이 경우 알파벳상 앞 문자를
// 기본값으로 쓴다(예: E/I 동률이면 E). 실제 성격은 이분법이 아니라 연속선상에 있다는 걸
// 보여주기 위해, 유형 코드 옆에 반드시 이 퍼센트를 같이 보여준다(타입만 딱 잘라 보여주는
// 여느 앱과 다른 부분).

import { AXES } from './questions.js'

function centered(value) {
  return Number(value) - 3
}

export function scoreAxis(axisKey, answers, items) {
  const [poleA, poleB] = AXES.find((a) => a.key === axisKey).poles
  const relevant = items.filter((q) => q.axis === axisKey)
  const sums = { [poleA]: 0, [poleB]: 0 }
  const counts = { [poleA]: 0, [poleB]: 0 }

  for (const q of relevant) {
    const v = answers[q.id]
    if (v == null) continue
    sums[q.pole] += centered(v)
    counts[q.pole] += 1
  }

  const meanA = counts[poleA] ? sums[poleA] / counts[poleA] : 0
  const meanB = counts[poleB] ? sums[poleB] / counts[poleB] : 0
  const diff = meanA - meanB // -4 ~ +4
  const percentA = Math.round(Math.min(100, Math.max(0, 50 + (diff / 4) * 50)))

  return {
    poleA, poleB,
    percentA, percentB: 100 - percentA,
    winner: percentA >= 50 ? poleA : poleB,
  }
}

// answers: { [questionId]: 1~5 }, items: 실제로 물어본 문항 배열(간단판/정밀판)
export function computeResult(answers, items) {
  const axisResults = {}
  let code = ''
  for (const a of AXES) {
    const r = scoreAxis(a.key, answers, items)
    axisResults[a.key] = r
    code += r.winner
  }
  return { code, axes: axisResults }
}
