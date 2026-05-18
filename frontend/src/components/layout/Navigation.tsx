import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS } from '../../features/portfolio/constants'

export interface NavigationProps {
  readonly brand: string
  readonly activeSection: string
  readonly scrolled: boolean
  readonly onScrollTop: () => void
}

export function Navigation({ brand, activeSection, scrolled, onScrollTop }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const handleNavClick = useCallback(
    (id: string) => {
      closeMenu()
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    [closeMenu]
  )

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`} aria-label="Main navigation">
      <div className="nav__inner">
        <a
          href="#"
          className="nav__brand"
          onClick={(e) => {
            e.preventDefault()
            onScrollTop()
            closeMenu()
          }}
        >
          <span className="nav__brand-mark" aria-hidden="true" />
          {brand}
        </a>

        <div className="nav__links nav__links--desktop">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav__link ${activeSection === item.id ? 'nav__link--active' : ''}`}
            >
              {item.label}
            </a>
          ))}
          <a className="nav__cta" href="#contact" data-hover>
            Let&apos;s talk
          </a>
        </div>

        <button
          type="button"
          className="nav__menu-btn"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav__drawer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.id}
                type="button"
                className={`nav__drawer-link ${activeSection === item.id ? 'nav__drawer-link--active' : ''}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav__drawer-index">0{i + 1}</span>
                {item.label}
              </motion.button>
            ))}
            <a className="nav__drawer-cta" href="#contact" onClick={closeMenu}>
              Start a conversation
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
