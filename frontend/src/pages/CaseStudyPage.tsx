/**
 * Case Study Page — Fixed structure per brief Section 7.3
 * Context → Constraints → Architecture → Key Decisions → Outcome → Stack → Next
 */

import { useParams, Link } from 'react-router-dom'
import { caseStudies } from '../content/case-studies'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { BackgroundGrid } from '../components/layout/BackgroundGrid'
import { SmartLockDiagram } from '../components/diagrams/SmartLockDiagram'
import { WebhookDiagram } from '../components/diagrams/WebhookDiagram'
import { StateMachineDiagram } from '../components/diagrams/StateMachineDiagram'
import { HealthTracingDiagram } from '../components/diagrams/HealthTracingDiagram'
import { SharedLibraryDiagram } from '../components/diagrams/SharedLibraryDiagram'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const DIAGRAMS: Record<string, React.ReactNode> = {
  'smart-lock-provisioning':   <SmartLockDiagram />,
  'pms-webhook-ingestion':     <WebhookDiagram />,
  'reservation-state-machine': <StateMachineDiagram />,
  'service-health-tracing':    <HealthTracingDiagram />,
  'shared-platform-library':   <SharedLibraryDiagram />,
}

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const study = caseStudies.find((c) => c.slug === slug)

  if (!study) {
    return (
      <div className="cs-not-found">
        <Header />
        <main id="main" style={{ paddingTop: 'var(--nav-height)' }}>
          <div className="container" style={{ paddingTop: 'var(--space-16)' }}>
            <h1>Case study not found</h1>
            <Link to="/#work" className="cs-back-link">
              <ArrowLeft size={14} aria-hidden="true" /> Back to work
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const nextStudy = study.nextSlug
    ? caseStudies.find((c) => c.slug === study.nextSlug)
    : null

  return (
    <>
      <BackgroundGrid />

      <a href="#main" className="skip-link">Skip to main content</a>

      <Header />

      <main id="main" className="cs-main">
        <div className="container">

          {/* Back link */}
          <Link to="/#work" className="cs-back-link">
            <ArrowLeft size={14} aria-hidden="true" />
            Back to work
          </Link>

          <div className="cs-layout">

            {/* ── Left sidebar (sticky meta) ── */}
            <aside className="cs-sidebar">
              <p className="cs-sidebar__company">{study.company}</p>
              <p className="cs-sidebar__date">{study.dateRange}</p>

              <div className="cs-sidebar__divider" aria-hidden="true" />

              <h4 className="cs-sidebar__label">Outcome</h4>
              <dl className="cs-sidebar__outcomes">
                {study.outcomes.map((o) => (
                  <div key={o.label} className="cs-sidebar__outcome-row">
                    <dd className="cs-sidebar__outcome-value">{o.value}</dd>
                    <dt className="cs-sidebar__outcome-label">{o.label}</dt>
                  </div>
                ))}
              </dl>

              <div className="cs-sidebar__divider" aria-hidden="true" />

              <h4 className="cs-sidebar__label">Stack</h4>
              <div className="cs-sidebar__chips">
                {study.stack.map((tech) => (
                  <span key={tech} className="chip">{tech}</span>
                ))}
              </div>
            </aside>

            {/* ── Main content ── */}
            <article className="cs-content">
              <h1 className="cs-title">{study.title}</h1>

              {/* 1. Context */}
              <section className="cs-section" aria-labelledby="cs-context">
                <h2 id="cs-context" className="cs-section__heading">Context</h2>
                <div className="cs-prose">
                  {study.context.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </section>

              {/* 2. Constraints */}
              <section className="cs-section" aria-labelledby="cs-constraints">
                <h2 id="cs-constraints" className="cs-section__heading">Constraints</h2>
                <ul className="cs-constraints-list">
                  {study.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </section>

              {/* 3. Architecture */}
              <section className="cs-section" aria-labelledby="cs-architecture">
                <h2 id="cs-architecture" className="cs-section__heading">Architecture</h2>
                <div className="cs-diagram-well">
                  {DIAGRAMS[study.slug] ?? null}
                </div>
                <div className="cs-prose cs-prose--diagram">
                  {study.architectureDescription.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </section>

              {/* 4. Key decisions */}
              <section className="cs-section" aria-labelledby="cs-decisions">
                <h2 id="cs-decisions" className="cs-section__heading">Key decisions</h2>
                <ol className="cs-decisions">
                  {study.keyDecisions.map((d, i) => (
                    <li key={i} className="cs-decision">
                      <p className="cs-decision__decision">{d.decision}</p>
                      <dl className="cs-decision__meta">
                        <div className="cs-decision__row">
                          <dt>Alternative considered</dt>
                          <dd>{d.alternative}</dd>
                        </div>
                        <div className="cs-decision__row">
                          <dt>Reason</dt>
                          <dd>{d.reason}</dd>
                        </div>
                      </dl>
                    </li>
                  ))}
                </ol>
              </section>

              {/* 5. Outcome */}
              <section className="cs-section" aria-labelledby="cs-outcome">
                <h2 id="cs-outcome" className="cs-section__heading">Outcome</h2>
                <dl className="cs-outcomes">
                  {study.outcomes.map((o) => (
                    <div key={o.label} className="cs-outcome-row">
                      <dt className="cs-outcome-label">{o.label}</dt>
                      <dd className="cs-outcome-value">{o.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* Next case study */}
              {nextStudy && (
                <div className="cs-next">
                  <span className="cs-next__label">Next case study</span>
                  <Link to={`/work/${nextStudy.slug}`} className="cs-next__link">
                    {nextStudy.title}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </article>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        .cs-main {
          padding-top: calc(var(--nav-height) + var(--space-8));
          padding-bottom: var(--space-16);
        }

        .cs-back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-10);
          transition: color var(--dur-fast) var(--ease-out);
        }
        .cs-back-link:hover { color: var(--accent); }

        /* Two-column: sidebar 260px | content 1fr */
        .cs-layout {
          display: grid;
          gap: var(--space-10);
          align-items: start;
        }
        @media (min-width: 1024px) {
          .cs-layout {
            grid-template-columns: 240px 1fr;
            gap: var(--space-12);
          }
        }

        /* ── Sidebar ── */
        .cs-sidebar {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        @media (min-width: 1024px) {
          .cs-sidebar {
            position: sticky;
            top: calc(var(--nav-height) + var(--space-8));
          }
        }

        .cs-sidebar__company {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-primary);
        }
        .cs-sidebar__date {
          font-size: var(--text-xs);
          font-family: var(--font-mono);
          color: var(--text-secondary);
        }
        .cs-sidebar__divider {
          height: 1px;
          background: var(--line-subtle);
          margin-block: var(--space-2);
        }
        .cs-sidebar__label {
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
          margin-bottom: var(--space-2);
        }
        .cs-sidebar__outcomes {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .cs-sidebar__outcome-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .cs-sidebar__outcome-value {
          font-size: var(--text-lg);
          font-weight: 600;
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
          color: var(--text-primary);
        }
        .cs-sidebar__outcome-label {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .cs-sidebar__chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        /* ── Content ── */
        .cs-title {
          font-size: var(--text-3xl);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: var(--text-primary);
          margin-bottom: var(--space-10);
        }

        .cs-section {
          margin-bottom: var(--space-12);
        }
        .cs-section__heading {
          font-size: var(--text-md);
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--space-5);
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--line-subtle);
        }

        .cs-prose {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .cs-prose p {
          font-size: var(--text-base);
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 70ch;
        }
        .cs-prose--diagram {
          margin-top: var(--space-6);
        }

        .cs-constraints-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding-left: var(--space-5);
          list-style: disc;
        }
        .cs-constraints-list li {
          font-size: var(--text-base);
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 70ch;
        }

        /* Diagram well */
        .cs-diagram-well {
          background: var(--bg-inset);
          border: 1px solid var(--line-subtle);
          border-radius: var(--radius);
          padding: var(--space-6);
          overflow-x: auto;
        }

        /* Key decisions */
        .cs-decisions {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          counter-reset: decisions;
        }
        .cs-decision {
          display: grid;
          gap: var(--space-4);
          padding-left: var(--space-6);
          border-left: 2px solid var(--line-subtle);
          counter-increment: decisions;
        }
        .cs-decision__decision {
          font-size: var(--text-md);
          font-weight: 600;
          color: var(--text-primary);
        }
        .cs-decision__decision::before {
          content: counter(decisions) ". ";
          color: var(--text-tertiary);
        }
        .cs-decision__meta {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .cs-decision__row {
          display: grid;
          gap: var(--space-2);
        }
        @media (min-width: 640px) {
          .cs-decision__row {
            grid-template-columns: 180px 1fr;
          }
        }
        .cs-decision__row dt {
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
          padding-top: 2px;
        }
        .cs-decision__row dd {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Outcomes (main) */
        .cs-outcomes {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid var(--line-subtle);
          border-radius: var(--radius);
          overflow: hidden;
        }
        .cs-outcome-row {
          display: grid;
          gap: var(--space-4);
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--line-subtle);
        }
        .cs-outcome-row:last-child { border-bottom: none; }
        @media (min-width: 640px) {
          .cs-outcome-row {
            grid-template-columns: 1fr auto;
            align-items: center;
          }
        }
        .cs-outcome-label {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }
        .cs-outcome-value {
          font-size: var(--text-md);
          font-weight: 600;
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
          color: var(--text-primary);
          white-space: nowrap;
        }

        /* Next case study */
        .cs-next {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          padding-top: var(--space-10);
          border-top: 1px solid var(--line-subtle);
          margin-top: var(--space-10);
        }
        .cs-next__label {
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
        }
        .cs-next__link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-3);
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--text-primary);
          transition: color var(--dur-fast) var(--ease-out);
        }
        .cs-next__link:hover { color: var(--accent); }
      `}</style>
    </>
  )
}
