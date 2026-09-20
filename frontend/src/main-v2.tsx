/**
 * Main v2 — Redesign entry point with new styles
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App-v2.tsx'

// Import new v2 styles
import './styles/tokens-v2.css'
import './styles/global-v2.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
