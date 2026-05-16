import { useEffect, useRef, useState, useCallback, lazy, Suspense, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, ExternalLink, ChevronUp, Send, ArrowUpRight } from 'lucide-react'
import { usePortfolioData } from './hooks'
import {
  NAV_ITEMS, SKILLS_DATA, LEARNING_ITEMS, TESTIMONIALS,
  TERMINAL_LINES, STAT_ITEMS, ABOUT_JSON, PROJECT_ARCH,
} from './constants'
import { normalizeUrl, formatMonthYear } from './utils'
import './portfolio.css'

const AIChatWidget = lazy(() =>
  import('../../components/AIChatWidget').then(m => ({ default: m.AIChatWidget }))
)

/* ═══ REVEAL ON SCROLL ═══ */
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target) } },
      { threshold: 0.1, rootMargin: '0px 0px -4% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

/* ═══ ANIMATED COUNTER ═══ */
function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState('0')
  const counted = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true
        const numMatch = value.match(/^(\d+)/)
        if (!numMatch) { setDisplay(value); return }
        const target = parseInt(numMatch[1])
        const suffix = value.slice(numMatch[1].length)
        const duration = 1200
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(Math.floor(eased * target) + suffix)
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [value])

  return <span ref={ref} className="stat-tile__value">{display}</span>
}

/* ═══ TERMINAL ═══ */
function Terminal() {
  const [visibleLines, setVisibleLines] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        TERMINAL_LINES.forEach((line, i) => {
          setTimeout(() => setVisibleLines(i + 1), line.delay)
        })
      }
    }, { threshold: 0.3 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="terminal" role="img" aria-label="Animated server terminal output">
      <div className="terminal__bar">
        <span className="terminal__dot" /><span className="terminal__dot" /><span className="terminal__dot" />
        <span className="terminal__title">~/kunal/server</span>
      </div>
      <div className="terminal__body">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={`terminal__line terminal__line--${line.type}`}
            style={{ animationDelay: `${i * 0.05}s` }}>
            {line.text}
          </div>
        ))}
        {visibleLines >= TERMINAL_LINES.length && <span className="terminal__cursor" />}
      </div>
    </div>
  )
}

/* ═══ ARCHITECTURE DIAGRAM ═══ */
function ArchitectureDiagram({ projectName }: { projectName: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const arch = PROJECT_ARCH[projectName]

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target) } },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (!arch) return null

  const nodeMap = Object.fromEntries(arch.nodes.map(n => [n.id, n]))
  const highlightIds = new Set(['ai', 'data', 'db'])

  return (
    <div ref={ref} className="arch" role="img" aria-label={`${projectName} system architecture diagram`}>
      <svg className="arch__svg" preserveAspectRatio="none">
        {visible && arch.edges.map((edge, i) => {
          const from = nodeMap[edge.from]
          const to = nodeMap[edge.to]
          if (!from || !to) return null
          return (
            <line key={i} className="arch__edge"
              x1={`${from.x}%`} y1={`${from.y}%`}
              x2={`${to.x}%`} y2={`${to.y}%`}
              style={{ animationDelay: `${i * 2}s` }}
            />
          )
        })}
      </svg>

      {arch.nodes.map((node, i) => (
        <motion.div key={node.id}
          className={`arch__node ${highlightIds.has(node.id) ? 'arch__node--highlight' : ''}`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, delay: 0.15 * i, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="arch__node-label">{node.label}</div>
          <div className="arch__node-sub">{node.sub}</div>
        </motion.div>
      ))}
    </div>
  )
}

