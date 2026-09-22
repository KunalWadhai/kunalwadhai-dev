/**
 * Diagram 5: Shared Platform Library + Integration Orchestration
 * Center: shared package library → 10+ services (spokes)
 * Top: orchestration service consuming the library
 */

import { useState } from 'react'

const W = 760
const H = 380

export function SharedLibraryDiagram() {
  const [active, setActive] = useState<string | null>(null)

  // Shared library at center
  const lib = { x: 280, y: 170, w: 200, h: 56 }
  const libCx = lib.x + lib.w / 2

  // Orchestration at top
  const orch = { x: 250, y: 30, w: 260, h: 72 }
  const orchCx = orch.x + orch.w / 2

  // 10 services in two rows below
  const serviceNames = [
    'PMS Webhook', 'Lock Provisioning', 'Booking Sync',
    'Inventory Svc', 'Payment Svc',
    'Auth Svc', 'Notification Svc', 'Search Indexer',
    'Health Tracer', '+2 more',
  ]
  const cols = 5, rowH = 40, startY = 290, cellW = 140, gapX = 8
  const totalW = cols * cellW + (cols - 1) * gapX
  const startX = (W - totalW) / 2

  const services = serviceNames.map((name, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    return {
      id: `svc-${i}`,
      name,
      x: startX + col * (cellW + gapX),
      y: startY + row * (rowH + 8),
      w: cellW,
      h: rowH - 4,
    }
  })

  // Edges from library to each service
  const libBottom = lib.y + lib.h

  return (
    <figure role="img" aria-labelledby="sld2-title" aria-describedby="sld2-desc">
      <figcaption className="sr-only">
        <span id="sld2-title">Shared platform library and orchestration</span>
        <span id="sld2-desc">
          A shared NPM package exports schemas, utilities, and models consumed by 10+
          services. A central orchestration service coordinates property metadata, booking
          sync, inventory, and OpenSearch indexing. 20+ integrations are standardized
          through this library.
        </span>
      </figcaption>

      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true"
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
        <defs>
          <marker id="sl2-arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 Z" fill="var(--line-strong)" />
          </marker>
          <marker id="sl2-arr-a" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 Z" fill="var(--accent)" />
          </marker>
        </defs>

        {/* Orch → library */}
        <line x1={orchCx} y1={orch.y + orch.h}
              x2={libCx}  y2={lib.y}
          stroke={active === 'orch' ? 'var(--accent)' : 'var(--line-strong)'}
          strokeWidth="1" markerEnd={active === 'orch' ? 'url(#sl2-arr-a)' : 'url(#sl2-arr)'} />

        {/* Library → services */}
        {services.map((s) => {
          const svcCx = s.x + s.w / 2
          const isAct = active === s.id || active === 'lib'
          return (
            <line key={s.id}
              x1={libCx} y1={libBottom}
              x2={svcCx} y2={s.y}
              stroke={isAct ? 'var(--accent)' : 'var(--line-faint)'}
              strokeWidth={isAct ? 1.5 : 1} strokeDasharray="3 3"
              markerEnd={isAct ? 'url(#sl2-arr-a)' : 'url(#sl2-arr)'} />
          )
        })}

        {/* Orchestration service */}
        <g tabIndex={0} role="button" aria-label="Central orchestration service"
          onMouseEnter={() => setActive('orch')} onMouseLeave={() => setActive(null)}
          onFocus={() => setActive('orch')} onBlur={() => setActive(null)}
          style={{ cursor: 'default', outline: 'none' }}>
          <rect x={orch.x} y={orch.y} width={orch.w} height={orch.h} rx="2"
            fill={active === 'orch' ? 'var(--accent-wash)' : 'var(--bg-raised)'}
            stroke={active === 'orch' ? 'var(--accent)' : 'var(--line-subtle)'}
            strokeWidth="1" />
          <text x={orchCx} y={orch.y + 18} textAnchor="middle"
            fill={active === 'orch' ? 'var(--accent)' : 'var(--text-primary)'}
            fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">Orchestration service</text>
          <text x={orchCx} y={orch.y + 32} textAnchor="middle"
            fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)">
            property metadata · booking sync
          </text>
          <text x={orchCx} y={orch.y + 46} textAnchor="middle"
            fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)">
            inventory · OpenSearch indexing
          </text>
        </g>

        {/* Shared library (center) */}
        <g tabIndex={0} role="button" aria-label="Shared package library: schemas, utilities, models"
          onMouseEnter={() => setActive('lib')} onMouseLeave={() => setActive(null)}
          onFocus={() => setActive('lib')} onBlur={() => setActive(null)}
          style={{ cursor: 'default', outline: 'none' }}>
          <rect x={lib.x} y={lib.y} width={lib.w} height={lib.h} rx="2"
            fill={active === 'lib' ? 'var(--accent-wash)' : 'var(--bg-raised)'}
            stroke={active === 'lib' ? 'var(--accent)' : 'var(--line-strong)'}
            strokeWidth="1.5" />
          <text x={libCx} y={lib.y + 18} textAnchor="middle"
            fill={active === 'lib' ? 'var(--accent)' : 'var(--text-primary)'}
            fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">@guestara/platform-lib</text>
          <text x={libCx} y={lib.y + 32} textAnchor="middle"
            fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)">
            schemas (Zod) · utilities · Mongoose models
          </text>
          <text x={libCx} y={lib.y + 46} textAnchor="middle"
            fill="var(--text-tertiary)" fontSize="9" fontFamily="var(--font-mono)">
            consumed by 10+ services
          </text>
        </g>

        {/* Service nodes */}
        {services.map((s) => {
          const svcCx = s.x + s.w / 2
          const isAct = active === s.id
          const isLast = s.name === '+2 more'
          return (
            <g key={s.id} tabIndex={0} role="button" aria-label={s.name}
              onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(s.id)} onBlur={() => setActive(null)}
              style={{ cursor: 'default', outline: 'none' }}>
              <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="2"
                fill={isAct ? 'var(--accent-wash)' : 'var(--bg-raised)'}
                stroke={isLast ? 'var(--line-faint)' : (isAct ? 'var(--accent)' : 'var(--line-subtle)')}
                strokeWidth="1"
                strokeDasharray={isLast ? '4 3' : undefined} />
              <text x={svcCx} y={s.y + s.h / 2 + 4} textAnchor="middle"
                fill={isLast ? 'var(--text-tertiary)' : (isAct ? 'var(--accent)' : 'var(--text-secondary)')}
                fontSize="10" fontFamily="var(--font-mono)">{s.name}</text>
            </g>
          )
        })}
      </svg>

      <div className="diag-outcomes" aria-hidden="true">
        <span className="diag-outcome"><span className="diag-outcome__val">10+</span> services on library</span>
        <span className="diag-outcome"><span className="diag-outcome__val">20+</span> integrations standardized</span>
        <span className="diag-outcome"><span className="diag-outcome__val">80%</span> fewer manual data errors</span>
        <span className="diag-outcome"><span className="diag-outcome__val">50%</span> lower API latency</span>
      </div>
    </figure>
  )
}
