/**
 * Diagram 2: PMS Webhook Ingestion (Mews Lambda)
 * Flow: Webhook → Lambda Handler (dual-mode) → Middleware Pipeline → MongoDB + OpenSearch
 */

import { useState } from 'react'

const W = 780
const H = 320

interface BoxNode { id: string; x: number; y: number; w: number; h: number; label: string; sub?: string; badge?: string }
interface Arrow { x1: number; y1: number; x2: number; y2: number; label?: string; vertical?: boolean }

const boxes: BoxNode[] = [
  { id: 'webhook', x: 10,  y: 136, w: 110, h: 48, label: 'Mews webhook', sub: 'POST ≤100 events' },
  { id: 'lambda',  x: 160, y: 112, w: 130, h: 96, label: 'Lambda handler', sub: 'dual-mode deploy', badge: 'Serverless FW' },
  { id: 'pipe',    x: 340, y: 112, w: 130, h: 96, label: 'Middleware', sub: 'Joi · dedup · shape' },
  { id: 'mongo',   x: 530, y: 112, w: 110, h: 44, label: 'MongoDB', sub: 'persistence' },
  { id: 'search',  x: 530, y: 164, w: 110, h: 44, label: 'OpenSearch', sub: 'full-text index' },
]

export function WebhookDiagram() {
  const [active, setActive] = useState<string | null>(null)

  const bm = Object.fromEntries(boxes.map(b => [b.id, b]))

  function cx(b: BoxNode) { return b.x + b.w / 2 }
  function cy(b: BoxNode) { return b.y + b.h / 2 }

  const arrows: Arrow[] = [
    { x1: bm.webhook.x + bm.webhook.w, y1: cy(bm.webhook), x2: bm.lambda.x, y2: cy(bm.lambda) },
    { x1: bm.lambda.x + bm.lambda.w,   y1: cy(bm.lambda),  x2: bm.pipe.x,   y2: cy(bm.pipe) },
    { x1: bm.pipe.x + bm.pipe.w, y1: bm.pipe.y + 28, x2: bm.mongo.x, y2: cy(bm.mongo) },
    { x1: bm.pipe.x + bm.pipe.w, y1: bm.pipe.y + 68, x2: bm.search.x, y2: cy(bm.search) },
  ]

  // Dedup annotation
  const dedupY = bm.pipe.y + bm.pipe.h + 16

  return (
    <figure role="img" aria-labelledby="whd-title" aria-describedby="whd-desc">
      <figcaption className="sr-only">
        <span id="whd-title">Mews webhook ingestion flow</span>
        <span id="whd-desc">
          Mews sends a POST with up to 100 events to a dual-mode Lambda handler. A
          middleware pipeline validates with Joi, deduplicates by providerRefId, and
          shapes the response. Events are persisted to MongoDB and indexed in OpenSearch.
        </span>
      </figcaption>

      <svg viewBox={`0 0 ${W} ${H}`} className="diag-svg"
        aria-hidden="true" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <marker id="whd-arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 Z" fill="var(--line-strong)" />
          </marker>
          <marker id="whd-arr-a" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 Z" fill="var(--accent)" />
          </marker>
        </defs>

        {/* Arrows */}
        {arrows.map((a, i) => {
          return (
            <line key={i}
              x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              stroke="var(--line-strong)" strokeWidth="1"
              markerEnd="url(#whd-arr)" />
          )
        })}

        {/* Dedup annotation */}
        <text x={cx(bm.pipe)} y={dedupY} textAnchor="middle"
          fill="var(--text-tertiary)" fontSize="9" fontFamily="var(--font-mono)">
          providerRefId dedup · ≤100/POST · 6 event types
        </text>

        {/* Boxes */}
        {boxes.map((b) => {
          const isActive = active === b.id
          return (
            <g key={b.id} tabIndex={0} role="button"
              aria-label={b.label}
              onMouseEnter={() => setActive(b.id)} onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(b.id)} onBlur={() => setActive(null)}
              style={{ cursor: 'default', outline: 'none' }}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2"
                fill={isActive ? 'var(--accent-wash)' : 'var(--bg-raised)'}
                stroke={isActive ? 'var(--accent)' : 'var(--line-subtle)'}
                strokeWidth="1" />
              <text x={cx(b)} y={b.y + 17} textAnchor="middle"
                fill={isActive ? 'var(--accent)' : 'var(--text-primary)'}
                fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">{b.label}</text>
              {b.sub && (
                <text x={cx(b)} y={b.y + 30} textAnchor="middle"
                  fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)">{b.sub}</text>
              )}
              {b.badge && (
                <text x={cx(b)} y={b.y + b.h - 10} textAnchor="middle"
                  fill="var(--ok)" fontSize="9" fontFamily="var(--font-mono)">{b.badge}</text>
              )}
            </g>
          )
        })}

        {/* CI/CD note */}
        <rect x={160} y={220} width={130} height={28} rx="2"
          fill="transparent" stroke="var(--line-faint)" strokeDasharray="4 3" strokeWidth="1" />
        <text x={225} y={238} textAnchor="middle"
          fill="var(--text-tertiary)" fontSize="9" fontFamily="var(--font-mono)">
          CI/CD · zero-downtime deploy
        </text>
      </svg>

      <div className="diag-outcomes" aria-hidden="true">
        <span className="diag-outcome"><span className="diag-outcome__val">5,000+</span> events/month</span>
        <span className="diag-outcome"><span className="diag-outcome__val">6</span> event types</span>
        <span className="diag-outcome"><span className="diag-outcome__val">zero-downtime</span> releases</span>
      </div>
    </figure>
  )
}
