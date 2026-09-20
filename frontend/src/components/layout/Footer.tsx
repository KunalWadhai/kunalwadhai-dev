/**
 * Footer — Name, year, tech stack
 * Nothing else per brief Section 7.8
 */

import { profile } from '../../content/profile'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <p className="footer__text">
            {profile.name} · {year}
          </p>
          <p className="footer__tech">
            Built with React and TypeScript
          </p>
        </div>
      </div>

      <style>{`
        .footer {
          padding-block: var(--space-10);
          border-top: 1px solid var(--line-subtle);
          margin-top: var(--space-16);
        }

        .footer__content {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          align-items: center;
          text-align: center;
        }

        .footer__text,
        .footer__tech {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .footer__tech {
          font-family: var(--font-mono);
        }
      `}</style>
    </footer>
  )
}
