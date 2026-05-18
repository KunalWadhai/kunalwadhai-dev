import { motion } from 'framer-motion'
import { ArrowUpRight, Download } from 'lucide-react'
import type { Profile } from '../../features/portfolio/types'
import { Terminal } from './Terminal'

export interface HeroSectionProps {
  readonly data: Profile
  readonly dataState: 'idle' | 'loading' | 'ready' | 'error'
}

const HERO_WORDS = ['Systems', 'that', 'scale.', 'Ship', 'with', 'confidence.']

export function HeroSection({ data, dataState }: HeroSectionProps) {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__grid">
        <div className="hero__content">
          <motion.div
            className="hero__pill"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="hero__pill-dot" aria-hidden="true" />
            Available for freelance · Backend Engineer
          </motion.div>

          <motion.p
            className="hero__eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {data.title} · Guestara
          </motion.p>

          <h1 className="hero__title">
            {HERO_WORDS.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            {data.bio ||
              'Distributed architecture, high-throughput APIs, and production systems that stay calm under load.'}
          </motion.p>

          {dataState === 'error' && (
            <p className="hero__notice">Showing cached profile — API unreachable.</p>
          )}

          <motion.div
            className="hero__ctas"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.95 }}
          >
            <a className="btn btn--primary" href="#projects" data-hover>
              View selected work
            </a>
            <a
              className="btn btn--ghost"
              href={data.resume.pdfUrl}
              target="_blank"
              rel="noreferrer"
              data-hover
            >
              <Download size={16} />
              Resume
              <ArrowUpRight size={14} />
            </a>
          </motion.div>

          <motion.ul
            className="hero__metrics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <li>
              <strong>99.98%</strong>
              <span>uptime mindset</span>
            </li>
            <li>
              <strong>&lt;15ms</strong>
              <span>p95 API targets</span>
            </li>
            <li>
              <strong>24/7</strong>
              <span>on-call ready</span>
            </li>
          </motion.ul>
        </div>

        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, x: 40, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Terminal />
        </motion.div>
      </div>
    </section>
  )
}
