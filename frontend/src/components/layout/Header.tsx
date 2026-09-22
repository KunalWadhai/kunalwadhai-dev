/**
 * Header — Floating pill navbar
 * Detached from viewport edges, rounded, glass/frosted effect
 * Sits ~12px below the top of the screen
 */

import { useState, useEffect } from 'react'
import { profile } from '../../content/profile'

const navItems = [
  { id: 'work',       label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills',     label: 'Skills' },
  { id: 'contact',    label: 'Contact' },
] as const

export function Header() {
  const [scrolled, setScrolled]           = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [menuOpen, setMenuOpen]           = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = navItems.map((item) => document.getElementById(item.id))
      const current = sections.find((section) => {
        if (!section) return false
        const rect = section.getBoundingClientRect()
        return rect.top <= 120 && rect.bottom > 120
      })
      if (current) setActiveSection(current.id)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      {/* Outer wrapper: positions the pill on screen */}
      <div className="header-wrap">
        <header
          className={`header-pill ${scrolled ? 'header-pill--scrolled' : ''}`}
          role="banner"
        >
          <nav className="header-pill__nav" aria-label="Main navigation">

            {/* Brand / name */}
            <button
              type="button"
              onClick={scrollToTop}
              className="header-pill__brand"
              aria-label="Scroll to top"
            >
              {profile.name}
            </button>

            {/* Desktop nav links */}
            <div className="header-pill__links" role="list">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  role="listitem"
                  className={`header-pill__link ${activeSection === item.id ? 'header-pill__link--active' : ''}`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <a
              href={profile.resume.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="header-pill__cta"
              aria-label="Download résumé PDF"
            >
              Download résumé
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="header-pill__hamburger"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className={`hamburger-bar ${menuOpen ? 'hamburger-bar--open' : ''}`} />
              <span className={`hamburger-bar ${menuOpen ? 'hamburger-bar--open' : ''}`} />
              <span className={`hamburger-bar ${menuOpen ? 'hamburger-bar--open' : ''}`} />
            </button>

          </nav>
        </header>

        {/* Mobile dropdown (sits just below the pill) */}
        {menuOpen && (
          <div id="mobile-menu" className="mobile-menu" role="navigation" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="mobile-menu__link"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={profile.resume.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="mobile-menu__link mobile-menu__link--cta"
              onClick={() => setMenuOpen(false)}
            >
              Download résumé
            </a>
          </div>
        )}
      </div>

      <style>{`
        /* ── Outer positioner ── */
        .header-wrap {
          position: fixed;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: min(calc(100vw - 32px), var(--max-width));
          z-index: 200;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 6px;
        }

        /* ── Pill itself ── */
        .header-pill {
          width: 100%;
          height: 52px;
          border-radius: 9999px;   /* full pill */

          /* Glass surface — always present, deepens on scroll */
          background: color-mix(in srgb, var(--bg-raised) 60%, transparent);
          border: 1px solid var(--line-subtle);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);

          /* Subtle inner highlight on top edge */
          box-shadow:
            0 1px 0 0 rgba(255,255,255,0.06) inset,
            0 4px 24px rgba(0,0,0,0.35);

          transition:
            background      var(--dur-base) var(--ease-out),
            border-color    var(--dur-base) var(--ease-out),
            box-shadow      var(--dur-base) var(--ease-out);
        }

        .header-pill--scrolled {
          background: color-mix(in srgb, var(--bg-raised) 80%, transparent);
          border-color: var(--line-strong);
          box-shadow:
            0 1px 0 0 rgba(255,255,255,0.08) inset,
            0 8px 32px rgba(0,0,0,0.45);
        }

        /* ── Inner nav row ── */
        .header-pill__nav {
          display: flex;
          align-items: center;
          height: 100%;
          padding-inline: var(--space-5);
          gap: var(--space-2);
        }

        /* ── Brand ── */
        .header-pill__brand {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          flex-shrink: 0;
          transition: color var(--dur-fast) var(--ease-out);
          margin-right: var(--space-4);
        }
        .header-pill__brand:hover { color: var(--accent); }

        /* ── Desktop links (center) ── */
        .header-pill__links {
          display: flex;
          align-items: center;
          gap: 0;
          flex: 1;
        }

        .header-pill__link {
          position: relative;
          padding: 0.375rem var(--space-3);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          border-radius: 9999px;
          transition: color var(--dur-fast) var(--ease-out),
                      background var(--dur-fast) var(--ease-out);
        }
        .header-pill__link:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.05);
        }
        .header-pill__link--active {
          color: var(--text-primary);
          background: rgba(255,255,255,0.06);
        }

        /* Active indicator dot (below link text) */
        .header-pill__link--active::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--accent);
        }

        /* ── CTA button ── */
        .header-pill__cta {
          flex-shrink: 0;
          padding: 0.375rem var(--space-4);
          border-radius: 9999px;
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text-primary);
          border: 1px solid var(--line-strong);
          background: rgba(255,255,255,0.04);
          transition:
            background  var(--dur-fast) var(--ease-out),
            border-color var(--dur-fast) var(--ease-out),
            color       var(--dur-fast) var(--ease-out);
          white-space: nowrap;
        }
        .header-pill__cta:hover {
          background: var(--accent-wash);
          border-color: var(--accent);
          color: var(--accent);
        }

        /* ── Hamburger (mobile only) ── */
        .header-pill__hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          width: 32px;
          height: 32px;
          padding: 6px;
          border-radius: 9999px;
          border: 1px solid var(--line-subtle);
          background: transparent;
          cursor: pointer;
          flex-shrink: 0;
          margin-left: auto;
        }
        .hamburger-bar {
          display: block;
          width: 100%;
          height: 1.5px;
          background: var(--text-secondary);
          border-radius: 2px;
          transition: transform var(--dur-base) var(--ease-out),
                      opacity   var(--dur-base) var(--ease-out);
        }

        /* ── Mobile menu dropdown pill ── */
        .mobile-menu {
          width: 100%;
          background: color-mix(in srgb, var(--bg-raised) 92%, transparent);
          border: 1px solid var(--line-subtle);
          border-radius: 16px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          padding: var(--space-2);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mobile-menu__link {
          padding: var(--space-3) var(--space-4);
          border-radius: 10px;
          font-size: var(--text-sm);
          color: var(--text-secondary);
          transition: color var(--dur-fast), background var(--dur-fast);
        }
        .mobile-menu__link:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.05);
        }
        .mobile-menu__link--cta {
          margin-top: var(--space-1);
          border: 1px solid var(--line-strong);
          text-align: center;
          color: var(--text-primary);
        }
        .mobile-menu__link--cta:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-wash);
        }

        /* ── Responsive ── */
        @media (max-width: 767px) {
          .header-pill__links,
          .header-pill__cta {
            display: none;
          }
          .header-pill__hamburger {
            display: flex;
          }
        }

        /* Content needs top padding to clear floating nav */
        /* Applied via --nav-clearance in global; fallback here */
      `}</style>
    </>
  )
}
