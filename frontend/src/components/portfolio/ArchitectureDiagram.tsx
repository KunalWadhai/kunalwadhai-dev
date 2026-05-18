import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { PROJECT_ARCH } from '../../features/portfolio/constants'

export interface ArchitectureDiagramProps {
  readonly projectName: string
}

export function ArchitectureDiagram({ projectName }: ArchitectureDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const arch = PROJECT_ARCH[projectName]

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (!arch) return null

  const nodeMap = Object.fromEntries(arch.nodes.map((n) => [n.id, n]))
  const highlightIds = new Set(['ai', 'data', 'db', 'gateway'])

  return (
    <div ref={ref} className="arch" role="img" aria-label={`${projectName} system architecture diagram`}>
      <svg className="arch__svg" preserveAspectRatio="none">
        {visible &&
          arch.edges.map((edge, i) => {
            const from = nodeMap[edge.from]
            const to = nodeMap[edge.to]
            if (!from || !to) return null
            return (
              <line
                key={i}
                className="arch__edge"
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                style={{ animationDelay: `${i * 2}s` }}
              />
            )
          })}
      </svg>

      {arch.nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className={`arch__node ${highlightIds.has(node.id) ? 'arch__node--highlight' : ''}`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.45, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="arch__node-label">{node.label}</div>
          <div className="arch__node-sub">{node.sub}</div>
        </motion.div>
      ))}
    </div>
  )
}
