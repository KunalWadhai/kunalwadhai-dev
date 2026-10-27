/**
 * Platform map — a compact, interactive view of the production system's layers.
 * Selecting a layer explains its role; the related case study is an explicit next step.
 */

import { useState } from 'react'
import { ArrowDown, ArrowRight, Check, CircleDot } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Layer {
  id: string
  title: string
  role: string
  items: string[]
  caseStudy?: string
}

const layers: Layer[] = [
  {
    id: 'interfaces',
    title: 'Operator experience',
    role: 'The surface where property teams configure and run daily operations.',
    items: ['React operator UI', 'Settings & configuration'],
  },
  {
    id: 'bff',
    title: 'API & BFF',
    role: 'Validates requests and turns operator actions into domain commands.',
    items: ['Express', 'TypeScript', 'Zod', 'Axios', 'AWS Lambda'],
  },
  {
    id: 'services',
    title: 'Domain services',
    role: 'Coordinates the workflows shared across 100+ live properties.',
    items: ['10+ Node.js services', 'Shared schemas & models', 'Sync · inventory · indexing'],
    caseStudy: 'shared-platform-library',
  },
  {
    id: 'integrations',
    title: 'Partner integrations',
    role: 'Connects property systems, access hardware, and payment providers.',
    items: ['Mews · Beds24 · Bifrost · DeathStar', 'Tuya · Seam · Mosler', 'Payments'],
    caseStudy: 'smart-lock-provisioning',
  },
  {
    id: 'data',
    title: 'State & search',
    role: 'Keeps reservations, operational state, and searchable records available.',
    items: ['MongoDB', 'Redis', 'OpenSearch'],
    caseStudy: 'reservation-state-machine',
  },
  {
    id: 'ops',
    title: 'Runtime & reliability',
    role: 'Runs asynchronous work and surfaces failures before they become incidents.',
    items: ['Lambda · SQS · EC2', 'BullMQ', 'CloudWatch · Teams alerts'],
    caseStudy: 'service-health-tracing',
  },
]

