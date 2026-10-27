import { SiteShell } from '../components/layout/SiteShell'
import { HeroSection } from '../components/sections/HeroSection'
import { WorkSection } from '../components/sections/WorkSection'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { SkillsSection } from '../components/sections/SkillsSection'
import { ProjectsSection } from '../components/sections/ProjectsSection'
import { ProofSection } from '../components/sections/ProofSection'
import { ContactSection } from '../components/sections/ContactSection'

/**
 * Home Page — Ordered per design brief Section 2.3
 * Hero → Work → Experience → Skills → Projects → Proof → Contact
 */
export function HomePage() {
  return (
    <SiteShell>
      <main id="main" className="page-main">
        <div id="top" />
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
    </SiteShell>
  )
}
