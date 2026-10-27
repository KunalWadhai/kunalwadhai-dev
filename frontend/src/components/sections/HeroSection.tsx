/**
 * Hero Section — Headline + impact strip + platform map + facts ledger
 * LCP element: h1 and impact metrics are eager, visible above the fold.
 * Platform map is the "single memorable moment" — draws in top-to-bottom once.
 */

import { profile } from '../../content/profile'
import { facts } from '../../content/facts'
import { PlatformMap } from '../diagrams/PlatformMap'
import { GmailIcon } from '../layout/GmailIcon'
import { SocialBrandIcon } from '../layout/SocialBrandIcon'

/** Top 3 metrics shown directly in hero (above the fold, never hidden) */
const HERO_METRICS = [
  { value: '100', suffix: '+', label: 'properties owned' },
  { value: '99.2', suffix: '%', label: 'PIN delivery rate' },
  { value: '99.8', suffix: '%', label: 'reservation sync' },
]

export function HeroSection() {
  return (
    <section id="top" className="hero" aria-label="Introduction">
      <div className="container">
        <div className="hero__grid">
          {/* Left col: headline + bio + impact strip + CTAs + social */}
          <div className="hero__content">
            <h1 className="hero__headline">{profile.headline}</h1>

            <p className="hero__bio">{profile.bio}</p>

            {/* Impact strip — 3 verified metrics, always above fold */}
            <dl className="hero__metrics" aria-label="Key production metrics">
              {HERO_METRICS.map((m) => (
                <div key={m.label} className="hero__metric">
                  <dt className="hero__metric-label">{m.label}</dt>
                  <dd
                    className="hero__metric-value"
                    data-countup={m.value}
                    data-countup-suffix={m.suffix}
                    aria-label={`${m.value}${m.suffix} ${m.label}`}
                  >
                    {m.value}{m.suffix}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="hero__ctas">
              <a href="#work" className="btn btn--primary">
                View selected work
              </a>
              <a
                href={profile.resume.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn--secondary"
                aria-label="Download résumé PDF"
              >
                Résumé
              </a>
            </div>

            <div className="hero__contact">
              <a href={`mailto:${profile.email}`} className="hero__email" aria-label="Email Kunal">
                <GmailIcon size={17} />
                <span>Email</span>
              </a>
              <div className="hero__social">
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  className="hero__social-link"
                >
                  <SocialBrandIcon brand="github" size={15} />
                  GitHub
                </a>
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  className="hero__social-link"
                >
                  <SocialBrandIcon brand="linkedin" size={15} />
                  LinkedIn
                </a>
                <a
                  href={profile.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X profile"
                  className="hero__social-link"
                >
                  <SocialBrandIcon brand="x" size={15} />
                  X
                </a>
              </div>
            </div>
          </div>

          {/* Right col: Platform map — visible on desktop, scrolls below on mobile */}
          <div className="hero__map" data-reveal>
            <PlatformMap />
          </div>
        </div>

        {/* Facts ledger — full grid below hero (6 outcomes with count-up) */}
        <dl className="facts-ledger" aria-label="Key outcomes" data-reveal-stagger>
          {facts.map((fact) => (
            <div key={fact.label} className="facts-ledger__item">
              <dt className="facts-ledger__label">{fact.label}</dt>
              <dd
                className="facts-ledger__value"
                data-countup={fact.value.replace(/[^0-9.]/g, '')}
                data-countup-suffix={fact.value.replace(/[0-9.]/g, '')}
                aria-label={`${fact.value}: ${fact.label}`}
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <style>{`
        .hero {
          padding-block: var(--space-8) var(--space-12);
          position: relative;
        }

        @media (max-width: 767px) {
          .hero {
            padding-block: var(--space-10) var(--space-8);
          }
        }

        /* 50/50 split on md+, stacked on mobile */
        .hero__grid {
          display: grid;
          gap: var(--space-8);
          align-items: start;
          margin-bottom: var(--space-12);
        }

        @media (min-width: 768px) {
          .hero__grid {
            grid-template-columns: 1fr 1fr;
            gap: var(--space-10);
          }
        }

        @media (max-width: 767px) {
          .hero__grid {
            margin-bottom: var(--space-8);
          }
        }

        .hero__content {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .hero__headline {
          font-size: var(--text-3xl);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.05;
          color: var(--text-primary);
          max-width: 18ch;
        }

        @media (max-width: 767px) {
          .hero__headline {
            max-width: 100%;
          }
        }

        .hero__bio {
          font-size: var(--text-md);
          line-height: 1.65;
          color: var(--text-secondary);
          max-width: 50ch;
        }

        /* Impact strip — 3 metrics above the fold */
        .hero__metrics {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-5);
          padding: var(--space-4) 0;
          border-top: 1px solid var(--line-faint);
          border-bottom: 1px solid var(--line-faint);
        }

        .hero__metric {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 80px;
        }

        .hero__metric-value {
          font-family: var(--font-mono);
          font-size: var(--text-xl);
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          color: var(--text-primary);
          line-height: 1;
        }

        .hero__metric-label {
          font-size: var(--text-xs);
          color: var(--text-muted);
          line-height: 1.3;
          order: -1; /* label above value */
        }

        .hero__ctas {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .hero__contact {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-top: var(--space-2);
        }

        .hero__email {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          width: fit-content;
          font-size: var(--text-sm);
          color: var(--text-muted);
          transition: color var(--dur-fast) var(--ease-out);
        }

        .hero__email:hover {
          color: var(--accent);
        }

        .hero__social {
          display: flex;
          gap: var(--space-4);
        }

        .hero__social-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-sm);
          color: var(--text-secondary);
          transition: color var(--dur-fast) var(--ease-out);
        }

        .hero__social-link:hover {
          color: var(--accent);
        }

        .hero__map {
          position: relative;
        }

        /* Facts ledger (6 outcomes, 3-col on desktop) */
        .facts-ledger {
          display: grid;
          gap: var(--space-5) var(--space-6);
          padding-block: var(--space-8);
          border-top: 1px solid var(--line-subtle);
        }

        @media (min-width: 640px) {
          .facts-ledger {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .facts-ledger {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .facts-ledger__item {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .facts-ledger__label {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.4;
          order: -1;
        }

        .facts-ledger__value {
          font-size: var(--text-xl);
          font-weight: 600;
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
          color: var(--text-primary);
        }
      `}</style>
    </section>
  )
}
