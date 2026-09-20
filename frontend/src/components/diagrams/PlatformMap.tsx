/**
 * Platform Map — Interactive 6-layer system diagram
 * The single memorable moment: draws in top-to-bottom on load (900ms), then still
 * Hover/focus on layer highlights related tech and jumps to case studies
 */

import { useState, useEffect } from 'react'

interface Layer {
  id: string
  title: string
  items: string[]
  caseStudy?: string
}

const layers: Layer[] = [
  {
    id: 'interfaces',
    title: 'INTERFACES',
    items: ['React operator UI', '// CONFIRM: Settings page scope'],
    caseStudy: '#work',
  },
  {
    id: 'bff',
    title: 'API / BFF LAYER',
    items: ['// CONFIRM: Express · TypeScript · Zod · Axios · AWS Lambda'],
    caseStudy: '#work',
  },
  {
    id: 'services',
    title: 'DOMAIN SERVICES',
    items: [
      '10+ Node services',
      'Shared package library (schemas, utils, models)',
      'Orchestration service (metadata, sync, inventory, indexing)',
    ],
    caseStudy: 'shared-platform-library',
  },
  {
    id: 'integrations',
    title: 'INTEGRATIONS',
    items: [
      'PMS: Mews · Beds24 · Bifrost · DeathStar',
      'Locks: Tuya · Seam · Mosler',
      'Payments',
    ],
    caseStudy: 'smart-lock-provisioning',
  },
  {
    id: 'data',
    title: 'DATA LAYER',
    items: ['MongoDB', 'Redis', 'OpenSearch'],
    caseStudy: 'reservation-state-machine',
  },
  {
    id: 'ops',
    title: 'RUNTIME & OPS',
    items: ['AWS Lambda · SQS · EC2', 'BullMQ', 'CloudWatch · Teams alerts'],
    caseStudy: 'service-health-tracing',
  },
]

export function PlatformMap() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    // Draw in layers top-to-bottom on mount
    const timer = setTimeout(() => setDrawn(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleLayerClick = (layer: Layer) => {
    if (layer.caseStudy) {
      const target = layer.caseStudy.startsWith('#')
        ? layer.caseStudy
        : `#work` // All case studies are in the work section for now
      window.location.hash = target
    }
  }

  return (
    <div className="platform-map" role="img" aria-label="System architecture: 6-layer platform map">
      {/* Fine 16px sub-grid behind map */}
      <div className="platform-map__fine-grid" aria-hidden="true" />

      <div className="platform-map__layers">
        {layers.map((layer, i) => (
          <button
            key={layer.id}
            type="button"
            className={`platform-map__layer ${activeLayer === layer.id ? 'platform-map__layer--active' : ''} ${drawn ? 'platform-map__layer--drawn' : ''}`}
            style={{ '--layer-index': i } as React.CSSProperties}
            onMouseEnter={() => setActiveLayer(layer.id)}
            onMouseLeave={() => setActiveLayer(null)}
            onFocus={() => setActiveLayer(layer.id)}
            onBlur={() => setActiveLayer(null)}
            onClick={() => handleLayerClick(layer)}
            aria-label={`${layer.title}: ${layer.items.join(', ')}`}
          >
            <div className="platform-map__layer-title">{layer.title}</div>
            <div className="platform-map__layer-items">
              {layer.items.map((item, j) => (
                <div key={j} className="platform-map__layer-item">
                  {item}
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Visually hidden ordered list for screen readers */}
      <ol className="sr-only">
        <li>Interfaces: React operator UI</li>
        <li>API/BFF Layer: Express, TypeScript, Zod, Axios, AWS Lambda</li>
        <li>Domain Services: 10+ Node services, shared package library, orchestration service</li>
        <li>Integrations: PMS (Mews, Beds24, Bifrost, DeathStar), Locks (Tuya, Seam, Mosler), Payments</li>
        <li>Data Layer: MongoDB, Redis, OpenSearch</li>
        <li>Runtime & Ops: AWS Lambda, SQS, EC2, BullMQ, CloudWatch, Teams alerts</li>
      </ol>

      <style>{`
        .platform-map {
          position: relative;
          background: var(--bg-inset);
          border: 1px solid var(--line-faint);
          border-radius: var(--radius);
          padding: var(--space-6);
          min-height: 400px;
        }

        /* Fine 16px sub-grid (half opacity of main page grid) */
        .platform-map__fine-grid {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(to right, var(--line-faint) 1px, transparent 1px),
            linear-gradient(to bottom, var(--line-faint) 1px, transparent 1px);
          background-size: 16px 16px;
          opacity: 0.5;
          border-radius: var(--radius);
        }

        @media (prefers-reduced-motion: reduce) {
          .platform-map__fine-grid {
            opacity: 0.3;
          }
        }

        .platform-map__layers {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .platform-map__layer {
          width: 100%;
          text-align: left;
          background: var(--bg-raised);
          border: 1px solid var(--line-subtle);
          padding: var(--space-4);
          cursor: pointer;
          transition:
            border-color var(--dur-base) var(--ease-out),
            background var(--dur-base) var(--ease-out),
            opacity var(--dur-base) var(--ease-out),
            transform var(--dur-base) var(--ease-out);
          
          /* Draw-in animation (top to bottom) */
          opacity: 0;
          transform: translateY(-8px);
        }

        .platform-map__layer--drawn {
          opacity: 1;
          transform: translateY(0);
          animation: layer-draw-in 0.4s var(--ease-out) forwards;
          animation-delay: calc(var(--layer-index) * 0.15s);
        }

        @keyframes layer-draw-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .platform-map__layer {
            animation: none;
            opacity: 1;
            transform: none;
          }
          .platform-map__layer--drawn {
            animation: none;
          }
        }

        .platform-map__layer:hover,
        .platform-map__layer:focus-visible {
          border-color: var(--accent);
          background: var(--accent-wash);
        }

        .platform-map__layer--active {
          border-color: var(--accent);
          background: var(--accent-wash);
        }

        .platform-map__layer-title {
          font-size: var(--text-xs);
          font-weight: 600;
          font-family: var(--font-mono);
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          margin-bottom: var(--space-2);
        }

        .platform-map__layer-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .platform-map__layer-item {
          font-size: var(--text-sm);
          font-family: var(--font-mono);
          color: var(--text-primary);
          line-height: 1.4;
        }

        /* Mobile: simplify layout */
        @media (max-width: 640px) {
          .platform-map {
            padding: var(--space-4);
            min-height: 300px;
          }

          .platform-map__layer {
            padding: var(--space-3);
          }

          .platform-map__layer-title {
            font-size: 10px;
          }

          .platform-map__layer-item {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  )
}
