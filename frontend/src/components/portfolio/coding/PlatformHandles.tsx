import type { CSSProperties } from 'react'
import { ExternalLink } from 'lucide-react'
import type { CodingPlatform } from '../../../features/portfolio/types'
import { Reveal } from '../../ui/Reveal'

export interface PlatformHandlesProps {
  readonly platforms: CodingPlatform[]
  readonly activeId?: string
}

export function PlatformHandles({ platforms, activeId = 'leetcode' }: PlatformHandlesProps) {
  return (
    <div className="platform-handles">
      {platforms.map((p, i) => (
        <Reveal key={p.id} delay={0.06 * i}>
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className={`platform-card ${p.id === activeId ? 'platform-card--active' : ''}`}
            style={{ '--platform-accent': p.accent } as CSSProperties}
            data-hover
          >
            <span className="platform-card__icon" aria-hidden="true">
              {p.id === 'leetcode' && 'LC'}
              {p.id === 'hackerrank' && 'HR'}
              {p.id === 'gfg' && 'GFG'}
            </span>
            <span className="platform-card__body">
              <span className="platform-card__label">{p.label}</span>
              <span className="platform-card__handle">@{p.handle}</span>
            </span>
            <ExternalLink size={14} className="platform-card__arrow" />
          </a>
        </Reveal>
      ))}
    </div>
  )
}
