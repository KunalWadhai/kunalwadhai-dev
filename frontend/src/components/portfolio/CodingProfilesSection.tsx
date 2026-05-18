import { Flame, Loader2, Target, Trophy, Zap } from 'lucide-react'
import type { LeetCodeStats, ProgrammingDashboards } from '../../features/portfolio/types'
import { buildCodingPlatforms } from '../../features/portfolio/codingPlatforms'
import { useCodingStats } from '../../hooks/useCodingStats'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { ContestRatingChart } from './coding/ContestRatingChart'
import { LeetCodeHeatmap } from './coding/LeetCodeHeatmap'
import { PlatformHandles } from './coding/PlatformHandles'

export interface CodingProfilesSectionProps {
  readonly dashboards?: ProgrammingDashboards
}

interface SolvedBarProps {
  readonly label: string
  readonly count: number
  readonly total: number
  readonly variant: 'easy' | 'medium' | 'hard'
}

function SolvedBar({ label, count, total, variant }: SolvedBarProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="lc-solved-row">
      <div className="lc-solved-row__meta">
        <span className={`lc-solved-row__label lc-solved-row__label--${variant}`}>{label}</span>
        <span className="lc-solved-row__count">{count}</span>
      </div>
      <div className="lc-solved-row__track">
        <span className={`lc-solved-row__fill lc-solved-row__fill--${variant}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function LeetCodeDashboard({ stats }: { readonly stats: LeetCodeStats }) {
  const { solved, contest } = stats
  const total = solved.total || 1

  return (
    <div className="lc-dashboard">
      <div className="lc-dashboard__stats">
        <Reveal className="lc-stat lc-stat--hero">
          <Target size={20} />
          <div>
            <strong>{solved.total}</strong>
            <span>problems solved</span>
          </div>
          <div className="lc-stat__rank">#{stats.ranking?.toLocaleString() ?? '—'} global</div>
        </Reveal>

        <Reveal delay={0.05} className="lc-stat">
          <Trophy size={18} />
          <div>
            <strong>{contest.rating}</strong>
            <span>contest rating</span>
          </div>
          <div className="lc-stat__meta">Top {contest.topPercentage?.toFixed(1) ?? '—'}%</div>
        </Reveal>

        <Reveal delay={0.1} className="lc-stat">
          <Flame size={18} />
          <div>
            <strong>{stats.streak}</strong>
            <span>day streak</span>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lc-stat">
          <Zap size={18} />
          <div>
            <strong>{contest.attendedContestsCount}</strong>
            <span>contests joined</span>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="lc-dashboard__solved">
        <h4 className="lc-dashboard__solved-title">Difficulty breakdown</h4>
        <SolvedBar label="Easy" count={solved.easy} total={total} variant="easy" />
        <SolvedBar label="Medium" count={solved.medium} total={total} variant="medium" />
        <SolvedBar label="Hard" count={solved.hard} total={total} variant="hard" />
      </Reveal>

      <Reveal delay={0.15} className="lc-dashboard__charts">
        <ContestRatingChart history={stats.contestHistory} currentRating={contest.rating} />
        <LeetCodeHeatmap activity={stats.activity} streak={stats.streak} />
      </Reveal>
    </div>
  )
}

export function CodingProfilesSection({ dashboards }: CodingProfilesSectionProps) {
  const platforms = buildCodingPlatforms(dashboards)
  const { leetcode, state, handle } = useCodingStats(dashboards)

  if (!platforms.length) return null

  return (
    <section id="coding" className="section section--coding" aria-label="Coding profiles">
      <SectionHeader
        label="// coding profiles"
        title="Algorithm craft & consistency"
        description="Live stats from competitive programming platforms — practice rhythm, contest performance, and problem-solving depth."
      />

      <PlatformHandles platforms={platforms} activeId="leetcode" />

      {handle && (
        <div className="lc-panel">
          {state === 'loading' && (
            <div className="lc-panel__loading" role="status" aria-live="polite">
              <Loader2 size={28} className="lc-panel__spinner" />
              <span>Fetching live LeetCode stats for @{handle}…</span>
            </div>
          )}

          {state === 'error' && !leetcode && (
            <p className="lc-panel__error">
              Could not load LeetCode stats. Check the handle or try again later.
            </p>
          )}

          {leetcode && <LeetCodeDashboard stats={leetcode} />}

          {leetcode && (
            <p className="lc-panel__freshness">
              Updated {new Date(leetcode.fetchedAt).toLocaleString()} · {leetcode.totalActiveDays} active days
              {leetcode.activeYears.length > 0 && ` · ${leetcode.activeYears.join(', ')}`}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
