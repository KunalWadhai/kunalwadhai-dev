import type { Experience } from '../../features/portfolio/types'
import { formatMonthYear } from '../../features/portfolio/utils'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export interface ExperienceSectionProps {
  readonly experience: Experience[]
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section id="experience" className="section section--experience">
      <SectionHeader label="// experience" title="Where I've shipped" />

      <div className="timeline">
        {experience.map((exp, idx) => {
          const isCurrent = !exp.end || exp.end === 'Present'
          return (
            <Reveal key={`${exp.company}-${exp.role}`} delay={0.08 * idx} className="timeline__item">
              <div className={`timeline__node ${isCurrent ? 'timeline__node--current' : ''}`} />
              <article className={`exp-card ${isCurrent ? 'exp-card--current' : ''}`}>
                <header className="exp-card__header">
                  <div>
                    <h3 className="exp-card__company">{exp.company}</h3>
                    <p className="exp-card__role">{exp.role}</p>
                  </div>
                  {isCurrent && <span className="exp-card__badge">Current</span>}
                </header>
                <p className="exp-card__date">
                  {formatMonthYear(exp.start)} — {formatMonthYear(exp.end)}
                </p>
                {exp.achievements.map((ach) => (
                  <ul key={ach.title} className="exp-card__points">
                    {ach.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ))}
                <div className="exp-card__tech">
                  {exp.technologies.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
