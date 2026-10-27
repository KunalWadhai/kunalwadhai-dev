import { useEffect, useState } from 'react'
import { Home, Workflow, Briefcase, Layers, MessageCircle } from 'lucide-react'
import { desktopNav, mobileTabs } from '../../content/nav'
import { profile } from '../../content/profile'

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
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    let ticking = false
    let rafId: number | null = null

    const update = () => {
      const currentScrollY = window.scrollY
      
      setScrolled(currentScrollY > 16)
      
      // Hide tabbar on scroll down, show on scroll up
      // Only on mobile, only after scrolling past hero
      if (window.innerWidth <= 767 && currentScrollY > 300) {
        if (currentScrollY > lastScrollY + 5) { // Add threshold to reduce updates
          setHideTabbar(true)
        } else if (currentScrollY < lastScrollY - 5) {
          setHideTabbar(false)
        }
      } else {
        setHideTabbar(false)
      }
      
      setLastScrollY(currentScrollY)

      // Throttle section detection (expensive operation)
      if (currentScrollY % 50 === 0 || currentScrollY < 100) {
        const ids = ['work', 'experience', 'skills', 'projects', 'proof', 'contact']
        const current = ids
          .map((id) => document.getElementById(id))
          .find((section) => {
            if (!section) return false
            const rect = section.getBoundingClientRect()
            return rect.top <= 140 && rect.bottom > 140
          })
        setActiveSection(current?.id ?? 'top')
      }
      
      ticking = false
      rafId = null
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      rafId = requestAnimationFrame(update)
    }

    // Hide tabbar when keyboard is open (input focused)
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
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [lastScrollY])

  return (
    <>
      <header className={`masthead ${scrolled ? 'masthead--scrolled' : ''}`} role="banner">
        <div className="masthead__inner">
          <a href="/#top" className="masthead__brand">
            <span className="masthead__mark" aria-hidden="true" />
            {profile.name}
          </a>

          <nav className="masthead__nav" aria-label="Primary">
            {desktopNav.map((item) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                className={`masthead__link ${activeSection === item.id ? 'is-active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            className="masthead__cta"
            href={profile.resume.pdfUrl}
            target="_blank"
            rel="noreferrer"
          >
            Résumé
          </a>
        </div>
      </header>

      <nav 
        className={`tabbar ${hideTabbar ? 'tabbar--hidden' : ''}`} 
        aria-label="Mobile"
        aria-hidden={hideTabbar}
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
