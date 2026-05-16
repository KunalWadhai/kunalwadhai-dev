import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export function FadeIn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
