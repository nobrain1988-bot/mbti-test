import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Capacitor(안드로이드 앱)는 파일을 file:// 로 읽는다.
  // 절대경로(/assets/...)로 빌드되면 앱 안에서 파일을 못 찾아 흰 화면이 뜨므로 상대경로로 고정한다.
  base: './',
  build: { outDir: 'dist' },
  // 이 폴더 안의 다른 앱들(오복사주 5173 · 타로 5174 · game01 5175 · 포트리스 5176)과
  // 포트가 겹치지 않게 고정한다.
  server: { port: Number(process.env.PORT) || 5177 },
  preview: {
    port: 4177,
    allowedHosts: ['.trycloudflare.com'],
  },
})
