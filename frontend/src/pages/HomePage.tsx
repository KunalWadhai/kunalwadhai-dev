import { SiteShell } from '../components/layout/SiteShell'
import { HeroSection } from '../components/sections/HeroSection'
import { ArchitectureFlowSection } from '../components/sections/ArchitectureFlowSection'
import { WorkSection } from '../components/sections/WorkSection'
import { GitHubGraphSection } from '../components/sections/GitHubGraphSection'
import { AgentSection } from '../components/sections/AgentSection'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { SkillsSection } from '../components/sections/SkillsSection'
import { ProjectsSection } from '../components/sections/ProjectsSection'
import { ProofSection } from '../components/sections/ProofSection'
import { ContactSection } from '../components/sections/ContactSection'

export function HomePage() {
  return (
    <SiteShell>
      <main id="main" className="page-main">
        <div id="top" />
        <HeroSection />
        <hr className="section-divider" aria-hidden="true" />
        <ArchitectureFlowSection />
        <hr className="section-divider" aria-hidden="true" />
        <WorkSection />
        <hr className="section-divider" aria-hidden="true" />
        <GitHubGraphSection />
        <hr className="section-divider" aria-hidden="true" />
        <AgentSection />
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
