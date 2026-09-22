/**
 * Diagram 1: Multi-Provider Smart-Lock Provisioning
 * Flow: Reservation → Access Policy → Provider Adapter → Sign/Encrypt + TTL Cache → Vendor API → PIN Lifecycle
 * Hand-authored SVG, 1px strokes, 12px mono labels, accessible
 */

import { useState } from 'react'

interface Node {
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
  sub?: string
  note?: string
}

interface Edge {
  from: string
  to: string
  label?: string
  dashed?: boolean
}

const W = 800
const H = 380

const nodes: Node[] = [
  { id: 'reservation', x: 20,  y: 155, w: 130, h: 48, label: 'Reservation event',  sub: 'booking lifecycle' },
  { id: 'policy',      x: 200, y: 155, w: 130, h: 48, label: 'Access policy',       sub: 'room · window · TZ' },
  { id: 'adapter',     x: 380, y: 155, w: 130, h: 48, label: 'Provider adapter',    sub: 'Tuya · Seam · Mosler' },
  { id: 'encrypt',     x: 560, y: 60,  w: 130, h: 48, label: 'Sign / Encrypt',      sub: 'AES · HMAC-SHA256', note: 'per vendor API' },
  { id: 'cache',       x: 560, y: 248, w: 130, h: 48, label: 'TTL token cache',     sub: 'Redis · 1 hr expiry', note: '60% fewer calls' },
  { id: 'vendor',      x: 560, y: 155, w: 130, h: 48, label: 'Vendor API',          sub: 'Tuya · Seam · Mosler' },
  { id: 'pin',         x: 700, y: 155, w: 85,  h: 48, label: 'PIN lifecycle',       sub: 'CRUD · status' },
]

const edges: Edge[] = [
  { from: 'reservation', to: 'policy' },
  { from: 'policy',      to: 'adapter' },
  { from: 'adapter',     to: 'encrypt' },
  { from: 'adapter',     to: 'cache' },
  { from: 'encrypt',     to: 'vendor' },
  { from: 'cache',       to: 'vendor', dashed: true },
  { from: 'vendor',      to: 'pin' },
]

function cx(n: Node) { return n.x + n.w / 2 }
function cy(n: Node) { return n.y + n.h / 2 }

function edgePath(a: Node, b: Node): string {
  const ax = a.x + a.w, ay = cy(a)
  const bx = b.x,        by = cy(b)
  if (Math.abs(ay - by) < 4) {
    return `M${ax},${ay} L${bx},${by}`
  }
  const mx = (ax + bx) / 2
  return `M${ax},${ay} C${mx},${ay} ${mx},${by} ${bx},${by}`
}

// Special edges from adapter up to encrypt and down to cache
function adapterToEncrypt(a: Node, b: Node) {
  return `M${cx(a)},${a.y} L${cx(a)},${b.y + b.h} L${b.x},${b.y + b.h / 2}`
}
function adapterToCache(a: Node, b: Node) {
  return `M${cx(a)},${a.y + a.h} L${cx(a)},${b.y} L${b.x},${b.y + b.h / 2}`
}

