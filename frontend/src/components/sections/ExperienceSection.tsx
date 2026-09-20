/**
 * Experience Section — Vertical timeline with ownership-area disclosures
 * Two separate Guestara roles per audit, newest first
 */

import { useState } from 'react'
import { experience } from '../../content/experience'
import { ChevronDown } from 'lucide-react'

function formatDateRange(start: string, end: string): string {
  const formatDate = (dateStr: string) => {
    if (dateStr === 'Present') return 'Present'
    const [year, month] = dateStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return `${formatDate(start)} – ${formatDate(end)}`
}

export function ExperienceSection() {
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(
    new Set(
      experience
        .flatMap((exp) => exp.areas)
        .filter((area) => area.defaultExpanded)
        .map((area) => area.id)
    )
  )

  const toggleArea = (areaId: string) => {
    setExpandedAreas((prev) => {
      const next = new Set(prev)
      if (next.has(areaId)) {
        next.delete(areaId)
      } else {
        next.add(areaId)
      }
      return next
    })
  }

  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section__inner">
          <div className="section__title">
            <h2>Experience</h2>
          </div>

          <div className="section__content">
            <div className="timeline">
              {experience.map((entry, entryIndex) => {
                const isCurrent = entry.endDate === 'Present'
                
                return (
                  <article key={`${entry.company}-${entry.startDate}`} className="timeline-entry">
                    {/* Timeline dot */}
                    <div className="timeline-entry__marker" aria-hidden="true">
                      <div className="timeline-entry__dot" />
                      {entryIndex < experience.length - 1 && (
                        <div className="timeline-entry__line" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="timeline-entry__content">
                      <div className="timeline-entry__header">
                        <div className="timeline-entry__meta">
                          <time className="timeline-entry__date">
                            {formatDateRange(entry.startDate, entry.endDate)}
                          </time>
                          {isCurrent && (
                            <span className="timeline-entry__badge">Current</span>
                          )}
                        </div>
                        <h3 className="timeline-entry__role">{entry.role}</h3>
                        <p className="timeline-entry__company">{entry.company}</p>
                        {entry.scope && (
                          <p className="timeline-entry__scope">{entry.scope}</p>
                        )}
                      </div>

                      {/* Ownership areas (collapsible disclosures) */}
                      <div className="timeline-entry__areas">
                        {entry.areas.map((area) => {
                          const isExpanded = expandedAreas.has(area.id)
                          
                          return (
                            <div key={area.id} className="ownership-area">
                              <button
                                type="button"
                                className="ownership-area__toggle"
                                onClick={() => toggleArea(area.id)}
                                aria-expanded={isExpanded}
                                aria-controls={`area-${area.id}`}
                              >
                                <ChevronDown
                                  size={16}
                                  className={`ownership-area__icon ${isExpanded ? 'ownership-area__icon--expanded' : ''}`}
                                  aria-hidden="true"
                                />
                                <span className="ownership-area__title">{area.title}</span>
                              </button>

                              {isExpanded && (
                                <ul id={`area-${area.id}`} className="ownership-area__bullets">
                                  {area.bullets.map((bullet, i) => (
                                    <li key={i}>{bullet}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Tech stack */}
                      <div className="timeline-entry__tech">
                        {entry.technologies.slice(0, 8).map((tech) => (
                          <span key={tech} className="chip">
                            {tech}
                          </span>
                        ))}
                        {entry.technologies.length > 8 && (
                          <span className="chip timeline-entry__more">
                            +{entry.technologies.length - 8}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .timeline {
          display: flex;
          flex-direction: column;
          gap: var(--space-10);
        }

        .timeline-entry {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: var(--space-5);
        }

        /* Timeline marker (dot + line) */
        .timeline-entry__marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 2px;
        }

        .timeline-entry__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }

        .timeline-entry__line {
          width: 1px;
          flex: 1;
          background: var(--line-subtle);
          margin-top: var(--space-3);
        }

        /* Content */
        .timeline-entry__content {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .timeline-entry__header {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .timeline-entry__meta {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .timeline-entry__date {
          font-size: var(--text-sm);
          font-family: var(--font-mono);
          color: var(--text-secondary);
        }

        .timeline-entry__badge {
          font-size: var(--text-xs);
          font-weight: 500;
          padding: 0.125rem 0.5rem;
          background: var(--accent-wash);
          color: var(--accent);
          border: 1px solid var(--accent);
          border-radius: var(--radius-sm);
        }

        .timeline-entry__role {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--text-primary);
        }

        .timeline-entry__company {
          font-size: var(--text-md);
          color: var(--text-secondary);
        }

        .timeline-entry__scope {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.5;
          max-width: 70ch;
        }

        /* Ownership areas */
        .timeline-entry__areas {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .ownership-area {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .ownership-area__toggle {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          text-align: left;
          padding: 0;
          color: var(--text-primary);
          transition: color var(--dur-fast) var(--ease-out);
          cursor: pointer;
        }

        .ownership-area__toggle:hover {
          color: var(--accent);
        }

        .ownership-area__icon {
          flex-shrink: 0;
          color: var(--text-secondary);
          transition: transform var(--dur-base) var(--ease-out);
        }

        .ownership-area__icon--expanded {
          transform: rotate(180deg);
        }

        .ownership-area__title {
          font-size: var(--text-sm);
          font-weight: 600;
          letter-spacing: 0.01em;
          color: inherit;
        }

        .ownership-area__bullets {
          list-style: disc;
          padding-left: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .ownership-area__bullets li {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Tech stack */
        .timeline-entry__tech {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .timeline-entry__more {
          color: var(--text-tertiary);
          background: transparent;
          border-color: var(--line-faint);
        }

        /* Mobile: hide timeline rail */
        @media (max-width: 640px) {
          .timeline-entry {
            grid-template-columns: 1fr;
          }

          .timeline-entry__marker {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}
