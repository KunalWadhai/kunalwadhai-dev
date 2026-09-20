/**
 * Hero Section — Platform map + headline + facts ledger
 * Single memorable moment: platform map draws in once on load
 */

import { profile } from '../../content/profile'
import { facts } from '../../content/facts'
import { PlatformMap } from '../diagrams/PlatformMap'
import { Github, Linkedin } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="container">
        <div className="hero__grid">
          {/* Left: Headline + bio + CTAs */}
          <div className="hero__content">
            <h1 className="hero__headline">{profile.headline}</h1>
            
            <p className="hero__bio">{profile.bio}</p>

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
                Resume
              </a>
            </div>

            <div className="hero__contact">
              <a href={`mailto:${profile.email}`} className="hero__email">
                {profile.email}
              </a>
              <div className="hero__social">
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  className="hero__social-link"
                >
                  <Github size={16} aria-hidden="true" />
                  GitHub
                </a>
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  className="hero__social-link"
                >
                  <Linkedin size={16} aria-hidden="true" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Right: Platform map */}
          <div className="hero__map">
            <PlatformMap />
          </div>
        </div>

        {/* Facts ledger (full width below hero grid) */}
        <dl className="facts-ledger" aria-label="Key outcomes">
          {facts.map((fact, i) => (
            <div key={i} className="facts-ledger__item">
              <dt className="facts-ledger__label">{fact.label}</dt>
              <dd className="facts-ledger__value">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <style>{`
        .hero {
          padding-block: var(--space-16);
          position: relative;
        }

        @media (max-width: 767px) {
          .hero {
            padding-block: var(--space-10) var(--space-12);
          }
        }

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

        .hero__content {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .hero__headline {
          font-size: var(--text-3xl);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: var(--text-primary);
          max-width: 20ch;
        }

        .hero__bio {
          font-size: var(--text-md);
          line-height: 1.6;
          color: var(--text-secondary);
          max-width: 50ch;
        }

        .hero__ctas {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
          margin-top: var(--space-2);
        }

        .hero__contact {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-top: var(--space-4);
        }

        .hero__email {
          font-size: var(--text-sm);
          color: var(--text-secondary);
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
          gap: var(--space-2);
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

        /* Facts ledger (definition list, 2-col on desktop) */
        .facts-ledger {
          display: grid;
          gap: var(--space-4) var(--space-6);
          padding-block: var(--space-8);
          border-top: 1px solid var(--line-subtle);
          margin-top: var(--space-8);
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