export function SmartLockDiagram() {
  const [active, setActive] = useState<string | null>(null)
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

  return (
    <figure role="img" aria-labelledby="sld-title" aria-describedby="sld-desc">
      <figcaption className="sr-only">
        <span id="sld-title">Smart-lock provisioning flow</span>
        <span id="sld-desc">
          Reservation event flows to access policy, then to provider adapter. The adapter
          calls sign/encrypt (AES, HMAC-SHA256) and checks a TTL token cache before
          hitting the vendor API. The vendor API manages the PIN lifecycle (create, read,
          update, delete).
        </span>
      </figcaption>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="diag-svg"
        aria-hidden="true"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          <marker id="sld-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 Z" fill="var(--line-strong)" />
          </marker>
          <marker id="sld-arrow-accent" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 Z" fill="var(--accent)" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((e, i) => {
          if (e.from === 'adapter' && e.to === 'encrypt') {
            return (
              <path key={i}
                d={adapterToEncrypt(nodeMap['adapter'], nodeMap['encrypt'])}
                fill="none" stroke={active === 'adapter' || active === 'encrypt' ? 'var(--accent)' : 'var(--line-strong)'}
                strokeWidth="1" markerEnd={active === 'adapter' || active === 'encrypt' ? 'url(#sld-arrow-accent)' : 'url(#sld-arrow)'}
                strokeDasharray={e.dashed ? '4 3' : undefined}
              />
            )
          }
          if (e.from === 'adapter' && e.to === 'cache') {
            return (
              <path key={i}
                d={adapterToCache(nodeMap['adapter'], nodeMap['cache'])}
                fill="none" stroke={active === 'adapter' || active === 'cache' ? 'var(--accent)' : 'var(--line-strong)'}
                strokeWidth="1" markerEnd={active === 'adapter' || active === 'cache' ? 'url(#sld-arrow-accent)' : 'url(#sld-arrow)'}
                strokeDasharray={e.dashed ? '4 3' : undefined}
              />
            )
          }
          const a = nodeMap[e.from], b = nodeMap[e.to]
          if (!a || !b) return null
          const isActive = active === e.from || active === e.to
          return (
            <path key={i}
              d={edgePath(a, b)}
              fill="none"
              stroke={isActive ? 'var(--accent)' : 'var(--line-strong)'}
              strokeWidth="1"
              strokeDasharray={e.dashed ? '4 3' : undefined}
              markerEnd={isActive ? 'url(#sld-arrow-accent)' : 'url(#sld-arrow)'}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const isActive = active === n.id
          return (
            <g key={n.id}
              tabIndex={0}
              role="button"
              aria-label={`${n.label}${n.note ? ` — ${n.note}` : ''}`}
              onMouseEnter={() => setActive(n.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(n.id)}
              onBlur={() => setActive(null)}
              style={{ cursor: 'default', outline: 'none' }}
            >
              <rect
                x={n.x} y={n.y} width={n.w} height={n.h} rx="2"
                fill={isActive ? 'var(--accent-wash)' : 'var(--bg-raised)'}
                stroke={isActive ? 'var(--accent)' : 'var(--line-subtle)'}
                strokeWidth="1"
              />
              <text x={cx(n)} y={n.y + 17} textAnchor="middle"
                fill={isActive ? 'var(--accent)' : 'var(--text-primary)'}
                fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">
                {n.label}
              </text>
              {n.sub && (
                <text x={cx(n)} y={n.y + 30} textAnchor="middle"
                  fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)">
                  {n.sub}
                </text>
              )}
              {n.note && isActive && (
                <text x={cx(n)} y={n.y + n.h + 14} textAnchor="middle"
                  fill="var(--warn)" fontSize="9" fontFamily="var(--font-mono)">
                  {n.note}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Outcomes row */}
      <div className="diag-outcomes" aria-hidden="true">
        <span className="diag-outcome"><span className="diag-outcome__val">99.2%</span> PIN delivery</span>
        <span className="diag-outcome"><span className="diag-outcome__val">60%</span> fewer Tuya API calls</span>
        <span className="diag-outcome"><span className="diag-outcome__val">100+</span> properties</span>
      </div>

      <style>{`
        .diag-svg { overflow: visible; }
        .diag-outcomes {
          display: flex; flex-wrap: wrap; gap: var(--space-5);
          margin-top: var(--space-5);
          padding-top: var(--space-4);
          border-top: 1px solid var(--line-subtle);
        }
        .diag-outcome {
          display: flex; flex-direction: column; gap: 2px;
          font-size: var(--text-xs); color: var(--text-secondary);
          font-family: var(--font-mono);
        }
        .diag-outcome__val {
          font-size: var(--text-lg); font-weight: 600;
          color: var(--text-primary); font-variant-numeric: tabular-nums;
        }
      `}</style>
    </figure>
  )
}
