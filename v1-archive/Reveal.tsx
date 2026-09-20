import { useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../../hooks/useInView'

export interface RevealProps {
  readonly children: ReactNode
  readonly delay?: number
  readonly className?: string
}

export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { threshold: 0.12, once: true })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
