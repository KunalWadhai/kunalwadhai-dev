import { useMemo } from 'react'
import type { LeetCodeContestEntry } from '../../../features/portfolio/types'

export interface ContestRatingChartProps {
  readonly history: LeetCodeContestEntry[]
  readonly currentRating: number
}

const W = 520
const H = 180
const PAD = { t: 16, r: 12, b: 28, l: 40 }

export function ContestRatingChart({ history, currentRating }: ContestRatingChartProps) {
  const { path, areaPath, points, yTicks, minY, maxY } = useMemo(() => {
    if (!history.length) {
      return { path: '', areaPath: '', points: [], yTicks: [], minY: 0, maxY: 2000 }
    }

    const ratings = history.map((h) => h.rating)
    const minY = Math.floor(Math.min(...ratings) / 50) * 50 - 50
    const maxY = Math.ceil(Math.max(...ratings) / 50) * 50 + 50
    const innerW = W - PAD.l - PAD.r
    const innerH = H - PAD.t - PAD.b

    const points = history.map((h, i) => {
      const x = PAD.l + (i / Math.max(history.length - 1, 1)) * innerW
      const y = PAD.t + innerH - ((h.rating - minY) / (maxY - minY)) * innerH
      return { x, y, ...h }
    })

    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
    const areaPath = `${line} L ${points[points.length - 1].x.toFixed(1)} ${(PAD.t + innerH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(PAD.t + innerH).toFixed(1)} Z`

    const yTicks = [minY, Math.round((minY + maxY) / 2), maxY]

    return { path: line, areaPath, points, yTicks, minY, maxY }
  }, [history])

  if (!history.length) {
    return (
      <div className="lc-chart lc-chart--empty">
        <p>No contest history available yet.</p>
      </div>
    )
  }

  const delta = history.length >= 2 ? currentRating - history[0].rating : 0

  return (
    <div className="lc-chart">
      <div className="lc-chart__head">
        <div>
          <h4 className="lc-chart__title">Contest rating trend</h4>
          <p className="lc-chart__sub">Last {history.length} attended contests</p>
        </div>
        <div className="lc-chart__rating">
          <span className="lc-chart__rating-val">{currentRating}</span>
          <span className={`lc-chart__delta ${delta >= 0 ? 'lc-chart__delta--up' : 'lc-chart__delta--down'}`}>
            {delta >= 0 ? '+' : ''}
            {delta} overall
          </span>
        </div>
      </div>

      <svg
        className="lc-chart__svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Contest rating chart from ${history[0].rating} to ${currentRating}`}
      >
        <defs>
          <linearGradient id="ratingFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(157, 123, 255, 0.35)" />
            <stop offset="100%" stopColor="rgba(157, 123, 255, 0)" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const innerH = H - PAD.t - PAD.b
          const y = PAD.t + innerH - ((tick - minY) / (maxY - minY)) * innerH
          return (
            <g key={tick}>
              <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} className="lc-chart__grid-line" />
              <text x={PAD.l - 8} y={y + 4} className="lc-chart__axis-label" textAnchor="end">
                {tick}
              </text>
            </g>
          )
        })}

        <path d={areaPath} fill="url(#ratingFill)" />
        <path d={path} className="lc-chart__line" fill="none" />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} className="lc-chart__dot" />
            <title>
              {p.title}: {p.rating} ({new Date(p.startTime * 1000).toLocaleDateString()})
            </title>
          </g>
        ))}
      </svg>
    </div>
  )
}
