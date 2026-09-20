import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { ProgrammingDashboards } from '../../features/portfolio/types'
import { buildCodingPlatforms } from '../../features/portfolio/codingPlatforms'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export interface CodingProfilesSectionProps {
  readonly dashboards?: ProgrammingDashboards
}

/** Subtle platform icon using the first letter(s) of the platform id */
const PLATFORM_ABBR: Record<string, string> = {
  leetcode:   'LC',
  hackerrank: 'HR',
  gfg:        'GFG',
}

/** One-line descriptor shown under the handle */
const PLATFORM_DESC: Record<string, string> = {
  leetcode:   'Data structures · algorithms · contests',
  hackerrank: 'Problem solving · certifications',
  gfg:        'Practice · interview prep',
}

export function CodingProfilesSection({ dashboards }: CodingProfilesSectionProps) {
  const platforms = buildCodingPlatforms(dashboards)
  if (!platforms.length) return null

  return (
    <section id="coding" className="section" aria-label="Coding profiles">
      <div className="container">
        <SectionHeader
          label="Coding"
          title="Competitive programming"
          description="Profiles across platforms — algorithms, problem solving, and contest performance."
        />

        <div className="coding-platforms">
          {platforms.map((p, i) => (
            <Reveal key={p.id} delay={0.06 * i}>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="coding-platform-card"
                style={{ '--platform-accent': p.accent } as CSSProperties}
                aria-label={`${p.label} profile — @${p.handle}`}
              >
                {/* Accent stripe at top */}
                <div className="coding-platform-card__stripe" aria-hidden="true" />

                {/* Abbreviation badge */}
                <span className="coding-platform-card__abbr" aria-hidden="true">
                  {PLATFORM_ABBR[p.id] ?? p.id.toUpperCase()}
                </span>

                <div className="coding-platform-card__body">
                  <span className="coding-platform-card__name">{p.label}</span>
                  <span className="coding-platform-card__handle">@{p.handle}</span>
                  <span className="coding-platform-card__desc">
                    {PLATFORM_DESC[p.id] ?? ''}
                  </span>
                </div>

                <ArrowUpRight
                  size={16}
                  className="coding-platform-card__arrow"
                  aria-hidden="true"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
