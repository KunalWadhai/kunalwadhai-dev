import { motion } from 'framer-motion'
import { ArrowUpRight, Github, Linkedin, MapPin } from 'lucide-react'
import type { Profile } from '../../features/portfolio/types'

export interface HeroSectionProps {
  readonly data: Profile
  readonly dataState: 'idle' | 'loading' | 'ready' | 'error'
}

export function HeroSection({ data, dataState }: HeroSectionProps) {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__inner">
        {/* Availability badge */}
        <motion.div
          className="hero__badge"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="hero__badge-dot" aria-hidden="true" />
          Open to software engineering opportunities
        </motion.div>

        {/* Name */}
        <motion.h1
          className="hero__name"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          {data.name}
        </motion.h1>

        {/* Title */}
        <motion.p
          className="hero__title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          {data.title}
        </motion.p>

        {/* Bio */}
        <motion.p
          className="hero__bio"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.26 }}
        >
          I build production backend systems, APIs, integrations and infrastructure with TypeScript,
          Node.js and AWS. Currently at{' '}
          <a
            href="https://guestara.com"
            target="_blank"
            rel="noreferrer"
            className="hero__company-link"
          >
            Guestara
          </a>
          , working on PMS integrations, IoT systems and real-time booking sync.
        </motion.p>

        {dataState === 'error' && (
          <p className="hero__notice" role="status">
            Showing cached data — API unreachable.
          </p>
        )}

        {/* CTAs */}
        <motion.div
          className="hero__ctas"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.34 }}
        >
          <a className="btn btn--primary" href="#projects">
            View work
          </a>
          <a
            className="btn btn--ghost"
            href={data.resume.pdfUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Download resume PDF"
          >
            Resume <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="hero__social"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.42 }}
        >
          <a
            href={data.social.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="hero__social-link"
            aria-label="GitHub profile"
          >
            <Github size={16} aria-hidden="true" />
            GitHub
          </a>
          <a
            href={data.social.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="hero__social-link"
            aria-label="LinkedIn profile"
          >
            <Linkedin size={16} aria-hidden="true" />
            LinkedIn
          </a>
        </motion.div>

        {/* Location */}
        <motion.p
          className="hero__location"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <MapPin size={13} aria-hidden="true" />
          India
        </motion.p>
      </div>
    </section>
  )
}
