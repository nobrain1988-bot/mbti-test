import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// 시스템 폰트 대신 프리텐다드를 쓴다 — 한/영 혼용 화면에서 시스템 폰트보다
// 자간·굵기가 훨씬 정돈돼 보인다. dynamic-subset판이라 실제 쓰인 글자만 받는다.
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
