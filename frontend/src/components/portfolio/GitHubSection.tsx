import { useState } from 'react'
import { GitBranch, Users } from 'lucide-react'
import type { GitHubSummary } from '../../features/portfolio/types'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export interface GitHubSectionProps {
  readonly summary: GitHubSummary | null
  readonly handle: string
}

/**
 * GitHub contribution graph fetched directly from GitHub's SVG endpoint.
 * ghchart.rshah.org proxies the official GitHub contribution calendar and
 * returns a clean dark-compatible SVG — no auth required, real data.
 *
 * We load the SVG as an <img> (no JS needed, zero deps).
 * The accent colour 'a1a1aa' is our --fg-subtle grey so it blends with both themes.
 */
function ContributionGraph({ handle }: { readonly handle: string }) {
  const [errored, setErrored] = useState(false)

  // ghchart.rshah.org/<color>/<username> — colour is the darkest cell hex (no #)
  const chartUrl = `https://ghchart.rshah.org/6366f1/${handle}`

  if (errored) {
    return (
      <div className="gh-graph-fallback">
        <p>
          Contribution graph unavailable.{' '}
          <a
            href={`https://github.com/${handle}`}
            target="_blank"
            rel="noreferrer"
            className="gh-graph-fallback__link"
          >
            View on GitHub ↗
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="gh-graph-wrap">
      <img
        src={chartUrl}
        alt={`${handle}'s GitHub contribution graph`}
        className="gh-graph-img"
        onError={() => setErrored(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

export function GitHubSection({ summary, handle }: GitHubSectionProps) {
  return (
    <section id="github" className="section" aria-label="GitHub activity">
      <div className="container">
        <SectionHeader
          label="GitHub"
          title="Contribution activity"
          description={`Daily commits from @${handle} — the actual graph, not a screenshot.`}
        />

        {/* Compact stat row — only shown if API data available */}
        {summary && (
          <Reveal>
            <div className="gh-stats-row">
              <div className="gh-stat">
                <GitBranch size={14} aria-hidden="true" />
                <strong>{summary.publicRepos}</strong>
                <span>repositories</span>
              </div>
              <div className="gh-stat">
                <Users size={14} aria-hidden="true" />
                <strong>{summary.followers}</strong>
                <span>followers</span>
              </div>
              <div className="gh-stat">
                <Users size={14} aria-hidden="true" />
                <strong>{summary.following}</strong>
                <span>following</span>
              </div>
            </div>
          </Reveal>
        )}

        {/* Live contribution graph */}
        <Reveal delay={0.08}>
          <ContributionGraph handle={handle} />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="gh-graph-footer">
            <a
              href={`https://github.com/${handle}`}
              target="_blank"
              rel="noreferrer"
              className="gh-graph-link"
              aria-label={`View ${handle} on GitHub`}
            >
              github.com/{handle} ↗
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
