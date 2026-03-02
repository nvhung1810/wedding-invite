import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.tsx'

const base = import.meta.env.BASE_URL
const fontStyle = document.createElement('style')
fontStyle.textContent = `
@font-face {
  font-family: "BlackMango-Medium";
  src: url("${base}fonts/BlackMango-Medium.otf") format("opentype");
  font-display: swap;
}
@font-face {
  font-family: "Ephesis-Regular";
  src: url("${base}fonts/Ephesis-Regular.ttf") format("truetype");
  font-display: swap;
}
@font-face {
  font-family: 'BlackMango';
  src: url('${base}fonts/BlackMango-Medium.woff2') format('woff2');
}
`
document.head.appendChild(fontStyle)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
