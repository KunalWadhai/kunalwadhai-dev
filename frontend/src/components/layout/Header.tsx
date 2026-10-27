import { useEffect, useRef, useState } from 'react'
import { Home, Workflow, Briefcase, Layers, MessageCircle } from 'lucide-react'
import { desktopNav, mobileTabs } from '../../content/nav'
import { profile } from '../../content/profile'
import { ThemeToggle } from './ThemeToggle'

const tabIcons = {
  top: Home,
  work: Workflow,
  experience: Briefcase,
  skills: Layers,
  contact: MessageCircle,
} as const

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('top')
  const [hideTabbar, setHideTabbar] = useState(false)
  // Use refs for scroll state — avoids re-registering the listener on every scroll
  const lastScrollY = useRef(0)
  const rafId = useRef<number | null>(null)
  const ticking = useRef(false)

  useEffect(() => {
    const update = () => {
      const currentScrollY = window.scrollY

      setScrolled(currentScrollY > 16)

      // Hide tabbar on scroll down, show on scroll up (mobile only, past hero)
      if (window.innerWidth <= 767 && currentScrollY > 300) {
        if (currentScrollY > lastScrollY.current + 5) {
          setHideTabbar(true)
        } else if (currentScrollY < lastScrollY.current - 5) {
          setHideTabbar(false)
        }
      } else {
        setHideTabbar(false)
      }

      lastScrollY.current = currentScrollY

      // Section detection
      const ids = ['work', 'experience', 'skills', 'projects', 'github', 'proof', 'contact']
      const sections = ids
        .map((id) => document.getElementById(id))
      const current = sections
        .find((section) => {
          if (!section) return false
          const rect = section.getBoundingClientRect()
          return rect.top <= 140 && rect.bottom > 140
        })
      sections.forEach((section) => {
        section?.toggleAttribute('data-current-section', section === current)
      })
      setActiveSection(current?.id ?? 'top')

      ticking.current = false
      rafId.current = null
    }

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      rafId.current = requestAnimationFrame(update)
    }

    const handleFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        setHideTabbar(true)
      }
    }

    const handleFocusOut = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        setHideTabbar(false)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('focusin', handleFocusIn)
    window.addEventListener('focusout', handleFocusOut)
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('focusin', handleFocusIn)
      window.removeEventListener('focusout', handleFocusOut)
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, []) // No deps: listener registers once, uses refs for mutable state

  return (
    <>
      <header className={`masthead ${scrolled ? 'masthead--scrolled' : ''}`} role="banner">
        <div className="masthead__inner">
          <a href="/#top" className="masthead__brand">
            <span className="masthead__mark" aria-hidden="true" />
            {profile.name}
          </a>

          <nav className="masthead__nav" aria-label="Primary">
            {desktopNav.map((item) => {
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.id}
                  href={`/#${item.id}`}
                  className={`masthead__link ${isActive ? 'is-active' : ''}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="masthead__controls">
            <ThemeToggle />
            <a
              className="masthead__cta"
              href={profile.resume.pdfUrl}
              target="_blank"
              rel="noreferrer"
            >
              Résumé
            </a>
          </div>
        </div>
      </header>

      <nav
        className={`tabbar ${hideTabbar ? 'tabbar--hidden' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={hideTabbar ? 'true' : undefined}
      >
        {mobileTabs.map((tab) => {
          const Icon = tabIcons[tab.id]
          const active = tab.id === 'top' ? activeSection === 'top' : activeSection === tab.id
          return (
            <a
              key={tab.id}
              href={tab.href}
              className={`tabbar__item ${active ? 'is-active' : ''}`}
              tabIndex={hideTabbar ? -1 : 0}
              aria-current={active ? 'true' : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{tab.label}</span>
            </a>
          )
        })}
      </nav>
    </>
  )
}
