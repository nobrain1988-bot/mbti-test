// 효과음 — 오디오 파일을 넣지 않고 Web Audio 로 그때그때 만들어 쓴다.
//
// 왜 파일이 아닌가: 여기 필요한 건 50ms 짜리 '톡' 소리 두 종류뿐이다. 파일로 넣으면
// 앱 용량이 늘고 저작권 출처를 따져야 하는데, 합성하면 둘 다 없다.
// (타로 앱도 같은 이유로 음악을 파일 없이 만든다)
//
// 톤 원칙 — 이 앱은 '시험지'다. 게임 효과음처럼 튀면 공들여 잡은 톤이 한 번에 깨진다.
// 볼륨을 아주 낮게, 길이를 짧게, 음정도 얌전한 것으로 골랐다. 특히 마킹 소리는
// 100문항 내내 듣는 소리라 존재를 겨우 알아챌 정도여야 한다.

let ctx = null
let enabled = true

// 브라우저는 사용자가 화면을 한 번 건드린 뒤에야 소리를 허용한다.
// 이 앱의 효과음은 전부 탭에서 시작되므로, 첫 호출 때 만들고 필요하면 깨우면 된다.
function audio() {
  if (!enabled) return null
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch {
    return null
  }
}

export function setSoundEnabled(on) {
  enabled = !!on
}

// 한 음. peak 는 최대 볼륨(1.0 이 최대치 — 여기서는 0.05 언저리만 쓴다).
function blip(freq, dur, peak, delay = 0) {
  const c = audio()
  if (!c) return
  try {
    const t0 = c.currentTime + delay
    const osc = c.createOscillator()
    const gain = c.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t0)

    // 0 에서 갑자기 시작하거나 갑자기 끊으면 '틱' 하는 잡음이 섞인다.
    // 아주 짧게 올렸다가 지수적으로 내린다. (0 은 exponentialRamp 에 못 쓴다)
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.006)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)

    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(t0)
    osc.stop(t0 + dur + 0.02)
  } catch {
    /* 소리가 안 나는 건 앱을 멈출 이유가 못 된다 */
  }
}

// 문항 마킹 — 종이에 펜 끝이 닿는 정도의 '톡'.
export const playMark = () => blip(880, 0.05, 0.04)

// 제출 후 결과 — 두 음 올림. 축하까지는 아니고 '끝났습니다' 정도로 둔다.
export function playResult() {
  blip(587.33, 0.16, 0.05) // D5
  blip(880, 0.34, 0.042, 0.1) // A5
}
