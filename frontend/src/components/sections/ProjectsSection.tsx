/**
 * Projects Section — Other projects (secondary to case studies)
 * Compact list rows, ordered by architectural depth
 */

import { projects } from '../../content/projects'
import { Github, ExternalLink } from 'lucide-react'

export function ProjectsSection() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section__inner">
          <div className="section__title">
            <h2>Projects</h2>
          </div>

          <div className="section__content">
            <div className="projects-intro">
              <h3 className="projects-intro__title">Other work</h3>
              <p className="projects-intro__description">
                Personal projects ordered by architectural depth. Secondary to the case studies above.
              </p>
            </div>

            <div className="projects-list">
              {projects.map((project) => (
                <article key={project.name} className="project-item">
                  <div className="project-item__main">
                    <h4 className="project-item__name">{project.name}</h4>
                    <p className="project-item__description">{project.description}</p>
                  </div>

                  <div className="project-item__stack">
                    {project.stack.map((tech) => (
                      <span key={tech} className="chip">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="project-item__links">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="project-item__link"
                        aria-label={`View ${project.name} on GitHub`}
                      >
                        <Github size={14} aria-hidden="true" />
                        Source
                      </a>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="project-item__link"
                        aria-label={`View ${project.name} live`}
                      >
                        <ExternalLink size={14} aria-hidden="true" />
                        Live
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .projects-intro {
          margin-bottom: var(--space-8);
        }

        .projects-intro__title {
          font-size: var(--text-2xl);
          font-weight: 600;
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .projects-intro__description {
          font-size: var(--text-md);
          color: var(--text-secondary);
          max-width: 60ch;
        }

        .projects-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .project-item {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .project-item__main {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .project-item__name {
          font-size: var(--text-md);
          font-weight: 600;
          color: var(--text-primary);
        }

        .project-item__description {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 70ch;
        }

        .project-item__stack {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .project-item__links {
          display: flex;
          gap: var(--space-4);
        }

        .project-item__link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          transition: color var(--dur-fast) var(--ease-out);
        }

        .project-item__link:hover {
          color: var(--accent);
        }
      `}</style>
    </section>
  )
}
