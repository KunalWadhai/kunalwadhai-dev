import { useState, useEffect, useCallback } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

type Theme = 'dark' | 'light' | 'system'

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem('theme')
    return stored === 'dark' || stored === 'light' || stored === 'system' ? stored : null
  } catch {
    return null
  }
}

function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem('theme', theme)
  } catch {
    // The theme still applies for this page view when storage is unavailable.
  }
}

function getResolvedTheme(theme: Theme): 'dark' | 'light' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

function applyTheme(theme: Theme) {
  const resolved = getResolvedTheme(theme)
  const doc = document as Document & { startViewTransition?: (cb: () => void) => void }
  if (typeof doc.startViewTransition === 'function') {
    doc.startViewTransition(() => {
      document.documentElement.setAttribute('data-theme', resolved)
    })
  } else {
    document.documentElement.setAttribute('data-theme', resolved)
  }
  storeTheme(theme)
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    return readStoredTheme() ?? 'system'
  })

  // Cycle: dark → light → system → dark
  const cycle = useCallback(() => {
    const next: Record<Theme, Theme> = { dark: 'light', light: 'system', system: 'dark' }
    const nextTheme = next[theme]
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }, [theme])

  // Listen to system preference changes when in system mode
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  const icons: Record<Theme, React.ReactNode> = {
    dark: <Moon size={14} strokeWidth={2} aria-hidden="true" />,
    light: <Sun size={14} strokeWidth={2} aria-hidden="true" />,
    system: <Monitor size={14} strokeWidth={2} aria-hidden="true" />,
  }

  const labels: Record<Theme, string> = {
    dark: 'Dark mode — click to switch to light',
    light: 'Light mode — click to switch to system',
    system: 'System theme — click to switch to dark',
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={cycle}
      aria-label={labels[theme]}
      title={labels[theme]}
    >
      {icons[theme]}
    </button>
  )
}
