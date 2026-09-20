import { useCallback, useState } from 'react'

/* ─────────────────────────────────────────────
   Isometric "KW" logo
   • Pure-SVG isometric block letters
   • Follows cursor inside the element (perspective tilt)
   • Plays a short synthetic click on mousedown
   • Respects prefers-reduced-motion
   ───────────────────────────────────────────── */

// ---------------------------------------------------------------------------
// Sound: synthesised via Web Audio — no external file dependency
// ---------------------------------------------------------------------------
function playClickSound() {
  try {
    const ctx = new AudioContext()

    // Short attack, fast decay — like a mechanical key click
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'square'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.06)

    gain.gain.setValueAtTime(0.18, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.09)

    osc.onended = () => ctx.close()
  } catch {
    // AudioContext not available (e.g. SSR / restricted context) — silent fail
  }
}

// ---------------------------------------------------------------------------
// Isometric geometry helpers
// ---------------------------------------------------------------------------
// Standard isometric projection angles
const ISO_ANGLE_X = 30   // degrees from horizontal for side faces
const ISO_ANGLE_Y = 30   // ditto

function degToRad(d: number) { return (d * Math.PI) / 180 }

// Convert a grid cell (col, row) + depth into iso screen coords (px)
// Each cell is UNIT × UNIT; the block has HEIGHT depth.
const UNIT = 10
const HEIGHT = 6

function isoPoint(col: number, row: number, z: number) {
  const cosA = Math.cos(degToRad(ISO_ANGLE_X))
  const sinA = Math.sin(degToRad(ISO_ANGLE_Y))
  const x = (col - row) * UNIT * cosA
  const y = (col + row) * UNIT * sinA - z * HEIGHT
  return { x, y }
}

// Build SVG polygon points string for a face
function polyPoints(pts: { x: number; y: number }[]) {
  return pts.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
}

// Draw one isometric block at grid position (col, row)
// Returns three polygon descriptors: top, left-side, right-side
function block(col: number, row: number, depth = 1) {
  const tl = isoPoint(col,     row,     depth)
  const tr = isoPoint(col + 1, row,     depth)
  const bl = isoPoint(col,     row + 1, depth)
  const br = isoPoint(col + 1, row + 1, depth)
  const tl0 = isoPoint(col,     row,     0)
  const tr0 = isoPoint(col + 1, row,     0)
  const bl0 = isoPoint(col,     row + 1, 0)
  const br0 = isoPoint(col + 1, row + 1, 0)
  return {
    top:   polyPoints([tl, tr, br, bl]),
    left:  polyPoints([tl, bl, bl0, tl0]),
    right: polyPoints([tr, br, br0, tr0]),
  }
}

// ---------------------------------------------------------------------------
// Letter bitmaps: 5×7 grids, 1 = filled block
// Designed to look good at isometric scale
// ---------------------------------------------------------------------------
const LETTER_K: number[][] = [
  [1,0,0,1,0],
  [1,0,1,0,0],
  [1,1,0,0,0],
  [1,1,0,0,0],
  [1,0,1,0,0],
  [1,0,0,1,0],
  [1,0,0,0,1],
]

const LETTER_W: number[][] = [
  [1,0,0,0,1],
  [1,0,0,0,1],
  [1,0,1,0,1],
  [1,0,1,0,1],
  [1,0,1,0,1],
  [1,1,0,1,1],
  [0,1,0,1,0],
]

interface BlockFaces {
  top: string
  left: string
  right: string
  key: string
}

function letterBlocks(bitmap: number[][], colOffset: number): BlockFaces[] {
  const blocks: BlockFaces[] = []
  bitmap.forEach((rowArr, rowIdx) => {
    rowArr.forEach((cell, colIdx) => {
      if (cell) {
        const col = colIdx + colOffset
        const row = rowIdx
        const f = block(col, row)
        blocks.push({ ...f, key: `${col}-${row}` })
      }
    })
  })
  return blocks
}

// ---------------------------------------------------------------------------
// Compute bounding box from all polygon points
// ---------------------------------------------------------------------------
function svgBounds(blocks: BlockFaces[]) {
  const allPts: { x: number; y: number }[] = []
  blocks.forEach(b => {
    [b.top, b.left, b.right].forEach(poly => {
      poly.split(' ').forEach(pt => {
        const [x, y] = pt.split(',').map(Number)
        allPts.push({ x, y })
      })
    })
  })
  const xs = allPts.map(p => p.x)
  const ys = allPts.map(p => p.y)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const maxX = Math.max(...xs)
  const maxY = Math.max(...ys)
  return { minX, minY, width: maxX - minX, height: maxY - minY }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export interface IsometricLogoProps {
  readonly size?: number          // rendered width in px
  readonly onClick?: () => void
  readonly className?: string
}

export function IsometricLogo({ size = 48, onClick, className = '' }: IsometricLogoProps) {
  // Read reducedMotion preference once at mount — stable, won't change during session
  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  // Gap of 1 column between K and W
  const GAP = 1
  const kBlocks = letterBlocks(LETTER_K, 0)
  const wBlocks = letterBlocks(LETTER_W, 5 + GAP)
  const allBlocks = [...kBlocks, ...wBlocks]
  const bounds = svgBounds(allBlocks)

  const PAD = 4
  const vb = `${bounds.minX - PAD} ${bounds.minY - PAD} ${bounds.width + PAD * 2} ${bounds.height + PAD * 2}`
  const aspect = (bounds.width + PAD * 2) / (bounds.height + PAD * 2)

  // Cursor-relative tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)   // -1 to +1
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: dy * -14, y: dx * 14 })
  }, [prefersReduced])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  const handleMouseDown = useCallback(() => {
    playClickSound()
  }, [])

  const handleClick = useCallback(() => {
    onClick?.()
  }, [onClick])

  const transform = prefersReduced
    ? undefined
    : `perspective(300px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`

  return (
    <button
      type="button"
      className={`iso-logo ${className}`}
      aria-label="KW — back to top"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={{
        width: size,
        height: size / aspect,
      }}
    >
      <div
        className="iso-logo__inner"
        style={{
          transform,
          transition: tilt.x === 0 && tilt.y === 0
            ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 0.08s linear',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox={vb}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Render back-to-front: right side first (darkest), then left, then top */}
          {allBlocks.map(b => (
            <polygon
              key={`r-${b.key}`}
              points={b.right}
              className="iso-logo__face iso-logo__face--right"
            />
          ))}
          {allBlocks.map(b => (
            <polygon
              key={`l-${b.key}`}
              points={b.left}
              className="iso-logo__face iso-logo__face--left"
            />
          ))}
          {allBlocks.map(b => (
            <polygon
              key={`t-${b.key}`}
              points={b.top}
              className="iso-logo__face iso-logo__face--top"
            />
          ))}
        </svg>
      </div>
    </button>
  )
}
