// 문항 은행 — 축(axis)당 25문항(정밀판 100문항), 그중 12문항씩(48문항)을 간단판으로 쓴다.
//
// 근거: 각 문항은 아래 4가지 축(칼 융의 심리유형론에서 갈라져 나온, 오늘날 성격유형
// 검사 전반에서 쓰이는 구분)의 '실제 특성 설명'을 1인칭 진술문으로 옮긴 것이다.
//   EI — 에너지의 방향: 외부 자극/사람(E) ↔ 내면 성찰/혼자(I)
//   SN — 정보를 받아들이는 방식: 구체적 사실/경험(S) ↔ 패턴/가능성(N)
//   TF — 결정의 기준: 논리/원칙(T) ↔ 가치관/사람에게 미치는 영향(F)
//   JP — 생활양식: 계획/마감(J) ↔ 유연함/즉흥(P)
//
// 마이어스-브릭스 공식 93문항 검사지는 저작권이 있어 그대로 쓰지 않는다.
// 여기 문항은 전부 새로 쓴 것이다.
//
// 응답은 5점 리커트(1=전혀 아니다 · 5=매우 그렇다)이며, 채점 편향(무조건 "그렇다"를
// 누르는 습관)을 줄이기 위해 한 축 안에서도 두 극(E/I 등) 양쪽을 섞어서 묻는다.
//
// 두 트랙 관계: short:true 인 48문항이 그대로 간단판이고, 정밀판(100문항)은
// 거기에 축당 13문항씩을 더 보태 신뢰도를 끌어올린 상위 확장판이다 — 표준
// 심리검사에서 단축형을 만드는 방식(예: BFI-44 → BFI-10)을 거꾸로 적용한
// 셈이다: 새 문항을 만든 게 아니라, 이미 쓰던 48문항을 그대로 단축형(간단판)으로
// 두고 그 위에 정밀판을 쌓았다 — 두 트랙 사이에 서로 다른 잣대가 끼어들지 않는다.
export const AXES = [
  { key: 'EI', poles: ['E', 'I'] },
  { key: 'SN', poles: ['S', 'N'] },
  { key: 'TF', poles: ['T', 'F'] },
  { key: 'JP', poles: ['J', 'P'] },
]

export const LIKERT = [
  { value: 1, label: '전혀 아니다' },
  { value: 2, label: '아니다' },
  { value: 3, label: '보통이다' },
  { value: 4, label: '그렇다' },
  { value: 5, label: '매우 그렇다' },
]