export function PlatformMap() {
  const [activeLayerId, setActiveLayerId] = useState('services')
  const activeLayer = layers.find((layer) => layer.id === activeLayerId) ?? layers[0]

  return (
    <section className="platform-map" aria-labelledby="platform-map-title">
      <div className="platform-map__topline">
        <div>
          <p className="platform-map__eyebrow">SYSTEM OVERVIEW <span>·</span> GUESTARA</p>
          <h2 id="platform-map-title" className="platform-map__heading">Production platform</h2>
        </div>
        <span className="platform-map__status"><i /> LIVE SYSTEMS</span>
      </div>

      <p className="platform-map__intro">A request flows from operator action through domain services to partner systems and durable state.</p>

      <ol className="platform-map__flow" aria-label="Platform layers, top to bottom">
        {layers.map((layer, index) => {
          const selected = activeLayerId === layer.id
          return (
            <li className="platform-map__step" key={layer.id}>
              <div className="platform-map__rail" aria-hidden="true">
                <span className="platform-map__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="platform-map__node">{selected ? <Check size={11} /> : <CircleDot size={11} />}</span>
                {index < layers.length - 1 && <span className="platform-map__connector"><ArrowDown size={11} /></span>}
              </div>

              <button
                type="button"
                className={`platform-map__layer${selected ? ' is-active' : ''}`}
                onClick={() => setActiveLayerId(layer.id)}
                aria-pressed={selected}
              >
                <span className="platform-map__layer-head">
                  <span className="platform-map__layer-title">{layer.title}</span>
                  <span className="platform-map__layer-count">{String(layer.items.length).padStart(2, '0')} components</span>
                </span>
                <span className="platform-map__layer-items">
                  {layer.items.map((item) => <span className="platform-map__item" key={item}>{item}</span>)}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <div className="platform-map__detail" aria-live="polite">
        <div className="platform-map__detail-copy">
          <span className="platform-map__detail-label">{activeLayer.title}</span>
          <p>{activeLayer.role}</p>
        </div>
        {activeLayer.caseStudy && (
          <Link className="platform-map__case-link" to={`/work/${activeLayer.caseStudy}`} aria-label={`Read the ${activeLayer.title} case study`}>
            Case study <ArrowRight size={14} aria-hidden="true" />
          </Link>
        )}
      </div>

      <style>{`
        .platform-map {
          --map-red: #cf6969;
          position: relative;
          overflow: hidden;
          padding: clamp(18px, 2.1vw, 28px);
          border: 1px solid var(--line-subtle);
          border-radius: var(--radius-md);
          background:
            radial-gradient(ellipse at 95% 0%, rgba(207, 105, 105, 0.09), transparent 42%),
            linear-gradient(145deg, var(--bg-raised), var(--bg-inset) 76%);
          box-shadow: var(--shine-top), 0 18px 50px rgba(0, 0, 0, 0.16);
        }

        .platform-map__topline {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .platform-map__eyebrow,
        .platform-map__detail-label {
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .platform-map__eyebrow span { color: var(--map-red); }

        .platform-map__heading {
          margin-top: 6px;
          color: var(--text-primary);
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 600;
          letter-spacing: -0.035em;
        }

        .platform-map__status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          flex: 0 0 auto;
          padding: 6px 9px;
          border: 1px solid var(--line-subtle);
          border-radius: 999px;
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.045em;
        }

        .platform-map__status i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #62bd89;
          box-shadow: 0 0 9px rgba(98, 189, 137, 0.5);
        }

        .platform-map__intro {
          max-width: 46ch;
          margin: 13px 0 17px;
          color: var(--text-secondary);
          font-size: var(--text-xs);
          line-height: 1.5;
        }

        .platform-map__flow {
          display: flex;
          flex-direction: column;
          gap: 5px;
          list-style: none;
        }

        .platform-map__step {
          display: grid;
          grid-template-columns: 36px minmax(0, 1fr);
          gap: 8px;
          min-width: 0;
          animation: map-step-in 360ms var(--ease-out) both;
          animation-delay: calc(var(--step, 0) * 45ms);
        }

        .platform-map__step:nth-child(1) { --step: 0; }
        .platform-map__step:nth-child(2) { --step: 1; }
        .platform-map__step:nth-child(3) { --step: 2; }
        .platform-map__step:nth-child(4) { --step: 3; }
        .platform-map__step:nth-child(5) { --step: 4; }
        .platform-map__step:nth-child(6) { --step: 5; }

        @keyframes map-step-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .platform-map__rail {
          position: relative;
          display: flex;
          align-items: center;
          flex-direction: column;
          color: var(--text-muted);
        }

        .platform-map__index {
          padding-top: 10px;
          font-family: var(--font-mono);
          font-size: 9px;
          font-variant-numeric: tabular-nums;
        }

        .platform-map__node {
          display: grid;
          width: 23px;
          height: 23px;
          margin-top: 4px;
          place-items: center;
          border: 1px solid var(--line-strong);
          border-radius: 50%;
          background: var(--bg-inset);
          color: var(--text-muted);
          transition: color 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        }

        .platform-map__connector {
          display: grid;
          flex: 1;
          min-height: 18px;
          place-items: center;
          color: var(--line-strong);
        }

        .platform-map__layer {
          display: block;
          width: 100%;
          min-width: 0;
          padding: 10px 12px 11px;
          border: 1px solid var(--line-subtle);
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.018);
          color: var(--text-primary);
          text-align: left;
          cursor: pointer;
          transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .platform-map__layer:hover,
        .platform-map__layer:focus-visible {
          border-color: var(--line-strong);
          background: rgba(255, 255, 255, 0.04);
        }

        .platform-map__layer.is-active {
          border-color: rgba(207, 105, 105, 0.55);
          background: linear-gradient(100deg, rgba(207, 105, 105, 0.11), rgba(255, 255, 255, 0.025));
          box-shadow: inset 2px 0 var(--map-red), 0 5px 18px rgba(0, 0, 0, 0.1);
          transform: translateX(2px);
        }

        .platform-map__layer.is-active ~ * { color: var(--text-primary); }

        .platform-map__layer-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 7px;
        }

        .platform-map__layer-title {
          color: var(--text-primary);
          font-size: var(--text-xs);
          font-weight: 600;
          letter-spacing: 0.015em;
        }

        .platform-map__layer-count {
          flex: 0 0 auto;
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 9px;
        }

        .platform-map__layer-items {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .platform-map__item {
          display: inline-flex;
          max-width: 100%;
          padding: 4px 7px;
          border: 1px solid rgba(174, 183, 197, 0.12);
          border-radius: 4px;
          background: rgba(174, 183, 197, 0.045);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 10px;
          line-height: 1.35;
          overflow-wrap: anywhere;
        }

        .platform-map__detail {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 16px 0 0 44px;
          padding-top: 13px;
          border-top: 1px solid var(--line-subtle);
        }

        .platform-map__detail-copy { min-width: 0; }

        .platform-map__detail-copy p {
          margin-top: 4px;
          color: var(--text-secondary);
          font-size: 11px;
          line-height: 1.45;
        }

        .platform-map__case-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          flex: 0 0 auto;
          color: var(--text-primary);
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .platform-map__case-link:hover { color: var(--map-red); }

        @media (max-width: 640px) {
          .platform-map { padding: 16px; }
          .platform-map__status { padding-inline: 7px; font-size: 8px; }
          .platform-map__layer { padding: 9px 10px; }
          .platform-map__detail { align-items: flex-start; margin-left: 0; }
          .platform-map__case-link { margin-top: 2px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .platform-map__step { animation: none; }
          .platform-map__layer,
          .platform-map__node { transition: none; }
        }
      `}</style>
    </section>
  )
}
