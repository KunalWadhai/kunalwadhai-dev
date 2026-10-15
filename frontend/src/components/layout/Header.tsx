import { useEffect, useState } from 'react'
import { Bot, FolderGit2, Home, MessageCircle, Workflow } from 'lucide-react'
import { desktopNav, mobileTabs } from '../../content/nav'
import { profile } from '../../content/profile'

const tabIcons = {
  top: Home,
  work: Workflow,
  github: FolderGit2,
  agent: Bot,
  contact: MessageCircle,
} as const

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('top')

  useEffect(() => {
    let ticking = false

    const update = () => {
      setScrolled(window.scrollY > 16)
      const ids = ['work', 'github', 'agent', 'experience', 'contact']
      const current = ids
        .map((id) => document.getElementById(id))
        .find((section) => {
          if (!section) return false
          const rect = section.getBoundingClientRect()
          return rect.top <= 140 && rect.bottom > 140
        })
      setActiveSection(current?.id ?? 'top')
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

      <nav className="tabbar" aria-label="Mobile">
        {mobileTabs.map((tab) => {
          const Icon = tabIcons[tab.id]
          const active = tab.id === 'top' ? activeSection === 'top' : activeSection === tab.id
          return (
            <a key={tab.id} href={tab.href} className={`tabbar__item ${active ? 'is-active' : ''}`}>
              <Icon size={18} aria-hidden="true" />
              <span>{tab.label}</span>
            </a>
          )
        })}
      </nav>
    </>
  )
}