export const QUESTIONS = [
  // ── EI (25문항: E13 · I12) ────────────────────────────────────
  { id: 'ei-e1', axis: 'EI', pole: 'E', short: true, text: '사람들과 오래 어울리고 나면 오히려 에너지가 채워지는 편이다.' },
  { id: 'ei-e2', axis: 'EI', pole: 'E', short: true, text: '생각을 말로 하면서 정리하는 걸 좋아한다.' },
  { id: 'ei-e3', axis: 'EI', pole: 'E', short: true, text: '새로운 모임에 가면 내가 먼저 말을 걸어보는 편이다.' },
  { id: 'ei-e4', axis: 'EI', pole: 'E', short: true, text: '혼자 오래 있으면 좀이 쑤시고 답답해진다.' },
  { id: 'ei-e5', axis: 'EI', pole: 'E', short: true, text: '여러 사람과 동시에 왁자지껄 대화하는 자리가 즐겁다.' },
  { id: 'ei-e6', axis: 'EI', pole: 'E', short: true, text: '주말엔 집에 있기보다 밖에 나가 사람을 만나야 활력이 생긴다.' },
  { id: 'ei-e7', axis: 'EI', pole: 'E', short: false, text: '파티나 행사에서 초면인 사람과도 쉽게 대화를 튼다.' },
  { id: 'ei-e8', axis: 'EI', pole: 'E', short: false, text: '하루 종일 사람들과 함께 있어도 별로 지치지 않는다.' },
  { id: 'ei-e9', axis: 'EI', pole: 'E', short: false, text: '생각이 정리되기 전에 일단 말부터 꺼내고 보는 편이다.' },
  { id: 'ei-e10', axis: 'EI', pole: 'E', short: false, text: '여러 사람이 모인 자리에서 자연스럽게 대화를 주도하게 된다.' },
  { id: 'ei-e11', axis: 'EI', pole: 'E', short: false, text: '조용한 곳보다 활기차고 시끌시끌한 곳에서 오히려 집중이 잘 된다.' },
  { id: 'ei-e12', axis: 'EI', pole: 'E', short: false, text: '새로운 사람을 만나는 자리가 생기면 반가운 마음이 먼저 든다.' },
  { id: 'ei-e13', axis: 'EI', pole: 'E', short: false, text: '하고 싶은 말을 마음속에 담아두기보다 바로바로 표현하는 편이다.' },
  { id: 'ei-i1', axis: 'EI', pole: 'I', short: true, text: '사람 많은 자리를 다녀오면 혼자만의 시간이 꼭 필요하다.' },
  { id: 'ei-i2', axis: 'EI', pole: 'I', short: true, text: '생각을 말하기 전에 머릿속으로 충분히 정리하는 편이다.' },
  { id: 'ei-i3', axis: 'EI', pole: 'I', short: true, text: '친한 소수와 깊게 지내는 게 여러 사람과 넓게 지내는 것보다 편하다.' },
  { id: 'ei-i4', axis: 'EI', pole: 'I', short: true, text: '낯선 자리에서는 먼저 다가가기보다 상황을 지켜보는 편이다.' },
  { id: 'ei-i5', axis: 'EI', pole: 'I', short: true, text: '전화 통화보다 문자나 메신저로 이야기하는 게 더 편하다.' },
  { id: 'ei-i6', axis: 'EI', pole: 'I', short: true, text: '주말에 집에서 혼자 시간을 보내고 나면 오히려 재충전된 느낌이 든다.' },
  { id: 'ei-i7', axis: 'EI', pole: 'I', short: false, text: '하루 일정 중 최소한 얼마간은 혼자 있는 시간이 반드시 필요하다.' },
  { id: 'ei-i8', axis: 'EI', pole: 'I', short: false, text: '단체 채팅방보다 1:1 대화가 훨씬 편하다.' },
  { id: 'ei-i9', axis: 'EI', pole: 'I', short: false, text: '회의나 모임에서 발언하기 전에 머릿속으로 여러 번 검토한다.' },
  { id: 'ei-i10', axis: 'EI', pole: 'I', short: false, text: '사람들과 오래 있으면 말수가 점점 줄어드는 편이다.' },
  { id: 'ei-i11', axis: 'EI', pole: 'I', short: false, text: '새로운 사람들과 어울리는 자리보다 익숙한 사람과 보내는 시간이 더 편하다.' },
  { id: 'ei-i12', axis: 'EI', pole: 'I', short: false, text: '감정이나 생각을 즉흥적으로 말하기보다 글로 정리해서 전달하는 게 편하다.' },

  // ── SN (25문항: S12 · N13) ────────────────────────────────────
  { id: 'sn-s1', axis: 'SN', pole: 'S', short: true, text: '이론보다 실제로 써본 경험과 사례를 더 신뢰한다.' },
  { id: 'sn-s2', axis: 'SN', pole: 'S', short: true, text: '일할 때 세부 사항과 절차를 꼼꼼히 챙기는 편이다.' },
  { id: 'sn-s3', axis: 'SN', pole: 'S', short: true, text: '먼 미래보다 지금 눈앞의 현실적인 문제부터 해결하고 싶다.' },
  { id: 'sn-s4', axis: 'SN', pole: 'S', short: true, text: '설명을 들을 때 구체적인 예시가 있어야 이해가 잘 된다.' },
  { id: 'sn-s5', axis: 'SN', pole: 'S', short: true, text: '이미 검증된 방법을 따르는 게 새로운 방법을 시도하는 것보다 안심된다.' },
  { id: 'sn-s6', axis: 'SN', pole: 'S', short: true, text: '있었던 일을 말할 때 순서와 사실을 정확하게 전달하려 한다.' },
  { id: 'sn-s7', axis: 'SN', pole: 'S', short: false, text: '계획을 세울 때 과거에 실제로 효과 있었던 방식을 우선으로 고려한다.' },
  { id: 'sn-s8', axis: 'SN', pole: 'S', short: false, text: '손으로 직접 만지거나 다뤄봐야 제대로 이해했다는 느낌이 든다.' },
  { id: 'sn-s9', axis: 'SN', pole: 'S', short: false, text: '보고서나 설명에 숫자·통계 같은 구체적 자료가 있어야 신뢰가 간다.' },
  { id: 'sn-s10', axis: 'SN', pole: 'S', short: false, text: '지금 당장 처리해야 할 일을 뒤로 미루고 딴 생각을 하는 걸 싫어한다.' },
  { id: 'sn-s11', axis: 'SN', pole: 'S', short: false, text: '오감으로 확인할 수 있는 사실을 가장 우선으로 신뢰한다.' },
  { id: 'sn-s12', axis: 'SN', pole: 'S', short: false, text: '매뉴얼이나 설명서를 순서대로 따라 하는 걸 선호한다.' },
  { id: 'sn-n1', axis: 'SN', pole: 'N', short: true, text: '지금 상황보다 앞으로 어떻게 될지 가능성을 상상하는 게 더 재밌다.' },
  { id: 'sn-n2', axis: 'SN', pole: 'N', short: true, text: '여러 정보를 보면 그 안의 공통된 패턴이나 의미가 먼저 눈에 들어온다.' },
  { id: 'sn-n3', axis: 'SN', pole: 'N', short: true, text: '정해진 방식보다 새로운 방식을 시도해보고 싶어진다.' },
  { id: 'sn-n4', axis: 'SN', pole: 'N', short: true, text: '대화하다가 원래 주제에서 벗어나 아이디어가 계속 뻗어나가곤 한다.' },
  { id: 'sn-n5', axis: 'SN', pole: 'N', short: true, text: '세부적인 절차보다 전체적인 그림과 방향이 더 중요하다고 느낀다.' },
  { id: 'sn-n6', axis: 'SN', pole: 'N', short: true, text: '비유나 은유로 설명하는 걸 좋아하고, 또 잘 알아듣는다.' },
  { id: 'sn-n7', axis: 'SN', pole: 'N', short: false, text: '지금 배우는 것이 나중에 어디에 쓰일지 자꾸 연결지어 상상하게 된다.' },
  { id: 'sn-n8', axis: 'SN', pole: 'N', short: false, text: '같은 사물이나 상황을 봐도 남들과 다른 관점으로 해석할 때가 많다.' },
  { id: 'sn-n9', axis: 'SN', pole: 'N', short: false, text: '익숙한 절차를 그대로 따르기보다 더 나은 방법이 없을지 고민하게 된다.' },
  { id: 'sn-n10', axis: 'SN', pole: 'N', short: false, text: '대화나 책에서 상징이나 숨은 의미를 찾아내는 걸 좋아한다.' },
  { id: 'sn-n11', axis: 'SN', pole: 'N', short: false, text: '먼 미래의 가능성을 그려보는 상상을 자주 한다.' },
  { id: 'sn-n12', axis: 'SN', pole: 'N', short: false, text: '여러 아이디어를 연결해서 새로운 개념을 만들어내는 걸 즐긴다.' },
  { id: 'sn-n13', axis: 'SN', pole: 'N', short: false, text: '구체적인 사실 하나보다 그것들이 만드는 전체 흐름이 더 궁금하다.' },

  // ── TF (25문항: T13 · F12) ────────────────────────────────────
  { id: 'tf-t1', axis: 'TF', pole: 'T', short: true, text: '결정할 때 사람 감정보다 논리적으로 맞는지를 먼저 따진다.' },
  { id: 'tf-t2', axis: 'TF', pole: 'T', short: true, text: '누군가 고민을 말하면 위로보다 해결책을 먼저 제시하게 된다.' },
  { id: 'tf-t3', axis: 'TF', pole: 'T', short: true, text: '틀린 부분은 상대가 서운해하더라도 짚어주는 게 맞다고 생각한다.' },
  { id: 'tf-t4', axis: 'TF', pole: 'T', short: true, text: '감정적인 호소보다 근거와 데이터가 있는 주장에 더 설득된다.' },
  { id: 'tf-t5', axis: 'TF', pole: 'T', short: true, text: '공정한 원칙을 지키는 게 상황을 봐주는 것보다 중요하다.' },
  { id: 'tf-t6', axis: 'TF', pole: 'T', short: true, text: '일할 때는 사적인 감정과 업무를 분리해야 한다고 생각한다.' },
  { id: 'tf-t7', axis: 'TF', pole: 'T', short: false, text: '결정을 내릴 때 장단점을 논리적으로 따져본 뒤에야 마음이 놓인다.' },
  { id: 'tf-t8', axis: 'TF', pole: 'T', short: false, text: '감정에 호소하는 설득보다 근거가 탄탄한 설득에 더 마음이 움직인다.' },
  { id: 'tf-t9', axis: 'TF', pole: 'T', short: false, text: '일 처리에서 능력과 성과가 관계보다 우선이라고 생각한다.' },
  { id: 'tf-t10', axis: 'TF', pole: 'T', short: false, text: '갈등 상황에서는 누가 옳은지를 먼저 가리고 싶어진다.' },
  { id: 'tf-t11', axis: 'TF', pole: 'T', short: false, text: '원칙이 한 번 정해지면 예외 없이 지켜야 한다고 생각하는 편이다.' },
  { id: 'tf-t12', axis: 'TF', pole: 'T', short: false, text: '비판을 받아도 그 내용이 타당하면 감정적으로 크게 흔들리지 않는다.' },
  { id: 'tf-t13', axis: 'TF', pole: 'T', short: false, text: '누군가를 평가할 때 그 사람의 능력과 실적을 가장 먼저 본다.' },
  { id: 'tf-f1', axis: 'TF', pole: 'F', short: true, text: '결정을 내릴 때 그로 인해 사람들이 어떤 감정을 느낄지부터 생각한다.' },
  { id: 'tf-f2', axis: 'TF', pole: 'F', short: true, text: '논리적으로는 맞아도 사람 마음이 다치면 다른 방법을 찾고 싶다.' },
  { id: 'tf-f3', axis: 'TF', pole: 'F', short: true, text: '누군가 고민을 말하면 해결책보다 먼저 공감해주게 된다.' },
  { id: 'tf-f4', axis: 'TF', pole: 'F', short: true, text: '관계의 조화를 지키는 게 옳고 그름을 가리는 것보다 중요할 때가 많다.' },
  { id: 'tf-f5', axis: 'TF', pole: 'F', short: true, text: '비판을 할 때 상대가 상처받지 않을 표현을 신경 써서 고른다.' },
  { id: 'tf-f6', axis: 'TF', pole: 'F', short: true, text: '원칙보다 그 사람의 상황과 사정을 먼저 헤아리는 편이다.' },
  { id: 'tf-f7', axis: 'TF', pole: 'F', short: false, text: '결정을 내릴 때 관련된 사람들의 감정을 가장 먼저 고려한다.' },
  { id: 'tf-f8', axis: 'TF', pole: 'F', short: false, text: '논리적으로 옳더라도 분위기가 나빠질 것 같으면 다르게 말하는 편이다.' },
  { id: 'tf-f9', axis: 'TF', pole: 'F', short: false, text: '팀의 화합이 깨지는 것이 성과가 조금 떨어지는 것보다 더 신경 쓰인다.' },
  { id: 'tf-f10', axis: 'TF', pole: 'F', short: false, text: '누군가를 평가할 때 그 사람의 노력과 진심을 먼저 본다.' },
  { id: 'tf-f11', axis: 'TF', pole: 'F', short: false, text: '비판을 받으면 내용과 별개로 감정적으로 꽤 오래 신경이 쓰인다.' },
  { id: 'tf-f12', axis: 'TF', pole: 'F', short: false, text: '원칙보다 그 순간 그 사람에게 필요한 게 무엇인지를 더 중요하게 여긴다.' },

  // ── JP (25문항: J12 · P13) ────────────────────────────────────
  { id: 'jp-j1', axis: 'JP', pole: 'J', short: true, text: '여행 가기 전에 일정을 미리 정해두어야 마음이 편하다.' },
  { id: 'jp-j2', axis: 'JP', pole: 'J', short: true, text: '할 일 목록을 만들고 하나씩 지워나가는 걸 좋아한다.' },
  { id: 'jp-j3', axis: 'JP', pole: 'J', short: true, text: '마감 기한보다 미리 끝내놓아야 마음이 편하다.' },
  { id: 'jp-j4', axis: 'JP', pole: 'J', short: true, text: '결정을 내리고 나면 웬만하면 바꾸지 않고 밀고 나간다.' },
  { id: 'jp-j5', axis: 'JP', pole: 'J', short: true, text: '주변이 정리정돈 되어 있지 않으면 신경이 쓰인다.' },
  { id: 'jp-j6', axis: 'JP', pole: 'J', short: true, text: '계획이 틀어지면 스트레스를 많이 받는 편이다.' },
  { id: 'jp-j7', axis: 'JP', pole: 'J', short: false, text: '여행이나 일정 전에 준비물 목록을 미리 만들어두는 편이다.' },
  { id: 'jp-j8', axis: 'JP', pole: 'J', short: false, text: '하나의 일을 끝내지 않은 채 다른 일을 시작하면 마음이 불편하다.' },
  { id: 'jp-j9', axis: 'JP', pole: 'J', short: false, text: '약속 시간보다 여유 있게 도착해야 마음이 편하다.' },
  { id: 'jp-j10', axis: 'JP', pole: 'J', short: false, text: '결정을 미루는 것보다 조금 서둘러서라도 결론을 내리는 게 낫다고 생각한다.' },
  { id: 'jp-j11', axis: 'JP', pole: 'J', short: false, text: '눈에 보이는 곳이 정돈되어 있지 않으면 다른 일에 집중하기 어렵다.' },
  { id: 'jp-j12', axis: 'JP', pole: 'J', short: false, text: '예상치 못한 일정 변경이 생기면 하루 전체 리듬이 깨지는 느낌이다.' },
  { id: 'jp-p1', axis: 'JP', pole: 'P', short: true, text: '여행은 큰 틀만 정하고 그때그때 즉흥적으로 다니는 게 좋다.' },
  { id: 'jp-p2', axis: 'JP', pole: 'P', short: true, text: '마감이 가까워져야 오히려 집중이 잘 되는 편이다.' },
  { id: 'jp-p3', axis: 'JP', pole: 'P', short: true, text: '계획이 바뀌어도 크게 스트레스받지 않고 유연하게 대응한다.' },
  { id: 'jp-p4', axis: 'JP', pole: 'P', short: true, text: '선택지를 마지막 순간까지 열어두는 걸 좋아한다.' },
  { id: 'jp-p5', axis: 'JP', pole: 'P', short: true, text: '정해진 규칙보다 상황에 맞게 즉석에서 판단하는 게 편하다.' },
  { id: 'jp-p6', axis: 'JP', pole: 'P', short: true, text: '하나를 끝내기 전에 여러 일을 동시에 벌여놓는 편이다.' },
  { id: 'jp-p7', axis: 'JP', pole: 'P', short: false, text: '계획은 대략적인 방향만 있으면 되고, 세부는 그때그때 정해도 된다고 생각한다.' },
  { id: 'jp-p8', axis: 'JP', pole: 'P', short: false, text: '여러 가지 일을 동시에 벌여두고 오가며 진행하는 게 오히려 편하다.' },
  { id: 'jp-p9', axis: 'JP', pole: 'P', short: false, text: '마감이 닥쳐야 진짜 실력이 나온다고 믿는 편이다.' },
  { id: 'jp-p10', axis: 'JP', pole: 'P', short: false, text: '정해진 순서보다 그날그날 기분과 상황에 맞춰 움직이는 걸 좋아한다.' },
  { id: 'jp-p11', axis: 'JP', pole: 'P', short: false, text: '완벽하게 준비되지 않아도 일단 시작하고 보는 편이다.' },
  { id: 'jp-p12', axis: 'JP', pole: 'P', short: false, text: '새로운 정보가 들어오면 이미 세운 계획도 미련 없이 바꾼다.' },
  { id: 'jp-p13', axis: 'JP', pole: 'P', short: false, text: '규칙적인 루틴보다 그때그때 달라지는 하루가 더 즐겁다.' },
]

export function questionsFor(track) {
  const list = track === 'short' ? QUESTIONS.filter((q) => q.short) : QUESTIONS
  // 축이 한쪽으로 몰려서 연속으로 나오면 응답자가 패턴을 눈치채고 대충 누르게 된다.
  // 축을 번갈아 섞은 뒤 같은 축 안에서는 원래 순서(다양한 극이 섞인 순서)를 유지한다.
  const byAxis = AXES.map((a) => list.filter((q) => q.axis === a.key))
  const out = []
  let i = 0
  while (out.length < list.length) {
    for (const group of byAxis) if (group[i]) out.push(group[i])
    i += 1
  }
  return out
}
