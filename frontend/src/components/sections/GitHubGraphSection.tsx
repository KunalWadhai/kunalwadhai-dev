import { Loader2 } from 'lucide-react'
import { SITE } from '../../content/site'
import { useGithubContributions } from '../../hooks/useGithubContributions'

export function GitHubGraphSection() {
  const { data, state } = useGithubContributions()
  const weeks = chunkWeeks(data?.days ?? [])

  return (
    <section id="github" className="section">
      <div className="container">
        <div className="section__inner">
          <div className="section__title">
            <h2>Graph</h2>
          </div>
          <div className="section__content">
            <div className="work-intro">
              <h3 className="work-intro__title">Contribution pulse</h3>
              <p className="work-intro__description">
                Live GitHub heatmap for @{SITE.githubHandle} — the year as a signal, not a screenshot.
              </p>
            </div>

            <div className="gh-panel">
              {state === 'loading' && (
                <div className="gh-panel__status">
                  <Loader2 className="spin" size={20} />
                  Syncing contribution calendar…
                </div>
              )}
              {state === 'error' && (
                <p className="gh-panel__status">Could not reach GitHub. Try again shortly.</p>
              )}
              {data && (
                <>
                  <div className="gh-panel__stats">
                    <strong>{data.total.toLocaleString()}</strong>
                    <span>contributions in the last year</span>
                  </div>
                  <div className="gh-graph" role="img" aria-label="GitHub contribution graph">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="gh-graph__week">
                        {week.map((day) => (
                          <span
                            key={day.date}
                            className={`gh-cell gh-cell--${day.level}`}
                            title={`${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="gh-legend">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((l) => (
                      <span key={l} className={`gh-cell gh-cell--${l}`} />
                    ))}
                    <span>More</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function chunkWeeks(days: { date: string; count: number; level: number }[]) {
  const weeks: typeof days[] = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
  return weeks
}
