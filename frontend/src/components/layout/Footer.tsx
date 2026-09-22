/**
 * Footer — Name, year, tech stack
 * Large smoky "Kunal Wadhai" watermark text behind the footer content,
 * inspired by the reference screenshot.
 */

import { profile } from '../../content/profile'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* Smoky background watermark */}
      <div className="footer__watermark" aria-hidden="true">
        Kunal Wadhai
      </div>

      <div className="container footer__body">
        <div className="footer__content">
          <p className="footer__text">
            {profile.name} · {year}
          </p>
          <p className="footer__tech">
            Built with curiosity. Shipped with intent.
          </p>
        </div>
      </div>

      <style>{`
        .footer {
          position: relative;
          overflow: hidden;
          padding-top: var(--space-10);
          padding-bottom: 0;
          border-top: 1px solid var(--line-subtle);
          margin-top: var(--space-16);
        }

        /* ── Watermark ── */
        .footer__watermark {
          /* Sit at the very bottom behind all content */
          position: absolute;
          bottom: -0.15em;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;

          /* Display scale — fills the footer width */
          font-size: clamp(5rem, 18vw, 14rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          font-family: var(--font-sans);

          /* Smoky effect: very low opacity + blur + gradient mask */
          color: var(--text-primary);
          opacity: 0.045;
          filter: blur(3px);

          /* Fade from visible in center to fully transparent at edges */
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            rgba(0,0,0,0.6) 15%,
            rgba(0,0,0,1) 35%,
            rgba(0,0,0,1) 65%,
            rgba(0,0,0,0.6) 85%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            rgba(0,0,0,0.6) 15%,
            rgba(0,0,0,1) 35%,
            rgba(0,0,0,1) 65%,
            rgba(0,0,0,0.6) 85%,
            transparent 100%
          );

          /* Also fade top edge so it bleeds upward softly */
          -webkit-mask-composite: intersect;
          mask-composite: intersect;

          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        /* Fade top edge independently using a pseudo */
        .footer__watermark::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            var(--bg-base) 0%,
            transparent 40%
          );
          pointer-events: none;
        }

        /* Content sits above watermark */
        .footer__body {
          position: relative;
          z-index: 1;
          padding-bottom: var(--space-8);
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

        /* Reduce watermark motion/blur if user prefers */
        @media (prefers-reduced-motion: reduce) {
          .footer__watermark {
            filter: none;
            opacity: 0.035;
          }
        }
      `}</style>
    </footer>
  )
}
