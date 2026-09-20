import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { NAV_ITEMS } from '../../features/portfolio/constants'

export interface NavigationProps {
  readonly activeSection: string
  readonly scrolled: boolean
  readonly onScrollTop: () => void
}
function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return { theme, toggle }
}

export function Navigation({ activeSection, scrolled, onScrollTop }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggle } = useTheme()

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const handleNavClick = useCallback(
    (id: string) => {
      closeMenu()
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    [closeMenu],
  )

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeMenu])

  // Lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <nav
      className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
      aria-label="Main navigation"
    >
      <div className="nav__inner">
        <a
          href="#"
          className="nav__brand"
          aria-label="Back to top"
          onClick={(e) => {
            e.preventDefault()
            onScrollTop()
            closeMenu()
          }}
        >
          KunalWadhai
        </a>

        {/* Desktop links */}
        <div className="nav__links" role="list">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              role="listitem"
              className={`nav__link ${activeSection === item.id ? 'nav__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                handleNavClick(item.id)
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="nav__actions">
          <button
            type="button"
            className="nav__icon-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggle}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            type="button"
            className="nav__icon-btn nav__menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="nav__overlay"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
            />
            <motion.div
              id="mobile-menu"
              className="nav__drawer"
              role="dialog"
              aria-label="Navigation menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <nav aria-label="Mobile navigation">
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`nav__drawer-link ${activeSection === item.id ? 'nav__drawer-link--active' : ''}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.2 }}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(item.id)
                    }}
                  >
                    <span className="nav__drawer-num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
