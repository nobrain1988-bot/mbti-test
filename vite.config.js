import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Capacitor(안드로이드 앱)는 파일을 file:// 로 읽는다.
  // 절대경로(/assets/...)로 빌드되면 앱 안에서 파일을 못 찾아 흰 화면이 뜨므로 상대경로로 고정한다.
  base: './',
  build: { outDir: 'dist' },
  // 이 폴더 안의 다른 앱들과 포트가 겹치지 않게 고정한다.
  // 2026-09-20: 원래 5177 이었는데 허쉬스택(mazes)과 겹쳐서 옮겼다.
  // 5179 로 가려다 다른 프로그램이 이미 쓰고 있어서 5181 로 왔다.
  // 배정 현황: 타로 5174 · game01 5175 · 포트리스 5176 · 허쉬스택 5177 ·
  //            나침 5178 · PawCheck 5180 · MBTI 5181 · 헤어핏 5185 ·
  //            그림찾기 4182 · 별무리 4184
  // 바꿀 땐 설정에만 적지 말고 `npx vite` 로 실제로 떠보는지 확인할 것.
  server: { port: Number(process.env.PORT) || 5181 },
  preview: {
    port: 4177,
    allowedHosts: ['.trycloudflare.com'],
  },
})