/* ═══ MAIN PAGE ═══ */
export default function PortfolioPage() {
  const { data, state } = usePortfolioData()
  const cursorRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formSending, setFormSending] = useState(false)
  const [expandedArch, setExpandedArch] = useState<Set<string>>(new Set())

  const toggleArch = useCallback((name: string) => {
    setExpandedArch(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  // ── Cursor: ref-based (no re-renders) ──
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (prefersReducedMotion || isTouch) return

    const onMove = (e: MouseEvent) => {
      const cx = e.clientX
      const cy = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cx - 12}px, ${cy - 12}px, 0)`
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${cx - 300}px, ${cy - 300}px, 0)`
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── Cursor hover class via delegation ──
  useEffect(() => {
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement
      if (t.closest('a, button, input, textarea, [data-hover]')) {
        cursorRef.current?.classList.add('custom-cursor--hover')
      }
    }
    const onOut = () => cursorRef.current?.classList.remove('custom-cursor--hover')

    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  // ── Scroll tracking ──
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40)
        const sections = NAV_ITEMS.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
        for (let i = sections.length - 1; i >= 0; i--) {
          if (sections[i].getBoundingClientRect().top <= 150) {
            setActiveSection(NAV_ITEMS[i].id); ticking = false; return
          }
        }
        setActiveSection('')
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return
    setFormSending(true)
    await new Promise(r => setTimeout(r, 1500))
    setFormSending(false)
    setFormData({ name: '', email: '', message: '' })
  }

  const heroWords = "I build systems that don't break.".split(' ')

  return (
    <>
      {/* ── Background layers ── */}
      <div className="dot-grid" aria-hidden="true" />
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />

      <a className="skip-link" href="#about">Skip to content</a>

      {/* ── NAV ── */}
      <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`} aria-label="Main navigation">
        <div className="nav__inner">
          <a href="#" className="nav__brand" onClick={(e) => { e.preventDefault(); scrollToTop() }}>
            {data.name}
          </a>
          <div className="nav__links">
            {NAV_ITEMS.map(item => (
              <a key={item.id} href={`#${item.id}`}
                className={`nav__link ${activeSection === item.id ? 'nav__link--active' : ''}`}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main>
        {/* ═══ HERO ═══ */}
        <section className="hero" aria-label="Introduction">
          <div className="hero__content">
            <motion.p className="hero__label"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}>
              {'// backend engineer · guestara'}
            </motion.p>

            <h1 className="hero__title">
              {heroWords.map((word, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}>
                  {word}{i < heroWords.length - 1 ? '\u00A0' : ''}
                </motion.span>
              ))}
            </h1>

            <motion.p className="hero__sub"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}>
              {data.bio || 'Specializing in distributed architecture, high-throughput APIs, and the invisible infrastructure behind great products.'}
            </motion.p>

            {state === 'error' && (
              <p style={{ fontSize: 13, color: 'var(--amber)', marginTop: 4 }}>Showing cached profile data.</p>
            )}

            <motion.div className="hero__ctas"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}>
              <a className="btn btn--ghost" href="#projects">View Work</a>
              <a className="btn btn--text" href={data.resume.pdfUrl} target="_blank" rel="noreferrer">
                Download Resume <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}>
            <Terminal />
          </motion.div>
        </section>

        {/* ═══ ABOUT ═══ */}
        <section id="about" className="section">
          <Reveal><p className="section__label">{'// about'}</p></Reveal>
          <Reveal delay={0.08}><h2 className="section__title">Who I am</h2></Reveal>

          <div className="about__grid">
            <Reveal delay={0.16}>
              <div className="about__json">
                <div className="json-bracket">{'{'}</div>
                {Object.entries(ABOUT_JSON).map(([key, val]) => (
                  <div key={key} style={{ paddingLeft: 20 }}>
                    <span className="json-key">&quot;{key}&quot;</span>
                    <span className="json-bracket">: </span>
                    {Array.isArray(val) ? (
                      <span className="json-value">[{val.map((v, i) => <span key={i} className="json-str">&quot;{v}&quot;{i < val.length - 1 ? ', ' : ''}</span>)}]</span>
                    ) : (
                      <span className="json-str">&quot;{val}&quot;</span>
                    )}
                    <span className="json-bracket">,</span>
                  </div>
                ))}
                <div className="json-bracket">{'}'}</div>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="about__bio">
                <p><strong>I care about systems that work when nobody&apos;s watching.</strong> My days are spent designing APIs that handle thousands of concurrent requests, building real-time data pipelines, and ensuring that distributed services fail gracefully.</p>
                <p>At Guestara, I own the PMS integration layer — syncing bookings, rooms, and guest data across multiple property management systems in real time. Before that, I worked on embedded firmware at Zoho, building custom Linux images and board-level automation.</p>
                <p><strong>I believe great backend engineering is invisible.</strong> When everything works seamlessly for the end user, that&apos;s when I know I&apos;ve done my job right.</p>
              </div>
            </Reveal>
          </div>

          <div className="about__stats">
            {STAT_ITEMS.map((stat, i) => (
              <Reveal key={stat.label} delay={0.1 * i} className="stat-tile">
                {stat.value === '∞' ? (
                  <span className="stat-tile__value">{stat.value}</span>
                ) : (
                  <AnimatedCounter value={stat.value} />
                )}
                <span className="stat-tile__label">{stat.label}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══ EXPERIENCE ═══ */}
        <section id="experience" className="section">
          <Reveal><p className="section__label">{'// experience'}</p></Reveal>
          <Reveal delay={0.08}><h2 className="section__title">Where I&apos;ve worked</h2></Reveal>

          <div className="timeline">
            {data.experience.map((exp, idx) => {
              const isCurrent = !exp.end || exp.end === 'Present'
              return (
                <Reveal key={`${exp.company}-${exp.role}`} delay={0.1 * idx} className="timeline__item">
                  <div className={`timeline__node ${isCurrent ? 'timeline__node--current' : ''}`} />
                  <div className={`exp-card ${isCurrent ? 'exp-card--current' : ''}`}>
                    <div className="exp-card__header">
                      <span className="exp-card__company">{exp.company}</span>
                      {isCurrent && <span className="exp-card__badge">Current</span>}
                    </div>
                    <div className="exp-card__role">{exp.role}</div>
                    <div className="exp-card__date">{formatMonthYear(exp.start)} — {formatMonthYear(exp.end)}</div>
                    {exp.achievements.map(ach => (
                      <ul key={ach.title} className="exp-card__points">
                        {ach.points.map(point => <li key={point}>{point}</li>)}
                      </ul>
                    ))}
                    <div className="exp-card__tech">
                      {exp.technologies.map(tech => <span key={tech}>{tech}</span>)}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* ═══ PROJECTS ═══ */}
        <section id="projects" className="section">
          <Reveal><p className="section__label">{'// projects'}</p></Reveal>
          <Reveal delay={0.08}><h2 className="section__title">What I&apos;ve built</h2></Reveal>

          <div className="bento">
            {data.projects.map((project, i) => {
              const hasArch = !!PROJECT_ARCH[project.name]
              const isExpanded = expandedArch.has(project.name)
              return (
                <Reveal key={project.name} delay={0.1 * i}
                  className={`bento__card ${hasArch ? 'bento__card--featured' : 'bento__card--sm'}`}>
                  <div className="bento__name">
                    {project.name}
                    <span className="bento__badge">{i === 0 ? 'Featured' : 'Project'}</span>
                  </div>
                  <p className="bento__desc">{project.description}</p>
                  <div className="bento__pills">
                    {project.technologies.map(tech => (
                      <span key={tech} className="bento__pill">{tech}</span>
                    ))}
                  </div>

                  <div className="bento__links">
                    {hasArch && (
                      <button className="bento__link bento__arch-toggle" onClick={() => toggleArch(project.name)}
                        aria-expanded={isExpanded} aria-label={`${isExpanded ? 'Hide' : 'View'} architecture`}>
                        <ArrowUpRight size={14} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
                        {isExpanded ? 'Hide Architecture' : 'View Architecture'}
                      </button>
                    )}
                    {project.githubUrl && (
                      <a className="bento__link" href={normalizeUrl(project.githubUrl)}
                        target="_blank" rel="noreferrer" aria-label={`${project.name} source`}>
                        <Github size={14} /> Source
                      </a>
                    )}
                    {project.url && (
                      <a className="bento__link" href={normalizeUrl(project.url)}
                        target="_blank" rel="noreferrer" aria-label={`${project.name} live`}>
                        <ExternalLink size={14} /> Live
                      </a>
                    )}
                  </div>

                  {/* Architecture diagram — toggle reveal */}
                  <AnimatePresence>
                    {hasArch && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <ArchitectureDiagram projectName={project.name} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* ═══ SKILLS ═══ */}
        <section id="skills" className="section">
          <Reveal><p className="section__label">{'// skills'}</p></Reveal>
          <Reveal delay={0.08}><h2 className="section__title">What I work with</h2></Reveal>

          <div className="skills-grid">
            {Object.entries(SKILLS_DATA).map(([category, skills], ci) => (
              <Reveal key={category} delay={0.1 * ci}>
                <div className="skills-col__title">{category}</div>
                <div className="skills-col__items">
                  {skills.map(skill => (
                    <div key={skill.name} className="skill-item" data-hover>
                      <span className="skill-item__name">{skill.name}</span>
                      <div className="skill-item__bar" aria-label={`Proficiency: ${skill.level} of 3`}>
                        {[1, 2, 3].map(l => (
                          <span key={l} className={l <= skill.level ? 'filled' : ''} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <div className="skills-learning">
              <div className="skills-learning__title">Currently Learning <span className="typing-cursor" /></div>
              <div className="skills-learning__items">
                {LEARNING_ITEMS.map(item => (
                  <span key={item} className="skills-learning__item">{item}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="section">
          <Reveal><p className="section__label">{'// testimonials'}</p></Reveal>
          <Reveal delay={0.08}><h2 className="section__title">What people say</h2></Reveal>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.author} delay={0.1 * i} className="testimonial">
                <div className="testimonial__mark" aria-hidden="true">&ldquo;</div>
                <p className="testimonial__text">{t.quote}</p>
                <p className="testimonial__author">{t.author} &middot; {t.org}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══ CONTACT ═══ */}
        <section id="contact" className="section">
          <Reveal><p className="section__label">{'// contact'}</p></Reveal>
          <Reveal delay={0.08}><h2 className="section__title">Let&apos;s talk</h2></Reveal>

          <Reveal delay={0.12}>
            <p className="contact__intro">
              Whether you&apos;re building something ambitious or just want to talk architecture — my inbox is always open.
            </p>
          </Reveal>

          <div className="contact-grid">
            <Reveal delay={0.16}>
              <form className="contact__form" onSubmit={handleFormSubmit}>
                <input className="contact__input" placeholder="Name" required aria-label="Your name"
                  value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                <input className="contact__input" type="email" placeholder="Email" required aria-label="Your email"
                  value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                <textarea className="contact__input contact__textarea" placeholder="Message" required rows={5} aria-label="Your message"
                  value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} />
                <button type="submit" className="btn btn--ghost contact__submit" disabled={formSending}>
                  {formSending ? (
                    <span className="dot-loader"><span /><span /><span /></span>
                  ) : (
                    <>Send it <Send size={14} /></>
                  )}
                </button>
              </form>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="contact__socials">
                <a className="contact-social" href={normalizeUrl(data.social.githubUrl)} target="_blank" rel="noreferrer" aria-label="GitHub profile">
                  <Github size={20} className="contact-social__icon" />
                  <div className="contact-social__info">
                    <span className="contact-social__platform">GitHub</span>
                    <span className="contact-social__handle">@{data.social.githubHandle || 'KunalWadhai'}</span>
                  </div>
                </a>
                <a className="contact-social" href={normalizeUrl(data.social.linkedinUrl)} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
                  <Linkedin size={20} className="contact-social__icon" />
                  <div className="contact-social__info">
                    <span className="contact-social__platform">LinkedIn</span>
                    <span className="contact-social__handle">/kunal-wadhai</span>
                  </div>
                </a>
                <a className="contact-social" href={normalizeUrl(data.social.xUrl)} target="_blank" rel="noreferrer" aria-label="X / Twitter profile">
                  <Twitter size={20} className="contact-social__icon" />
                  <div className="contact-social__info">
                    <span className="contact-social__platform">X / Twitter</span>
                    <span className="contact-social__handle">@AloneWarrior27</span>
                  </div>
                </a>
                <a className="contact-social" href={`mailto:${data.social.email}`} aria-label="Send email">
                  <Mail size={20} className="contact-social__icon" />
                  <div className="contact-social__info">
                    <span className="contact-social__platform">Email</span>
                    <span className="contact-social__handle">{data.social.email}</span>
                  </div>
                </a>

                <div className="contact__status">
                  <span className="contact__status-dot" aria-hidden="true" />
                  Available for freelance
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <span className="footer__wordmark">Kunal Wadhai</span>
        <button className="footer__top" onClick={scrollToTop} aria-label="Back to top">
          <ChevronUp size={18} />
        </button>
      </footer>

      {/* ═══ AI CHAT (lazy loaded) ═══ */}
      <Suspense fallback={null}>
        <AIChatWidget />
      </Suspense>
    </>
  )
}
