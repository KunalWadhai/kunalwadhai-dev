import { ExternalLink, GitBranch, Star, Users } from 'lucide-react'
import type { GitHubSummary } from '../../features/portfolio/types'
import { normalizeUrl } from '../../features/portfolio/utils'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export interface GitHubSectionProps {
  readonly summary: GitHubSummary | null
  readonly handle: string
}

export function GitHubSection({ summary, handle }: GitHubSectionProps) {
  if (!summary) return null

  return (
    <section id="github" className="section section--github" aria-label="GitHub activity">
      <SectionHeader
        label="// open source"
        title="GitHub pulse"
        description={`Live snapshot from @${handle}`}
      />

      <div className="github-stats">
        <Reveal className="github-stat">
          <GitBranch size={18} />
          <strong>{summary.publicRepos}</strong>
          <span>repos</span>
        </Reveal>
        <Reveal delay={0.06} className="github-stat">
          <Users size={18} />
          <strong>{summary.followers}</strong>
          <span>followers</span>
        </Reveal>
        <Reveal delay={0.12} className="github-stat">
          <Star size={18} />
          <strong>{summary.following}</strong>
          <span>following</span>
        </Reveal>
      </div>

      <div className="github-repos">
        {summary.repos.slice(0, 6).map((repo, i) => (
          <Reveal key={repo.name} delay={0.05 * i} className="github-repo" data-hover>
            <a href={normalizeUrl(repo.html_url)} target="_blank" rel="noreferrer">
              <span className="github-repo__name">{repo.name}</span>
              <span className="github-repo__meta">
                {repo.language && <span>{repo.language}</span>}
                {repo.stargazers > 0 && (
                  <span>
                    <Star size={12} /> {repo.stargazers}
                  </span>
                )}
                <ExternalLink size={12} />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
