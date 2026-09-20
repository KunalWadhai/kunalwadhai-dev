/**
 * Home Page — Assembles all sections
 * Order per brief Section 2.3: Hero, Work, Experience, Skills, Projects, Proof, Contact
 */

import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { BackgroundGrid } from '../components/layout/BackgroundGrid'
import { HeroSection } from '../components/sections/HeroSection'
import { WorkSection } from '../components/sections/WorkSection'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { SkillsSection } from '../components/sections/SkillsSection'
import { ProjectsSection } from '../components/sections/ProjectsSection'
import { ProofSection } from '../components/sections/ProofSection'
import { ContactSection } from '../components/sections/ContactSection'

export function HomePage() {
  return (
    <>
      <BackgroundGrid />
      
      {/* Skip link */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <main id="main">
        <HeroSection />
        <hr className="section-divider" aria-hidden="true" />
        
        <WorkSection />
        <hr className="section-divider" aria-hidden="true" />
        
        <ExperienceSection />
        <hr className="section-divider" aria-hidden="true" />
        
        <SkillsSection />
        <hr className="section-divider" aria-hidden="true" />
        
        <ProjectsSection />
        <hr className="section-divider" aria-hidden="true" />
        
        <ProofSection />
        <hr className="section-divider" aria-hidden="true" />
        
        <ContactSection />
      </main>

      <Footer />
    </>
  )
}
