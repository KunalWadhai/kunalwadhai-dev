import { useState } from 'react'
import type { Experience } from '../../features/portfolio/types'
import { formatMonthYear } from '../../features/portfolio/utils'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export interface ExperienceSectionProps {
  readonly experience: Experience[]
}

/** Remote logo URLs keyed by company name */
const COMPANY_LOGOS: Record<string, string> = {
  Guestara: 'https://www.hotelogix.com/wp-content/uploads/2025/05/guestara-1.png',
  Zoho: 'https://brandlogos.net/wp-content/uploads/2023/08/zoho-logo_brandlogos.net_kduhg-300x300.png',
}

/** Fallback initials when the logo fails to load */
function initials(company: string) {
  return company
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface CompanyLogoProps {
  readonly company: string
}

function CompanyLogo({ company }: CompanyLogoProps) {
  const src = COMPANY_LOGOS[company]
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="exp-logo exp-logo--fallback" aria-hidden="true">
        {initials(company)}
      </div>
    )
  }

  return (
    <div className="exp-logo" aria-hidden="true">
      <img
        src={src}
        alt=""
        className="exp-logo__img"
        onError={() => setFailed(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeader label="Experience" title="Where I've shipped" />

        <div className="timeline">
          {experience.map((exp, idx) => {
            const isCurrent = !exp.end || exp.end === 'Present'
            return (
              <Reveal key={`${exp.company}-${exp.role}`} delay={0.06 * idx}>
                <article className="exp-card">
                  <header className="exp-card__header">
                    {/* Logo */}
                    <CompanyLogo company={exp.company} />

                    {/* Text meta */}
                    <div className="exp-card__meta">
                      <div className="exp-card__top-row">
                        <h3 className="exp-card__company">{exp.company}</h3>
                        {isCurrent && (
                          <span className="exp-card__badge" aria-label="Current role">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="exp-card__role">{exp.role}</p>
                      <p className="exp-card__date">
                        <time dateTime={exp.start}>{formatMonthYear(exp.start)}</time>
                        {' — '}
                        {exp.end && exp.end !== 'Present' ? (
                          <time dateTime={exp.end}>{formatMonthYear(exp.end)}</time>
                        ) : (
                          'Present'
                        )}
                      </p>
                    </div>
                  </header>

                  <ul className="exp-card__points" aria-label="Key contributions">
                    {exp.achievements.flatMap((ach) =>
                      ach.points.map((point) => (
                        <li key={point}>{point}</li>
                      )),
                    )}
                  </ul>

                  <div className="exp-card__tech" aria-label="Technologies used">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
