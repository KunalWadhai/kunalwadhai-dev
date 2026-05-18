import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Footer } from '../../components/layout/Footer'
import { Navigation } from '../../components/layout/Navigation'
import { SiteChrome } from '../../components/layout/SiteChrome'
import { AboutSection } from '../../components/portfolio/AboutSection'
import { ContactSection } from '../../components/portfolio/ContactSection'
import { ExperienceSection } from '../../components/portfolio/ExperienceSection'
import { CodingProfilesSection } from '../../components/portfolio/CodingProfilesSection'
import { GitHubSection } from '../../components/portfolio/GitHubSection'
import { HeroSection } from '../../components/portfolio/HeroSection'
import { ProjectsSection } from '../../components/portfolio/ProjectsSection'
import { SkillsSection } from '../../components/portfolio/SkillsSection'
import { TechMarquee } from '../../components/portfolio/TechMarquee'
import { TestimonialsSection } from '../../components/portfolio/TestimonialsSection'
import { NAV_SECTION_IDS } from './constants'
import { usePortfolioData } from './hooks'
import { useScrollSpy } from '../../hooks/useScrollSpy'

const AIChatWidget = lazy(() =>
  import('../../components/AIChatWidget').then((m) => ({ default: m.AIChatWidget }))
)

export default function PortfolioPage() {
  const { data, githubSummary, githubHandle, state } = usePortfolioData()
  const [scrolled, setScrolled] = useState(false)
  const activeSection = useScrollSpy(NAV_SECTION_IDS)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [])

  return (
    <>
      <SiteChrome />

      <Navigation
        brand={data.name.split(' ')[0]}
        activeSection={activeSection}
        scrolled={scrolled}
        onScrollTop={scrollToTop}
      />

      <main className="page">
        <HeroSection data={data} dataState={state} />
        <TechMarquee />
        <AboutSection />
        <ExperienceSection experience={data.experience} />
        <ProjectsSection projects={data.projects} />
        <GitHubSection summary={githubSummary} handle={githubHandle} />
        <CodingProfilesSection dashboards={data.programmingDashboards} />
        <SkillsSection />
        <TestimonialsSection />
        <ContactSection data={data} />
      </main>

      <Footer onScrollTop={scrollToTop} />

      <Suspense fallback={null}>
        <AIChatWidget />
      </Suspense>
    </>
  )
}
