import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import { PROJECT_ARCH, PROJECT_META } from '../../features/portfolio/constants'
import type { Project } from '../../features/portfolio/types'
import { normalizeUrl } from '../../features/portfolio/utils'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { ArchitectureDiagram } from './ArchitectureDiagram'

export interface ProjectsSectionProps {
  readonly projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [expandedArch, setExpandedArch] = useState<Set<string>>(new Set())

  const toggleArch = useCallback((name: string) => {
    setExpandedArch((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeader
          label="Work"
          title="Selected projects"
          description="Systems built for production — real constraints, real trade-offs."
        />

        <div className="projects-list">
          {projects.map((project, i) => {
            const hasArch = !!PROJECT_ARCH[project.name]
            const isExpanded = expandedArch.has(project.name)
            const meta = PROJECT_META[project.name]

            return (
              <Reveal key={project.name} delay={0.06 * i}>
                <article className="project-card">
                  <div className="project-card__main">
                    <div className="project-card__header">
                      <div>
                        <h3 className="project-card__name">{project.name}</h3>
                        <p className="project-card__problem">{project.description}</p>
                      </div>
                      {meta?.role && (
                        <span className="project-card__role-badge">{meta.role}</span>
                      )}
                    </div>

                    {meta?.areas && (
                      <div className="project-card__areas" aria-label="Engineering areas">
                        {meta.areas.map((area) => (
                          <span key={area} className="project-card__area">
                            {area}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="project-card__tech" aria-label="Technologies">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="tag">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="project-card__links">
                      {hasArch && (
                        <button
                          type="button"
                          className="project-card__link"
                          onClick={() => toggleArch(project.name)}
                          aria-expanded={isExpanded}
                          aria-controls={`arch-${project.name.replace(/\s+/g, '-')}`}
                        >
                          <ArrowUpRight
                            size={13}
                            aria-hidden="true"
                            style={{
                              transform: isExpanded ? 'rotate(90deg)' : 'none',
                              transition: 'transform 0.25s',
                            }}
                          />
                          {isExpanded ? 'Hide architecture' : 'Architecture'}
                        </button>
                      )}
                      {project.githubUrl && (
                        <a
                          className="project-card__link"
                          href={normalizeUrl(project.githubUrl)}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`View ${project.name} source on GitHub`}
                        >
                          <Github size={13} aria-hidden="true" /> Source
                        </a>
                      )}
                      {project.url && (
                        <a
                          className="project-card__link"
                          href={normalizeUrl(project.url)}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`View ${project.name} live`}
                        >
                          <ExternalLink size={13} aria-hidden="true" /> Live
                        </a>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {hasArch && isExpanded && (
                      <motion.div
                        id={`arch-${project.name.replace(/\s+/g, '-')}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <ArchitectureDiagram projectName={project.name} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
