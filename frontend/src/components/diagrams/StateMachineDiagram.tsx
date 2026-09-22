/**
 * Diagram 3: Reservation State Machine (4-state FSM)
 * Interactive: click a state to see guard conditions and timezone logic
 * States: Confirmed → Pre-Checkin → Checkin → Checkout | Canceled
 */

import { useState } from 'react'

interface State {
  id: string
  x: number
  y: number
  r: number
  label: string
  guards: string[]
}

interface Transition { from: string; to: string; label: string; dashed?: boolean }

const W = 720
const H = 300

const states: State[] = [
  { id: 'confirmed',   x: 90,  y: 150, r: 42, label: 'Confirmed',   guards: ['Booking received', 'Status = CONFIRMED', 'UTC timestamp stored'] },
  { id: 'precheckin',  x: 240, y: 150, r: 42, label: 'Pre-Checkin', guards: ['Check-in window opens', 'UTC→local TZ conversion', 'SINGLE/GROUP classification'] },
  { id: 'checkin',     x: 400, y: 150, r: 42, label: 'Checkin',     guards: ['Guest arrives', 'Check-in time reached', 'Access code delivered'] },
  { id: 'checkout',    x: 560, y: 90,  r: 36, label: 'Checkout',    guards: ['Check-out time reached', 'Guest departed'] },
  { id: 'canceled',    x: 560, y: 220, r: 36, label: 'Canceled',    guards: ['Cancellation received', '// CONFIRM: cancel guards'] },
]

const transitions: Transition[] = [
  { from: 'confirmed',  to: 'precheckin', label: 'window opens' },
  { from: 'precheckin', to: 'checkin',    label: 'guest arrives' },
  { from: 'checkin',    to: 'checkout',   label: 'checkout time' },
  { from: 'checkin',    to: 'canceled',   label: 'cancel',   dashed: true },
  { from: 'confirmed',  to: 'canceled',   label: 'cancel',   dashed: true },
]

function sm(states: State[], id: string) { return states.find(s => s.id === id)! }

function transitionPath(a: State, b: State): string {
  const dx = b.x - a.x, dy = b.y - a.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / dist, uy = dy / dist
  const x1 = a.x + ux * a.r, y1 = a.y + uy * a.r
  const x2 = b.x - ux * b.r, y2 = b.y - uy * b.r
  const mx = (x1 + x2) / 2 - uy * 20
  const my = (y1 + y2) / 2 + ux * 20
  return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`
}

export function StateMachineDiagram() {
  const [active, setActive] = useState<string | null>(null)
  const activeState = active ? sm(states, active) : null

  return (
    <figure role="img" aria-labelledby="fsm-title" aria-describedby="fsm-desc">
      <figcaption className="sr-only">
        <span id="fsm-title">Reservation state machine</span>
        <span id="fsm-desc">
          Four-state finite state machine: Confirmed to Pre-Checkin when the check-in
          window opens, to Checkin when the guest arrives, to Checkout when check-out
          time is reached. Both Confirmed and Checkin can transition to Canceled.
        </span>
      </figcaption>

      <div className="fsm-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true"
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
          <defs>
            <marker id="fsm-arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 Z" fill="var(--line-strong)" />
            </marker>
            <marker id="fsm-arr-a" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 Z" fill="var(--accent)" />
            </marker>
            <marker id="fsm-arr-w" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 Z" fill="var(--warn)" />
            </marker>
          </defs>

          {/* Transitions */}
          {transitions.map((t, i) => {
            const a = sm(states, t.from), b = sm(states, t.to)
            const isActive = active === t.from || active === t.to
            const isCancelPath = t.dashed
            const midPath = transitionPath(a, b)
            const color = isCancelPath
              ? (isActive ? 'var(--warn)' : 'var(--line-subtle)')
              : (isActive ? 'var(--accent)' : 'var(--line-strong)')
            const marker = isCancelPath
              ? (isActive ? 'url(#fsm-arr-w)' : 'url(#fsm-arr)')
              : (isActive ? 'url(#fsm-arr-a)' : 'url(#fsm-arr)')
            // label midpoint
            const dx = b.x - a.x, dy = b.y - a.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const lx = (a.x + b.x) / 2 - (dy / dist) * 22
            const ly = (a.y + b.y) / 2 + (dx / dist) * 22
            return (
              <g key={i}>
                <path d={midPath} fill="none"
                  stroke={color} strokeWidth={isActive ? 1.5 : 1}
                  strokeDasharray={t.dashed ? '4 3' : undefined}
                  markerEnd={marker} />
                <text x={lx} y={ly} textAnchor="middle"
                  fill={isCancelPath ? 'var(--warn)' : 'var(--text-secondary)'}
                  fontSize="9" fontFamily="var(--font-mono)">{t.label}</text>
              </g>
            )
          })}

          {/* States */}
          {states.map((s) => {
            const isActive = active === s.id
            const isCanceled = s.id === 'canceled'
            const fill = isActive
              ? (isCanceled ? 'rgba(201,123,123,0.12)' : 'var(--accent-wash)')
              : 'var(--bg-raised)'
            const stroke = isActive
              ? (isCanceled ? 'var(--crit)' : 'var(--accent)')
              : 'var(--line-subtle)'
            return (
              <g key={s.id} tabIndex={0} role="button" aria-label={`State: ${s.label}`}
                onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(s.id)} onBlur={() => setActive(null)}
                style={{ cursor: 'default', outline: 'none' }}>
                <circle cx={s.x} cy={s.y} r={s.r}
                  fill={fill} stroke={stroke} strokeWidth="1" />
                <text x={s.x} y={s.y + 4} textAnchor="middle"
                  fill={isActive ? (isCanceled ? 'var(--crit)' : 'var(--accent)') : 'var(--text-primary)'}
                  fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">{s.label}</text>
              </g>
            )
          })}
        </svg>

        {/* Guard conditions panel */}
        {activeState && (
          <div className="fsm-guards" role="status" aria-live="polite">
            <p className="fsm-guards__title">{activeState.label} — guard conditions</p>
            <ul className="fsm-guards__list">
              {activeState.guards.map((g, i) => (
                <li key={i} className={g.startsWith('//') ? 'fsm-guards__confirm' : ''}>{g}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="diag-outcomes" aria-hidden="true">
        <span className="diag-outcome"><span className="diag-outcome__val">99.8%</span> sync accuracy</span>
        <span className="diag-outcome"><span className="diag-outcome__val">70%</span> fewer redundant API calls</span>
        <span className="diag-outcome"><span className="diag-outcome__val">4</span> states · FSM-enforced</span>
      </div>

      <style>{`
        .fsm-wrap { display: flex; flex-direction: column; gap: var(--space-4); }
        .fsm-guards {
          background: var(--bg-inset);
          border: 1px solid var(--line-subtle);
          border-radius: var(--radius);
          padding: var(--space-4);
        }
        .fsm-guards__title {
          font-size: var(--text-sm);
          font-weight: 600;
          font-family: var(--font-mono);
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }
        .fsm-guards__list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          list-style: disc;
          padding-left: var(--space-4);
        }
        .fsm-guards__list li {
          font-size: var(--text-sm);
          font-family: var(--font-mono);
          color: var(--text-secondary);
        }
        .fsm-guards__confirm {
          color: var(--warn) !important;
        }
      `}</style>
    </figure>
  )
}
