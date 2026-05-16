import {
  Github,
  Linkedin,
  Mail,
  Send,
  TerminalSquare,
  Twitter,
  Copy,
  Check,
  Moon,
  Sun,
  RefreshCw,
  ChevronDown,
  ArrowUpRight,
  Pin,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AssistantPanel, FadeIn, LogoBadge, Section } from './components'
import { NAV_ITEMS, READINESS_AREAS, TESTIMONIALS } from './constants'
import { usePortfolioData } from './hooks'
import { formatMonthYear, normalizeUrl } from './utils'
import guestaraLogo from '../../assets/WhiteBG_GuestaraLogo.png'
import zohoLogo from '../../assets/zoho-logo-darkbg.svg'
import './portfolio.css'

export default function PortfolioPage() {
  const {
    data,
    githubSummary,
    githubHandle,
    codingStats,
    codingState,
    state,
  } = usePortfolioData()
  const [copied, setCopied] = useState(false)
  const [githubImagesLoaded, setGithubImagesLoaded] = useState({ summary: false, streak: false })
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = window.localStorage.getItem('portfolio-theme')
    return stored === 'light' || stored === 'dark' ? stored : 'dark'
  })
  const leetcodeStats = codingStats?.leetcode
  const expLogoMap: Record<string, string> = {
    Zoho: zohoLogo,
    Guestara: guestaraLogo,
  }
  const calendarCells = useMemo(() => {
    const raw = leetcodeStats?.calendar?.submissionCalendar
    if (!raw) return [] as number[]
    try {
      const map = JSON.parse(raw) as Record<string, number>
      const keys = Object.keys(map).map((key) => Number(key))
      const end = keys.length ? Math.max(...keys) : null
      if (!end) return [] as number[]
      const days = 56
      const cells: number[] = []
      for (let i = days - 1; i >= 0; i -= 1) {
        const ts = end - i * 86400
        const dayKey = Math.floor(ts / 86400) * 86400
        cells.push(Number(map[dayKey] ?? 0))
      }
      return cells
    } catch {
      return [] as number[]
    }
  }, [leetcodeStats?.calendar?.submissionCalendar])
  const metrics = useMemo(() => {
    const projectCount = data.projects.length
    const expCount = data.experience.length
    const techCount = Object.values(data.skills.groups).flat().length
    return [
      { label: 'Years Building', value: '5+' },
      { label: 'Roles Delivered', value: `${expCount}` },
      { label: 'Projects Shipped', value: `${projectCount}` },
      { label: 'Core Technologies', value: `${techCount}+` },
    ]
  }, [data.experience.length, data.projects.length, data.skills.groups])

  const faqItems = useMemo(
    () => [
      {
        question: 'Who is Kunal Wadhai?',
        answer:
          'Kunal Wadhai is a backend engineer focused on scalable APIs, integrations, data consistency, and production reliability for real-world systems.',
      },
      {
        question: 'What does Kunal Wadhai specialize in?',
        answer:
          'Kunal specializes in Node.js backend development, system integrations, Redis/Postgres data flows, and reliability-first architecture for production environments.',
      },
      {
        question: 'How can I contact Kunal Wadhai for backend work?',
        answer:
          'You can contact Kunal Wadhai directly via email through the contact section or connect through GitHub and LinkedIn links available on this portfolio.',
      },
    ],
    []
  )

  const faqButtonRefs = useRef<Array<HTMLButtonElement | null>>([])

  const handleFaqKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpenFaqIndex((current) => (current === index ? -1 : index))
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = (index + 1) % faqItems.length
      faqButtonRefs.current[next]?.focus()
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const prev = (index - 1 + faqItems.length) % faqItems.length
      faqButtonRefs.current[prev]?.focus()
    }

    if (event.key === 'Home') {
      event.preventDefault()
      faqButtonRefs.current[0]?.focus()
    }

    if (event.key === 'End') {
      event.preventDefault()
      faqButtonRefs.current[faqItems.length - 1]?.focus()
    }
  }

  const skillCategoryMap: Record<string, string> = {
    Languages: 'languages',
    'Backend & APIs': 'backend',
    Databases: 'databases',
    'Cloud/Observability': 'cloud',
    'AI/Generative AI': 'ai',
    'Systems & Embedded/Hardware': 'embedded',
  }

  const resolveCategory = (group: string) => skillCategoryMap[group] || 'default'

  const repos = useMemo(() => githubSummary?.repos ?? [], [githubSummary])
  const topStarred = useMemo(() => {
    return [...repos]
      .sort((a, b) => (b.stargazers ?? 0) - (a.stargazers ?? 0))
      .slice(0, 3)
      .map((repo) => repo.name)
  }, [repos])

  const languageColors: Record<string, string> = {
    JavaScript: '#f1e05a',
    CSS: '#563d7c',
    Python: '#3572A5',
  }

  const githubStatsImage = `https://github-readme-stats.vercel.app/api?username=${githubHandle}&show_icons=true&theme=dark&hide_border=true&bg_color=0d1117`
  const githubStreakImage = `https://github-readme-streak-stats.herokuapp.com/?user=${githubHandle}&theme=dark&hide_border=true&background=0d1117`


  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(data.social.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-animate]'))
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    elements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="page">
      <a className="skip-link" href="#about">Skip to content</a>
      <header className="hero" id="top">
        <nav className="topbar">
          <strong>{data.name}</strong>
          <div>
            {NAV_ITEMS.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </nav>

        <FadeIn className="hero-body">
          <div className="hero-grid">
            <div>
              <p className="eyebrow">Backend Engineer · Systems Reliability · Integrations</p>
              <h1>{data.title} who ships reliable production systems.</h1>
              <p className="lead">{data.bio || 'Designing practical APIs and resilient backend services.'}</p>
              {state === 'error' && (
                <p className="notice">
                  Live profile fetch unavailable. Showing trusted fallback profile data.
                </p>
              )}
              <div className="cta-row">
                <a className="btn solid" href={data.resume.pdfUrl} target="_blank" rel="noreferrer">
                  Download Resume
                </a>
                <a className="btn ghost" href={`mailto:${data.social.email}`}>
                  Contact Me
                </a>
              </div>
            </div>
            <aside className="hero-card" aria-label="Profile highlights">
              <p className="hero-card__eyebrow">Currently</p>
              <h3>Guestara</h3>
              <p>Building integration-heavy backend systems for hospitality ops.</p>
              <div className="hero-card__stats">
                <div>
                  <span>Focus</span>
                  <strong>Integrations</strong>
                </div>
                <div>
                  <span>Location</span>
                  <strong>{data.location || 'Remote'}</strong>
                </div>
              </div>
            </aside>
          </div>
        </FadeIn>
      </header>

      <section className="metrics" aria-label="Portfolio highlights">
        {metrics.map((item) => (
          <article key={item.label} className="metric-card">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <Section
        id="about"
        title="About"
        subtitle="Production-grade backend engineering with a calm, observability-first approach."
        variant="about"
      >
        <div className="grid two">
          <article className="card about-card" data-animate="fade-up">
            <h3>{data.about?.headline || 'Designing systems that stay reliable.'}</h3>
            <p>{data.about?.summary || 'I ship APIs that keep data consistent across real-world integrations.'}</p>
            <div className="about-pills">
              <span>3 PMS systems</span>
              <span>2 production integrations</span>
              <span>100% uptime focus</span>
            </div>
          </article>
          <article className="card about-card about-card--stacked" data-animate="fade-up" style={{ '--delay': '80ms' } as React.CSSProperties}>
            <div className="about-list">
              <div>
                <h4>Focus</h4>
                <ul>
                  {(data.about?.focus || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Values</h4>
                <ul>
                  {(data.about?.values || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Approach</h4>
                <ul>
                  {(data.about?.approach || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </Section>

      <Section id="experience" title="Experience" subtitle="Detailed production work and engineering impact.">
        <div className="stack">
          {data.experience.map((exp) => (
            <article className="card" key={`${exp.company}-${exp.role}`}>
              <div className="card-head">
                <div className="card-head__company">
                  <LogoBadge
                    src={expLogoMap[exp.company] || exp.logoUrl}
                    alt={`${exp.company} logo`}
                    fallback={exp.company.slice(0, 2).toUpperCase()}
                  />
                  <h3>{exp.company}</h3>
                </div>
                <span>
                  {formatMonthYear(exp.start)} - {formatMonthYear(exp.end)}
                </span>
              </div>
              <p className="role">{exp.role}</p>
              {exp.achievements.map((achievement) => (
                <div key={achievement.title} className="achievement">
                  <h4>{achievement.title}</h4>
                  <ul>
                    {achievement.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="chips">
                {exp.technologies.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="projects" title="Projects" subtitle="Clean product snapshots with direct live and source links.">
        <div className="grid two">
          {data.projects.map((project) => (
            <article className="card" key={project.name}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="chips">
                {project.technologies.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <div className="cta-row">
                <a className="btn ghost" href={normalizeUrl(project.url)} target="_blank" rel="noreferrer">
                  Live Project
                </a>
                <a className="btn ghost" href={normalizeUrl(project.githubUrl)} target="_blank" rel="noreferrer">
                  Source Code
                </a>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="skills" title="Skills" subtitle="Core backend stack grouped by practical capability.">
        <div className="grid two">
          {Object.entries(data.skills.groups).map(([group, entries]) => (
            <article className="card" key={group}>
              <h3>{group}</h3>
              <div className="chips">
                {entries.map((entry) => (
                  <span key={entry}>{entry}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="coding" title="Coding Profiles" subtitle="Live profile highlights and consistency signals.">
        {codingState === 'error' && (
          <p className="notice">Live coding stats unavailable right now.</p>
        )}
        <div className="grid three">
          <a className="card link-card" href={normalizeUrl(data.programmingDashboards?.leetcode?.url)} target="_blank" rel="noreferrer">
            <div className="card-head">
              <div className="card-head__company">
                <LogoBadge
                  src={data.programmingDashboards?.leetcode?.logoUrl}
                  alt="LeetCode logo"
                  fallback="LC"
                />
                <h3>LeetCode</h3>
              </div>
            </div>
            <p>@{data.programmingDashboards?.leetcode?.handle || 'lost_war'}</p>
            <div className="stats">
              <div>
                <span>Solved</span>
                <strong>{leetcodeStats?.totalSolved ?? 0}</strong>
              </div>
              <div>
                <span>Contest</span>
                <strong>{leetcodeStats?.contest?.rating ? Math.round(leetcodeStats.contest.rating) : '—'}</strong>
              </div>
              <div>
                <span>Streak</span>
                <strong>{leetcodeStats?.calendar?.streak ?? 0}</strong>
              </div>
            </div>
            <div className="stat-chips" aria-label="LeetCode solved breakdown">
              <span>Easy {leetcodeStats?.solvedBreakdown?.easy ?? 0}</span>
              <span>Medium {leetcodeStats?.solvedBreakdown?.medium ?? 0}</span>
              <span>Hard {leetcodeStats?.solvedBreakdown?.hard ?? 0}</span>
            </div>
            {calendarCells.length > 0 && (
              <div className="calendar" aria-label="LeetCode consistency graph">
                {calendarCells.map((count, index) => (
                  <span key={`lc-day-${index}`} data-level={Math.min(4, Math.floor(count / 2))} />
                ))}
              </div>
            )}
          </a>
          <a className="card link-card" href={normalizeUrl(data.programmingDashboards?.hackerrank?.url)} target="_blank" rel="noreferrer">
            <div className="card-head">
              <div className="card-head__company">
                <LogoBadge
                  src={data.programmingDashboards?.hackerrank?.logoUrl}
                  alt="HackerRank logo"
                  fallback="HR"
                />
                <h3>HackerRank</h3>
              </div>
            </div>
            <p>@{data.programmingDashboards?.hackerrank?.username || 'Kunal_Wadhai'}</p>
            <p className="muted">Badges and stars show once data source is connected.</p>
          </a>
          <a className="card link-card" href={normalizeUrl(data.programmingDashboards?.gfg?.url)} target="_blank" rel="noreferrer">
            <div className="card-head">
              <div className="card-head__company">
                <LogoBadge
                  src={data.programmingDashboards?.gfg?.logoUrl}
                  alt="GeeksforGeeks logo"
                  fallback="GfG"
                />
                <h3>GeeksforGeeks</h3>
              </div>
            </div>
            <p>@{data.programmingDashboards?.gfg?.username || 'alone_warrior_11011'}</p>
            <p className="muted">Solved count and score show once data source is connected.</p>
          </a>
        </div>
      </Section>

      <Section id="github" title="GitHub Live Data" subtitle="Live summary and contribution graph.">
        <div className="grid two">
          <article className="card">
            <h3>@{githubHandle}</h3>
            <div className="stats">
              <div>
                <span>Repos</span>
                <strong>{githubSummary?.publicRepos ?? 0}</strong>
              </div>
              <div>
                <span>Followers</span>
                <strong>{githubSummary?.followers ?? 0}</strong>
              </div>
              <div>
                <span>Following</span>
                <strong>{githubSummary?.following ?? 0}</strong>
              </div>
            </div>
            <div className="repo-list">
              {(githubSummary?.repos || []).slice(0, 6).map((repo) => (
                <a key={repo.name} href={normalizeUrl(repo.html_url)} target="_blank" rel="noreferrer">
                  <span>{repo.name}</span>
                  <small>
                    {repo.language || 'N/A'} · ★ {repo.stargazers}
                  </small>
                </a>
              ))}
              {!githubSummary && <p className="notice">Live GitHub summary unavailable right now.</p>}
            </div>
          </article>
          <article className="card">
            <iframe title="GitHub contributions" src={`https://github.com/users/${githubHandle}/contributions`} />
          </article>
        </div>
      </Section>

      <Section id="readiness" title="Global Readiness" subtitle="What makes this portfolio review-ready for global engineering teams.">
        <div className="grid three">
          {READINESS_AREAS.map((area) => (
            <article className="card readiness-card" key={area.title}>
              <h3>{area.title}</h3>
              <p>{area.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="testimonials" title="Testimonials" subtitle="Feedback style expected from engineering and product collaborators.">
        <div className="grid two">
          {TESTIMONIALS.map((review) => (
            <article key={review.author} className="card quote-card">
              <p className="quote-text">“{review.quote}”</p>
              <p className="quote-meta">{review.author} · {review.org}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="assistant" title="AI Assistant" subtitle="Profile-aware assistant with backend chat fallback.">
        <AssistantPanel />
      </Section>

      <Section
        id="faq"
        title="FAQ"
        subtitle="Common questions about Kunal Wadhai, backend engineering specialization, and project work."
      >
        <div className="stack">
          <article className="card faq-card">
            <h3>Who is Kunal Wadhai?</h3>
            <p>
              Kunal Wadhai is a backend engineer focused on scalable APIs, integrations, data consistency, and
              production reliability for real-world systems.
            </p>
          </article>
          <article className="card faq-card">
            <h3>What does Kunal Wadhai specialize in?</h3>
            <p>
              Kunal specializes in Node.js backend development, system integrations, Redis/Postgres data flows,
              and reliability-first architecture for production environments.
            </p>
          </article>
          <article className="card faq-card">
            <h3>How can I contact Kunal Wadhai for backend work?</h3>
            <p>
              You can contact Kunal Wadhai directly via email through the contact section or connect through GitHub and
              LinkedIn links available on this portfolio.
            </p>
          </article>
        </div>
      </Section>

      <Section id="contact" title="Contact" subtitle="Open to backend, integrations, and reliability-focused roles.">
        <div className="socials">
          <a href={normalizeUrl(data.social.githubUrl)} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a href={normalizeUrl(data.social.linkedinUrl)} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
          <a href={normalizeUrl(data.social.xUrl)} target="_blank" rel="noreferrer" aria-label="X">
            <Twitter size={18} />
          </a>
          <a href={normalizeUrl(data.social.leetcodeUrl)} target="_blank" rel="noreferrer" aria-label="LeetCode">
            <TerminalSquare size={18} />
          </a>
          <a href={`mailto:${data.social.email}`} aria-label="Email">
            <Mail size={18} />
          </a>
        </div>
        <a className="btn solid" href={`mailto:${data.social.email}`}>
          Send Message <Send size={15} />
        </a>
        <button className="btn ghost copy-btn" type="button" onClick={copyEmail}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Email Copied' : 'Copy Email'}
        </button>
      </Section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} {data.name}. Backend engineer portfolio.</p>
        <div>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </div>
  )
}
