// 로컬 저장 — 서버도 로그인도 없다. 전부 이 기기 안에만 남는다.
// (이유는 타로 앱과 동일 — 서버비 0원, 회원가입 이탈 없음, 개인정보 미수집으로 심사 단순화)
//
// localStorage 는 시크릿 모드·저장공간 부족 등에서 예외를 던질 수 있으므로 전부 try 로 감싼다.

const K = {
  seen: 'mbti.seen',       // 첫 실행 여부
  history: 'mbti.history', // 지금까지의 결과 기록
  settings: 'mbti.settings',
}

const read = (k, fallback) => {
  try {
    const raw = localStorage.getItem(k)
    return raw == null ? fallback : JSON.parse(raw)
  } catch { return fallback }
}

const write = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); return true } catch { return false }
}

export const isFirstRun = () => read(K.seen, null) !== true
export const markSeen = () => write(K.seen, true)

const HISTORY_MAX = 30 // 무한정 쌓이면 저장공간을 먹으므로 최근 30개만 남긴다

export const getHistory = () => {
  const h = read(K.history, [])
  return Array.isArray(h) ? h : []
}

export function addHistory(entry) {
  const list = getHistory()
  list.unshift({ at: Date.now(), code: entry.code, track: entry.track, axes: entry.axes })
  write(K.history, list.slice(0, HISTORY_MAX))
}

export const clearHistory = () => write(K.history, [])

const SETTINGS_DEFAULT = {}
export function getSettings() {
  const s = read(K.settings, null)
  return s && typeof s === 'object' ? { ...SETTINGS_DEFAULT, ...s } : { ...SETTINGS_DEFAULT }
}
export function setSettings(patch) {
  const next = { ...getSettings(), ...patch }
  write(K.settings, next)
  return next
}

// 설정창의 '저장된 것 전부 지우기' — 검사 기록을 지운다.
export function clearUserData() {
  try {
    localStorage.removeItem(K.history)
    return true
  } catch { return false }
}
