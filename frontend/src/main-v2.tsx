import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './styles/tokens-v2.css'
import './styles/global-v2.css'
import './styles/chrome.css'
// IBM Plex Sans 400 is imported in global-v2.css (critical path)
// Defer heavier weights and mono until after first paint:
import { HomePage } from './pages/HomePage'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ErrorBoundary } from './components/ErrorBoundary'

/** Deferred: load heavier font weights after LCP */
function loadDeferredFonts() {
  // IBM Plex Sans 500 & 600
  Promise.all([
    import('@fontsource/ibm-plex-sans/latin-500.css'),
    import('@fontsource/ibm-plex-sans/latin-600.css'),
    import('@fontsource/ibm-plex-mono/latin-400.css'),
  ]).catch(() => {
    // Non-critical — system mono is fine as fallback
  })
}

/**
 * Scroll-reveal: observe all [data-reveal] elements.
 * Uses IntersectionObserver — one observer for all reveals.
 * Once visible, stays visible (unobserve to avoid thrash).
 */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const elements = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger] > *')

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
  )

  elements.forEach((el) => io.observe(el))

  return () => io.disconnect()
}

/**
 * Count-up: animate numbers in [data-countup] from 0 to their data value.
 * Fires once on first IntersectionObserver trigger.
 */
function initCountUp() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const targets = document.querySelectorAll<HTMLElement>('[data-countup]')
  if (!targets.length) return

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        const end = parseFloat(el.dataset.countup ?? '0')
        const suffix = el.dataset.countupSuffix ?? ''
        const prefix = el.dataset.countupPrefix ?? ''
        const decimals = (end.toString().split('.')[1] ?? '').length
        const duration = 1200
        const start = performance.now()

        const tick = (now: number) => {
          const elapsed = Math.min((now - start) / duration, 1)
          // Ease out cubic
          const progress = 1 - Math.pow(1 - elapsed, 3)
          const value = (end * progress).toFixed(decimals)
          el.textContent = `${prefix}${value}${suffix}`
          if (elapsed < 1) requestAnimationFrame(tick)
          else el.textContent = `${prefix}${end}${suffix}`
        }

        requestAnimationFrame(tick)
        io.unobserve(el)
      })
    },
    { threshold: 0.5 },
  )

  targets.forEach((t) => io.observe(t))
  return () => io.disconnect()
}

/**
 * Cursor spotlight: radial gradient follows cursor on desktop.
 * Uses CSS custom properties to avoid layout — only painting.
 */
function initCursorSpotlight() {
  // Skip on touch / mobile / reduced-motion
  if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return

  const spotlight = document.createElement('div')
  spotlight.className = 'spotlight'
  spotlight.setAttribute('aria-hidden', 'true')
  document.body.appendChild(spotlight)

  let raf: number | null = null

  const move = (x: number, y: number) => {
    if (raf) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      spotlight.style.setProperty('--cursor-x', `${x}px`)
      spotlight.style.setProperty('--cursor-y', `${y}px`)
      raf = null
    })
  }

  const onMove = (e: MouseEvent) => move(e.clientX, e.clientY)
  document.addEventListener('mousemove', onMove, { passive: true })

  return () => {
    document.removeEventListener('mousemove', onMove)
    if (raf) cancelAnimationFrame(raf)
    spotlight.remove()
  }
}

/** App-level effects orchestrator */
function AppEffects() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // Defer heavy fonts after idle
    const idle = (window.requestIdleCallback ?? setTimeout)(() => {
      loadDeferredFonts()
    }, { timeout: 2000 })

    const cleanupReveal = initScrollReveal()
    const cleanupCountup = initCountUp()
    const cleanupSpotlight = initCursorSpotlight()

    return () => {
      ;(window.cancelIdleCallback ?? clearTimeout)(idle as number)
      cleanupReveal?.()
      cleanupCountup?.()
      cleanupSpotlight?.()
    }
  }, [pathname])

  // Hash navigation can happen before the destination route has committed its
  // DOM. Scroll on the next frame so links such as /#work work after SPA returns.
  useEffect(() => {
    if (!hash) return
    const frame = requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element #root not found')
}

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AppEffects />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
