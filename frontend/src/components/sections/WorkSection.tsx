/**
 * Work Section — 5 case studies as horizontal rows (not cards)
 * Each row: title, one-line outcome, stack chips, "Read case study →" link
 */

import { caseStudies } from '../../content/case-studies'
import { ArrowRight } from 'lucide-react'

export function WorkSection() {
  return (
    <section id="work" className="section">
      <div className="container">
        <div className="section__inner">
          <div className="section__title">
            <h2>Work</h2>
          </div>

          <div className="section__content">
            <div className="work-intro">
              <h3 className="work-intro__title">Selected work</h3>
              <p className="work-intro__description">
                Five case studies from the Guestara platform — real constraints, measured outcomes, decisions explained.
              </p>
            </div>

            <div className="work-list">
              {caseStudies.map((caseStudy) => (
                <article key={caseStudy.id} className="work-row">
                  <div className="work-row__main">
                    <h4 className="work-row__title">{caseStudy.title}</h4>
                    <p className="work-row__outcome">{caseStudy.oneLiner}</p>
                  </div>

                  <div className="work-row__stack">
                    {caseStudy.stack.slice(0, 5).map((tech) => (
                      <span key={tech} className="chip">
                        {tech}
                      </span>
                    ))}
                    {caseStudy.stack.length > 5 && (
                      <span className="chip work-row__more">
                        +{caseStudy.stack.length - 5}
                      </span>
                    )}
                  </div>

                  <a
                    href={`/work/${caseStudy.slug}`}
                    className="work-row__link"
                    aria-label={`Read case study: ${caseStudy.title}`}
                  >
                    Read case study
                    <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .work-intro {
          margin-bottom: var(--space-8);
        }

        .work-intro__title {
          font-size: var(--text-2xl);
          font-weight: 600;
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .work-intro__description {
          font-size: var(--text-md);
          color: var(--text-secondary);
          max-width: 60ch;
        }

        .work-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        /* Work row (horizontal, not card) */
        .work-row {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding: var(--space-5);
          background: var(--bg-raised);
          border: 1px solid var(--line-subtle);
          border-radius: var(--radius);
          transition: border-color var(--dur-fast) var(--ease-out);
        }

        .work-row:hover {
          border-color: var(--line-strong);
        }

        .work-row__main {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .work-row__title {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--text-primary);
        }

        .work-row__outcome {
          font-size: var(--text-sm);
          font-family: var(--font-mono);
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .work-row__stack {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .work-row__more {
          color: var(--text-tertiary);
          background: transparent;
          border-color: var(--line-faint);
        }

        .work-row__link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--accent);
          margin-top: var(--space-2);
          width: fit-content;
          transition: color var(--dur-fast) var(--ease-out);
        }

        .work-row__link:hover {
          color: var(--accent-hover);
        }

        /* Mobile: stack more aggressively */
        @media (max-width: 640px) {
          .work-row {
            padding: var(--space-4);
          }

          .work-row__title {
            font-size: var(--text-md);
          }
        }
      `}</style>
    </section>
  )
}
