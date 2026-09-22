/**
 * Diagram 4: Service Health Tracing + Alerting
 * Flow: Services → Redis sliding window → Threshold check → Teams alert + CloudWatch
 * Optional simulator: slider for failure rate showing ok/warn/critical
 */

import { useState } from 'react'

const W = 740
const H = 260

export function HealthTracingDiagram() {
  const [failureRate, setFailureRate] = useState(5)  // percentage 0-100

  const successRate = 100 - failureRate
  const status: 'ok' | 'warn' | 'crit' =
    successRate >= 90 ? 'ok' :
    successRate >= 80 ? 'warn' : 'crit'

  const statusColor = { ok: 'var(--ok)', warn: 'var(--warn)', crit: 'var(--crit)' }[status]
  const statusLabel = { ok: 'Healthy', warn: 'Degraded', crit: 'Critical' }[status]

  // Node geometry
  const nodes = [
    { id: 'svc',    x: 20,  y: 106, w: 110, h: 48, label: 'Services (10+)',  sub: 'emit success/fail' },
    { id: 'redis',  x: 180, y: 106, w: 130, h: 48, label: 'Redis 15-min',    sub: 'sliding window' },
    { id: 'thresh', x: 360, y: 106, w: 130, h: 48, label: 'Threshold check', sub: 'warn · critical' },
    { id: 'teams',  x: 540, y: 60,  w: 110, h: 44, label: 'Teams alert',     sub: 'diagnostics' },
    { id: 'cw',     x: 540, y: 162, w: 110, h: 44, label: 'CloudWatch',      sub: 'dashboards' },
  ]
  const nm = Object.fromEntries(nodes.map(n => [n.id, n]))
  const cx = (n: typeof nodes[0]) => n.x + n.w / 2
  const cy = (n: typeof nodes[0]) => n.y + n.h / 2

  const edges = [
    { x1: nm.svc.x + nm.svc.w,     y1: cy(nm.svc),    x2: nm.redis.x,     y2: cy(nm.redis) },
    { x1: nm.redis.x + nm.redis.w,  y1: cy(nm.redis),  x2: nm.thresh.x,    y2: cy(nm.thresh) },
    { x1: nm.thresh.x + nm.thresh.w, y1: cy(nm.thresh) - 10, x2: nm.teams.x, y2: cy(nm.teams) },
    { x1: nm.thresh.x + nm.thresh.w, y1: cy(nm.thresh) + 10, x2: nm.cw.x,    y2: cy(nm.cw) },
  ]

  return (
    <figure role="img" aria-labelledby="htd-title" aria-describedby="htd-desc">
      <figcaption className="sr-only">
        <span id="htd-title">Service health tracing flow</span>
        <span id="htd-desc">
          Services emit success and failure events into a Redis 15-minute sliding window.
          The window checks success/failure ratios against configurable warn and critical
          thresholds. Threshold breaches trigger Teams alerts with diagnostics and are
          visible on CloudWatch dashboards.
        </span>
      </figcaption>

      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true"
        style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <marker id="htd-arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 Z" fill="var(--line-strong)" />
          </marker>
        </defs>

        {edges.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="var(--line-strong)" strokeWidth="1" markerEnd="url(#htd-arr)" />
        ))}

        {nodes.map((n) => (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="2"
              fill="var(--bg-raised)" stroke="var(--line-subtle)" strokeWidth="1" />
            <text x={cx(n)} y={n.y + 17} textAnchor="middle"
              fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">
              {n.label}
            </text>
            {n.sub && (
              <text x={cx(n)} y={n.y + 30} textAnchor="middle"
                fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)">
                {n.sub}
              </text>
            )}
          </g>
        ))}

        {/* Status indicator on threshold node */}
        <circle cx={cx(nm.thresh) + 48} cy={nm.thresh.y + 8} r="5"
          fill={statusColor} />
      </svg>

      {/* Interactive simulator */}
      <div className="htd-sim">
        <p className="htd-sim__label">
          Illustrative simulator — not production thresholds
        </p>
        <div className="htd-sim__row">
          <label htmlFor="htd-failure-rate" className="htd-sim__input-label">
            Failure rate: <span className="htd-sim__pct">{failureRate}%</span>
          </label>
          <input
            id="htd-failure-rate"
            type="range"
            min={0}
            max={30}
            value={failureRate}
            onChange={(e) => setFailureRate(Number(e.target.value))}
            className="htd-sim__slider"
            aria-valuemin={0}
            aria-valuemax={30}
            aria-valuenow={failureRate}
            aria-label="Simulated failure rate percentage"
          />
          <span className="htd-sim__status" style={{ color: statusColor }}>
            {statusLabel}
          </span>
        </div>
        <p className="htd-sim__thresholds">
          warn threshold: &lt;90% success · critical threshold: &lt;80% success
        </p>
      </div>

      <div className="diag-outcomes" aria-hidden="true">
        <span className="diag-outcome"><span className="diag-outcome__val">15 min</span> sliding window</span>
        <span className="diag-outcome"><span className="diag-outcome__val">10+</span> services monitored</span>
        <span className="diag-outcome"><span className="diag-outcome__val">↓</span> manual monitoring overhead</span>
      </div>

      <style>{`
        .htd-sim {
          margin-top: var(--space-5);
          padding: var(--space-4);
          background: var(--bg-inset);
          border: 1px solid var(--line-subtle);
          border-radius: var(--radius);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .htd-sim__label {
          font-size: var(--text-xs);
          font-family: var(--font-mono);
          color: var(--text-tertiary);
        }
        .htd-sim__row {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .htd-sim__input-label {
          font-size: var(--text-sm);
          font-family: var(--font-mono);
          color: var(--text-secondary);
          white-space: nowrap;
        }
        .htd-sim__pct {
          color: var(--text-primary);
          font-weight: 600;
          min-width: 3ch;
          display: inline-block;
        }
        .htd-sim__slider {
          flex: 1;
          min-width: 120px;
          accent-color: var(--accent);
        }
        .htd-sim__status {
          font-size: var(--text-sm);
          font-family: var(--font-mono);
          font-weight: 600;
          min-width: 7ch;
        }
        .htd-sim__thresholds {
          font-size: var(--text-xs);
          font-family: var(--font-mono);
          color: var(--text-tertiary);
        }
      `}</style>
    </figure>
  )
}
