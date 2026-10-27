import { SiteShell } from '../components/layout/SiteShell'
import { HeroSection } from '../components/sections/HeroSection'
import { WorkSection } from '../components/sections/WorkSection'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { SkillsSection } from '../components/sections/SkillsSection'
import { ProjectsSection } from '../components/sections/ProjectsSection'
import { GitHubGraphSection } from '../components/sections/GitHubGraphSection'
import { ProofSection } from '../components/sections/ProofSection'
import { ContactSection } from '../components/sections/ContactSection'

/**
 * Keep all section content in the page tree so hash navigation always has a
 * real target and below-fold content does not wait on separate JS chunks.
 */

export function HomePage() {
  return (
    <SiteShell>
      <main id="main" className="page-main">
        <div id="top" />

        {/* Hero: eager — this is the LCP element */}
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
        <GitHubGraphSection />
        <hr className="section-divider" aria-hidden="true" />
        <ProofSection />
        <hr className="section-divider" aria-hidden="true" />
        <ContactSection />
      </main>
    </SiteShell>
  )
}
