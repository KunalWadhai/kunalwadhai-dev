/**
 * Background grid + structural rails
 * Blueprint/drafting-board aesthetic per brief Section 6.4
 */

import { useEffect, useState } from 'react'

export function BackgroundGrid() {
  const [prefersReduced, setPrefersReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches)
    }
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  // Don't render grid if user prefers reduced motion
  if (prefersReduced) return null

  return (
    <>
      {/* 64px square background grid */}
      <div className="bg-grid" aria-hidden="true" />

      {/* Structural rails (desktop only, ≥1024px) */}
      <div className="bg-rails" aria-hidden="true">
        <div className="bg-rails__left" />
        <div className="bg-rails__right" />
      </div>

      <style>{`
        /* ── Background Grid ── */
        .bg-grid {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background-image:
            linear-gradient(to right, var(--line-faint) 1px, transparent 1px),
            linear-gradient(to bottom, var(--line-faint) 1px, transparent 1px);
          background-size: 64px 64px;
          /* Radial mask: fade toward edges and bottom */
          mask-image: radial-gradient(
            ellipse 100% 80% at 50% 20%,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.2) 50%,
            transparent 100%
          );
          -webkit-mask-image: radial-gradient(
            ellipse 100% 80% at 50% 20%,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.2) 50%,
            transparent 100%
          );
        }

        /* ── Structural Rails (desktop ≥1024px only) ── */
        .bg-rails {
          display: none;
        }

        @media (min-width: 1024px) {
          .bg-rails {
            display: block;
            position: fixed;
            inset: 0;
            z-index: -1;
            pointer-events: none;
            max-width: var(--max-width);
            margin-inline: auto;
            padding-inline: clamp(1.5rem, 5vw, 3rem);
          }

          .bg-rails__left,
          .bg-rails__right {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 1px;
            background: var(--line-faint);
          }

          .bg-rails__left {
            left: clamp(1.5rem, 5vw, 3rem);
          }

          .bg-rails__right {
            right: clamp(1.5rem, 5vw, 3rem);
          }
        }

        /* Registration marks (9×9px "+" at rail/divider intersections) */
        /* Rendered inline at specific intersection points in Phase 3 */
      `}</style>
    </>
  )
}
