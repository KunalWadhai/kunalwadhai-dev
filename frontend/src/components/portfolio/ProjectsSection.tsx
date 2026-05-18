import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import { PROJECT_ARCH } from '../../features/portfolio/constants'
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
    <section id="projects" className="section section--projects">
      <SectionHeader
        label="// projects"
        title="Selected builds"
        description="Production systems with real users, real data, and real failure modes."
      />

      <div className="bento">
        {projects.map((project, i) => {
          const hasArch = !!PROJECT_ARCH[project.name]
          const isExpanded = expandedArch.has(project.name)
          const isFeatured = i === 0

          return (
            <Reveal
              key={project.name}
              delay={0.08 * i}
              className={`bento__card ${isFeatured ? 'bento__card--featured' : 'bento__card--compact'}`}
            >
              <div className="bento__glow" aria-hidden="true" />
              <div className="bento__top">
                <h3 className="bento__name">{project.name}</h3>
                <span className="bento__badge">{isFeatured ? 'Flagship' : `0${i + 1}`}</span>
              </div>
              <p className="bento__desc">{project.description}</p>
              <div className="bento__pills">
                {project.technologies.map((tech) => (
                  <span key={tech} className="bento__pill">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="bento__links">
                {hasArch && (
                  <button
                    type="button"
                    className="bento__link"
                    onClick={() => toggleArch(project.name)}
                    aria-expanded={isExpanded}
                  >
                    <ArrowUpRight
                      size={14}
                      style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }}
                    />
                    {isExpanded ? 'Hide architecture' : 'Architecture'}
                  </button>
                )}
                {project.githubUrl && (
                  <a
                    className="bento__link"
                    href={normalizeUrl(project.githubUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github size={14} /> Source
                  </a>
                )}
                {project.url && (
                  <a className="bento__link" href={normalizeUrl(project.url)} target="_blank" rel="noreferrer">
                    <ExternalLink size={14} /> Live
                  </a>
                )}
              </div>

              <AnimatePresence>
                {hasArch && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <ArchitectureDiagram projectName={project.name} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
