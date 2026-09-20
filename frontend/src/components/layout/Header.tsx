/**
 * Header — Fixed nav, minimal, flat
 * Active section: 2px underline in accent (not background fill)
 */

import { useState, useEffect } from 'react'
import { profile } from '../../content/profile'

const navItems = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Simple scroll spy: find first section in viewport
      const sections = navItems.map((item) => document.getElementById(item.id))
      const current = sections.find((section) => {
        if (!section) return false
        const rect = section.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom > 100
      })
      
      if (current) {
        setActiveSection(current.id)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container">
        <nav className="header__nav" aria-label="Main navigation">
          <button
            type="button"
            onClick={scrollToTop}
            className="header__name"
            aria-label="Scroll to top"
          >
            {profile.name}
          </button>

          <div className="header__links">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`header__link ${activeSection === item.id ? 'header__link--active' : ''}`}
              >
                {item.label}
              </a>
            ))}
            <a
              href={profile.resume.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="header__link header__link--resume"
              aria-label="Download résumé PDF"
            >
              Download résumé
            </a>
          </div>
        </nav>
      </div>

      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: var(--nav-height);
          border-bottom: 1px solid transparent;
          transition: background var(--dur-base) var(--ease-out),
                      border-color var(--dur-base) var(--ease-out);
        }

        .header--scrolled {
          background: color-mix(in srgb, var(--bg-base) 90%, transparent);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom-color: var(--line-subtle);
        }

        .header__nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--nav-height);
          gap: var(--space-4);
        }

        .header__name {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-primary);
          transition: color var(--dur-fast) var(--ease-out);
          cursor: pointer;
        }

        .header__name:hover {
          color: var(--accent);
        }

        .header__links {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .header__link {
          position: relative;
          padding: var(--space-2) var(--space-3);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          transition: color var(--dur-fast) var(--ease-out);
        }

        .header__link:hover {
          color: var(--text-primary);
        }

        .header__link--active {
          color: var(--text-primary);
        }

        .header__link--active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: var(--space-3);
          right: var(--space-3);
          height: 2px;
          background: var(--accent);
        }

        .header__link--resume {
          margin-left: var(--space-2);
          padding-inline: var(--space-4);
          border: 1px solid var(--line-strong);
          border-radius: var(--radius);
        }

        .header__link--resume:hover {
          border-color: var(--accent);
          background: var(--accent-wash);
        }

        /* Mobile: hide nav items except resume */
        @media (max-width: 767px) {
          .header__links {
            gap: 0;
          }

          .header__link:not(.header__link--resume) {
            display: none;
          }

          .header__link--resume {
            font-size: var(--text-xs);
            padding: 0.5rem 0.75rem;
          }
        }
      `}</style>
    </header>
  )
}
