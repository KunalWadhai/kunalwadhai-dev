/**
 * Proof Section — LeetCode stats, HackerRank badges, education
 * Static snapshot per brief Section 7.7 (no runtime embeds)
 */

import { proof } from '../../content/proof'
import { ExternalLink, Award, GraduationCap } from 'lucide-react'

export function ProofSection() {
  return (
    <section id="proof" className="section">
      <div className="container">
        <div className="section__inner">
          <div className="section__title">
            <h2>Proof</h2>
          </div>

          <div className="section__content">
            <div className="proof-intro">
              <h3 className="proof-intro__title">Proof and fundamentals</h3>
              <p className="proof-intro__description">
                Competitive programming stats and formal education. Static snapshot as of {proof.snapshotDate}.
              </p>
            </div>

            <div className="proof-grid">
              {/* LeetCode */}
              <div className="proof-card">
                <div className="proof-card__header">
                  <h4 className="proof-card__title">LeetCode</h4>
                  <a
                    href={proof.leetcode.url}
                    target="_blank"
                    rel="noreferrer"
                    className="proof-card__link"
                    aria-label="View LeetCode profile"
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </div>
                <div className="proof-card__stats">
                  <div className="proof-stat">
                    <div className="proof-stat__value">{proof.leetcode.rating}</div>
                    <div className="proof-stat__label">Contest rating</div>
                  </div>
                  <div className="proof-stat">
                    <div className="proof-stat__value">{proof.leetcode.streak}+</div>
                    <div className="proof-stat__label">Day streak</div>
                  </div>
                  <div className="proof-stat">
                    <div className="proof-stat__value">{proof.leetcode.problemsSolved}+</div>
                    <div className="proof-stat__label">Problems solved</div>
                  </div>
                </div>
                <a
                  href={proof.leetcode.url}
                  target="_blank"
                  rel="noreferrer"
                  className="proof-card__handle"
                >
                  @{proof.leetcode.handle}
                </a>
              </div>

              {/* HackerRank */}
              <div className="proof-card">
                <div className="proof-card__header">
                  <h4 className="proof-card__title">HackerRank</h4>
                  <a
                    href={proof.hackerrank.url}
                    target="_blank"
                    rel="noreferrer"
                    className="proof-card__link"
                    aria-label="View HackerRank profile"
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </div>
                <div className="proof-badges">
                  {proof.hackerrank.badges.map((badge) => (
                    <div key={badge.language} className="proof-badge">
                      <Award size={16} className="proof-badge__icon" aria-hidden="true" />
                      <span className="proof-badge__text">
                        {badge.stars}-star {badge.language}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href={proof.hackerrank.url}
                  target="_blank"
                  rel="noreferrer"
                  className="proof-card__handle"
                >
                  @{proof.hackerrank.handle}
                </a>
              </div>

              {/* Education */}
              <div className="proof-card">
                <div className="proof-card__header">
                  <h4 className="proof-card__title">Education</h4>
                  <GraduationCap size={16} className="proof-card__icon" aria-hidden="true" />
                </div>
                <div className="proof-education">
                  <div className="proof-education__degree">{proof.education.degree}</div>
                  <div className="proof-education__school">{proof.education.school}</div>
                  <div className="proof-education__meta">
                    {proof.education.graduationDate} · CGPA {proof.education.cgpa}/10
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .proof-intro {
          margin-bottom: var(--space-8);
        }

        .proof-intro__title {
          font-size: var(--text-2xl);
          font-weight: 600;
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .proof-intro__description {
          font-size: var(--text-md);
          color: var(--text-secondary);
          max-width: 60ch;
        }

        .proof-grid {
          display: grid;
          gap: var(--space-5);
        }

        @media (min-width: 768px) {
          .proof-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .proof-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .proof-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          padding: var(--space-5);
          background: var(--bg-raised);
          border: 1px solid var(--line-subtle);
          border-radius: var(--radius);
        }

        .proof-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .proof-card__title {
          font-size: var(--text-md);
          font-weight: 600;
          color: var(--text-primary);
        }

        .proof-card__link,
        .proof-card__icon {
          color: var(--text-secondary);
        }

        .proof-card__link:hover {
          color: var(--accent);
        }

        .proof-card__stats {
          display: flex;
          gap: var(--space-5);
        }

        .proof-stat {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .proof-stat__value {
          font-size: var(--text-xl);
          font-weight: 600;
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
          color: var(--text-primary);
        }

        .proof-stat__label {
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        .proof-badges {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .proof-badge {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .proof-badge__icon {
          color: var(--accent);
          flex-shrink: 0;
        }

        .proof-badge__text {
          font-size: var(--text-sm);
          color: var(--text-primary);
        }

        .proof-education {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .proof-education__degree {
          font-size: var(--text-md);
          font-weight: 600;
          color: var(--text-primary);
        }

        .proof-education__school {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .proof-education__meta {
          font-size: var(--text-xs);
          font-family: var(--font-mono);
          color: var(--text-tertiary);
        }

        .proof-card__handle {
          font-size: var(--text-sm);
          font-family: var(--font-mono);
          color: var(--text-secondary);
          transition: color var(--dur-fast) var(--ease-out);
        }

        .proof-card__handle:hover {
          color: var(--accent);
        }
      `}</style>
    </section>
  )
}
