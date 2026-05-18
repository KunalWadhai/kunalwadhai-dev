import { useMemo } from 'react'
import type { LeetCodeActivityDay } from '../../../features/portfolio/types'

export interface LeetCodeHeatmapProps {
  readonly activity: LeetCodeActivityDay[]
  readonly streak: number
}

function level(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 9) return 3
  return 4
}

export function LeetCodeHeatmap({ activity, streak }: LeetCodeHeatmapProps) {
  const { weeks, monthLabels } = useMemo(() => {
    const countByDate = new Map(activity.map((d) => [d.date, d.count]))
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const start = new Date(today)
    start.setDate(start.getDate() - 26 * 7 + 1)
    const startDow = start.getDay()
    start.setDate(start.getDate() - startDow)

    const weeks: { date: string; count: number; lvl: 0 | 1 | 2 | 3 | 4 }[][] = []
    const monthLabels: { label: string; col: number }[] = []
    let cursor = new Date(start)
    let lastMonth = -1

    for (let w = 0; w < 27; w++) {
      const week: { date: string; count: number; lvl: 0 | 1 | 2 | 3 | 4 }[] = []
      for (let d = 0; d < 7; d++) {
        const iso = cursor.toISOString().slice(0, 10)
        const count = countByDate.get(iso) ?? 0
        week.push({ date: iso, count, lvl: level(count) })

        if (cursor.getMonth() !== lastMonth && d === 0) {
          monthLabels.push({
            label: cursor.toLocaleDateString('en-US', { month: 'short' }),
            col: w,
          })
          lastMonth = cursor.getMonth()
        }
        cursor.setDate(cursor.getDate() + 1)
      }
      weeks.push(week)
    }

    return { weeks, monthLabels }
  }, [activity])

  return (
    <div className="lc-heatmap">
      <div className="lc-heatmap__head">
        <div>
          <h4 className="lc-heatmap__title">Submission consistency</h4>
          <p className="lc-heatmap__sub">Last 26 weeks · {activity.length} active days logged</p>
        </div>
        <div className="lc-heatmap__streak">
          <span className="lc-heatmap__streak-val">{streak}</span>
          <span className="lc-heatmap__streak-label">day streak</span>
        </div>
      </div>

      <div className="lc-heatmap__chart" role="img" aria-label="LeetCode submission activity heatmap">
        <div className="lc-heatmap__months">
          {monthLabels.map((m) => (
            <span key={`${m.label}-${m.col}`} style={{ gridColumn: m.col + 2 }}>
              {m.label}
            </span>
          ))}
        </div>
        <div className="lc-heatmap__dow">
          <span />
          <span>Mon</span>
          <span />
          <span>Wed</span>
          <span />
          <span>Fri</span>
          <span />
        </div>
        <div className="lc-heatmap__grid">
          {weeks.map((week, wi) =>
            week.map((day, di) => (
              <span
                key={`${wi}-${di}`}
                className={`lc-heatmap__cell lc-heatmap__cell--${day.lvl}`}
                title={`${day.date}: ${day.count} submission${day.count === 1 ? '' : 's'}`}
              />
            ))
          )}
        </div>
      </div>

      <div className="lc-heatmap__legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className={`lc-heatmap__cell lc-heatmap__cell--${l}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
