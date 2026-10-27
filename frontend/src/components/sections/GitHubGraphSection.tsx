import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { SITE } from '../../content/site'
import { useGithubContributions } from '../../hooks/useGithubContributions'

type ContributionDay = { date: string; count: number; level: number }

export function GitHubGraphSection() {
  const currentYear = new Date().getUTCFullYear()
  const availableYears = Array.from({ length: 5 }, (_, index) => currentYear - index)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const { data, state } = useGithubContributions(selectedYear)
  const weeks = buildCalendarWeeks(data?.days ?? [], selectedYear)
  const months = buildMonthLabels(selectedYear, weeks.length)

  return (
    <section id="github" className="section gh-section">
      <div className="container">
        <div className="section__inner">
          <div className="section__title">
            <h2>Graph</h2>
          </div>
          <div className="section__content">
            <div className="work-intro">
              <h3 className="work-intro__title">Contribution pulse</h3>
              <p className="work-intro__description">
                Live contribution activity for @{SITE.githubHandle}, organized by calendar year.
              </p>
            </div>

            <div className="gh-panel">
              <div className="gh-panel__header">
                <div className="gh-panel__stats">
                  <strong>{data ? data.total.toLocaleString() : '—'}</strong>
                  <span><b>contributions</b><small>in {selectedYear}</small></span>
                </div>
                <div className="gh-year-picker" role="group" aria-label="Contribution year">
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      type="button"
                      className={year === selectedYear ? 'is-selected' : ''}
                      aria-pressed={year === selectedYear}
                      onClick={() => setSelectedYear(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
              <div className="gh-panel__main">
                  {state === 'loading' && (
                    <div className="gh-panel__status" role="status">
                      <Loader2 className="spin" size={17} />
                      Loading {selectedYear} contributions…
                    </div>
                  )}
                  {state === 'error' && (
                    <p className="gh-panel__status" role="status">
                      Could not load GitHub contributions for {selectedYear}. Try another year shortly.
                    </p>
                  )}
                  {data && state === 'ready' && (
                    <div className="gh-calendar-scroll">
                      <div className="gh-calendar" style={{ '--week-count': weeks.length } as React.CSSProperties}>
                        <div className="gh-months" aria-hidden="true">
                          {months.map((month) => (
                            <span key={month.name} style={{ gridColumn: `${month.start + 1} / span ${month.span}` }}>
                              {month.name}
                            </span>
                          ))}
                        </div>
                        <div className="gh-calendar-grid">
                          <div className="gh-weekdays" aria-hidden="true">
                            <span />
                            <span>Mon</span>
                            <span />
                            <span>Wed</span>
                            <span />
                            <span>Fri</span>
                            <span />
                          </div>
                          <div className="gh-graph" role="img" aria-label={`GitHub contribution graph for ${selectedYear}`}>
                            {weeks.map((week, wi) => (
                              <div key={wi} className="gh-graph__week">
                                {week.map((day, di) => day ? (
                                  <span
                                    key={day.date}
                                    className={`gh-cell gh-cell--${Math.max(0, Math.min(4, day.level))}`}
                                    title={`${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}`}
                                  />
                                ) : (
                                  <span key={`empty-${wi}-${di}`} className="gh-cell gh-cell--empty" aria-hidden="true" />
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {data && state === 'ready' && (
                    <div className="gh-legend">
                      <span>Less</span>
                      {[0, 1, 2, 3, 4].map((level) => (
                        <span key={level} className={`gh-cell gh-cell--${level}`} />
                      ))}
                      <span>More</span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function buildCalendarWeeks(days: ContributionDay[], year: number) {
  const firstDay = new Date(Date.UTC(year, 0, 1))
  const leadingDays = firstDay.getUTCDay()
  const yearLength = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / 86_400_000
  const weekCount = Math.ceil((leadingDays + yearLength) / 7)
  const byDate = new Map(days.map((day) => [day.date, day]))
  const weeks: (ContributionDay | null)[][] = []

  for (let week = 0; week < weekCount; week += 1) {
    const cells: (ContributionDay | null)[] = []
    for (let weekday = 0; weekday < 7; weekday += 1) {
      const dayIndex = week * 7 + weekday - leadingDays
      if (dayIndex < 0 || dayIndex >= yearLength) {
        cells.push(null)
      } else {
        const date = new Date(Date.UTC(year, 0, dayIndex + 1)).toISOString().slice(0, 10)
        cells.push(byDate.get(date) ?? { date, count: 0, level: 0 })
      }
    }
    weeks.push(cells)
  }
  return weeks
}

function buildMonthLabels(year: number, weekCount: number) {
  const firstDay = new Date(Date.UTC(year, 0, 1)).getUTCDay()
  const starts = Array.from({ length: 12 }, (_, month) => ({
    name: new Date(Date.UTC(year, month, 1)).toLocaleString('en', { month: 'short', timeZone: 'UTC' }),
    start: Math.floor((firstDay + (Date.UTC(year, month, 1) - Date.UTC(year, 0, 1)) / 86_400_000) / 7),
  }))
  return starts.map((month, index) => ({
    ...month,
    span: Math.max(1, (starts[index + 1]?.start ?? weekCount) - month.start),
  }))
}
