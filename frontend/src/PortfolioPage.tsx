import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Send,
  TerminalSquare,
  Twitter,
} from 'lucide-react'
import { apiGet, apiPost } from './lib/api'
import { useInView } from './hooks/useInView'

type Achievement = {
  title: string
  points: string[]
}

type Experience = {
  company: string
  role: string
  start: string
  end: string | null
  technologies: string[]
  achievements: Achievement[]
}

type Profile = {
  name: string
  title: string
  bio?: string
  social: {
    linkedinUrl: string
    githubUrl: string
    githubHandle?: string
    leetcodeUrl: string
    xUrl: string
    email: string
  }
  skills: {
    groups: Record<string, string[]>
  }
  education: Array<{
    cgpa?: number
  }>
  experience: Experience[]
  projects: Array<{
    name: string
    url: string
    githubUrl: string
    description: string
    technologies: string[]
  }>
  resume: {
    pdfUrl: string
  }
  programmingDashboards?: {
    leetcode?: { handle: string; url?: string }
    hackerrank?: { username: string | null; url?: string }
    gfg?: { username: string | null; url?: string }
  }
}

type SkillRow = {
  name: string
  level: 'Advanced' | 'Proficient' | 'Intermediate'
  score: number
}

type ProjectCard = {
  category: string
  title: string
  description: string
  stack: string[]
  href: string
  spanClass: string
}

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type ExperienceStory = {
  id: string
  company: string
  phase: string
  role: string
  period: string
  summary: string
  impact: string[]
  stack: string[]
  isActive?: boolean
}

type GitHubRepo = {
  name: string
  html_url: string
  language: string | null
  stargazers: number
}

type GitHubSummary = {
  publicRepos: number
  followers: number
  following: number
  repos: GitHubRepo[]
}

const DEFAULT_PROFILE: Profile = {
  name: 'Kunal Wadhai',
  title: 'Backend Engineer',
  bio: 'Backend Engineer focused on scalable systems, integrations, and production reliability.',
  social: {
    linkedinUrl: 'https://www.linkedin.com/in/kunal-wadhai/',
    githubUrl: 'https://github.com/KunalWadhai',
    githubHandle: 'KunalWadhai',
    leetcodeUrl: 'https://leetcode.com/u/lost_war/',
    xUrl: 'https://x.com/AloneWarrior27',
    email: 'kunalwadhai456@gmail.com',
  },
  skills: {
    groups: {
      Languages: ['C/C++', 'Python', 'JavaScript', 'Java'],
      'Backend & APIs': ['Node.js', 'Express.js', 'RESTful APIs', 'Microservices'],
      Databases: ['Redis', 'MongoDB', 'Postgres', 'MySQL'],
      Systems: ['Linux', 'OpenBMC', 'Yocto Project', 'Raspberry Pi'],
    },
  },
  education: [{ cgpa: 8.53 }],
  experience: [
    {
      company: 'Zoho',
      role: 'Firmware Engineering Intern / Project Trainee',
      start: '2025-01',
      end: '2025-04',
      technologies: ['Linux', 'Shell Scripting', 'Yocto Project', 'OpenBMC', 'Raspberry Pi', 'BeagleBone Black'],
      achievements: [
        {
          title: 'Embedded Systems',
          points: [
            'Worked with OpenBMC firmware workflows for server hardware management.',
            'Customized and built Yocto-based Linux images for embedded boards.',
            'Automated firmware build/deploy operations using shell scripts.',
          ],
        },
      ],
    },
    {
      company: 'Guestara',
      role: 'Backend Engineering Intern -> Full Time',
      start: '2024-11',
      end: 'Present',
      technologies: ['Node.js', 'Express.js', 'Redis', 'Postgres', 'MongoDB', 'MySQL', 'CloudWatch', 'Microservices'],
      achievements: [
        {
          title: 'PMS Integrations & Sync',
          points: [
            'Built PMS integrations with Beds24, Ezee, and Hotelogix.',
            'Maintained real-time booking and room synchronization.',
            'Resolved critical production sync issues and booking mismatches.',
            'Engineered smart room allocation logic for Beds24 booking flow.',
            'Implemented payment and upsell synchronization with Hotelogix.',
            'Built Tuya smart-lock passcode generation and lifecycle orchestration.',
            'Delivered data-heavy dashboard APIs for guest and operations analytics.',
          ],
        },
      ],
    },
  ],
  projects: [
    {
      name: 'foodSnatch',
      url: 'https://foodsnatch.onrender.com',
      githubUrl: 'https://github.com/KunalWadhai/foodSnatch',
      description: 'Full-stack food delivery platform built with MERN.',
      technologies: ['MongoDB', 'Express.js', 'React', 'Node.js'],
    },
  ],
  resume: {
    pdfUrl: 'https://drive.google.com/uc?export=download&id=17PSerWGj5S0aRT2TZJnEf_FtyOr91hCA',
  },
  programmingDashboards: {
    leetcode: { handle: 'lost_war', url: 'https://leetcode.com/u/lost_war/' },
    hackerrank: { username: 'Kunal_Wadhai', url: 'https://www.hackerrank.com/profile/Kunal_Wadhai' },
    gfg: {
      username: 'alone_warrior_11011',
      url: 'https://www.geeksforgeeks.org/profile/alone_warrior_11011',
    },
  },
}

function normalizeUrl(url: string | undefined) {
  if (!url) return '#'
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

async function fetchGitHubSummary(handle: string): Promise<GitHubSummary | null> {
  try {
    const summary = await apiGet(`/api/github/summary?username=${encodeURIComponent(handle)}`)
    return summary as GitHubSummary
  } catch {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(handle)}`),
        fetch(`https://api.github.com/users/${encodeURIComponent(handle)}/repos?sort=updated&per_page=6`),
      ])
      if (!userRes.ok || !reposRes.ok) return null
      const user = await userRes.json()
      const repos = await reposRes.json()
      return {
        publicRepos: user.public_repos ?? 0,
        followers: user.followers ?? 0,
        following: user.following ?? 0,
        repos: (repos || []).map((repo: Record<string, unknown>) => ({
          name: String(repo.name || ''),
          html_url: String(repo.html_url || '#'),
          language: repo.language ? String(repo.language) : null,
          stargazers: Number(repo.stargazers_count || 0),
        })),
      }
    } catch {
      return null
    }
  }
}

const NAV_LINKS = [
  { id: 'experience', label: 'Experience' },
  { id: 'assistant', label: 'Assistant' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'platforms', label: 'Platforms' },
  { id: 'github', label: 'GitHub' },
  { id: 'contact', label: 'Contact' },
]

const TERMINAL_LINES = [
  '$ whoami',
  'kunal.wadhai :: backend.engineer',
  '$ ping guestara-core',
  '64 bytes from guestara-core: time=14ms status=200',
  '$ ./sync --pms beds24,ezee,hotelogix',
  '[ok] booking streams reconciled',
  '$ lockctl issue-passcode --room 402 --ttl 4h',
  '[ok] tuya gateway responded in 92ms',
  '$ cat /var/log/system/mission.log',
  '> designing resilient software, one signal at a time.',
]

const STATS_CONFIG = [
  { key: 'internships', label: 'Internships', target: 2, suffix: '+' },
  { key: 'technologies', label: 'Technologies', target: 5, suffix: '+' },
  { key: 'cgpa', label: 'CGPA', target: 8.53, decimals: 2 },
  { key: 'duration', label: 'At Guestara', text: 'Nov 24 -> Now' },
] as const

function formatMonthYear(raw: string | null | undefined) {
  if (!raw) return 'Present'
  const [year, month] = raw.split('-')
  if (!month) return year
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function buildExperienceStories(profile: Profile): ExperienceStory[] {
  const zoho = profile.experience.find((item) => /zoho/i.test(item.company))
  const guestara = profile.experience.find((item) => /guestara/i.test(item.company))

  const zohoPoints = zoho?.achievements.flatMap((entry) => entry.points) ?? []
  const guestaraPoints = guestara?.achievements.flatMap((entry) => entry.points) ?? []

  const guestaraInternPoints = guestaraPoints.slice(0, 4)
  const guestaraFulltimePoints = guestaraPoints.slice(4, 10)

  return [
    {
      id: 'zoho-intern',
      company: 'Zoho',
      phase: 'Firmware Internship',
      role: zoho?.role || 'Firmware Engineering Intern / Project Trainee',
      period: `${formatMonthYear(zoho?.start)} -> ${formatMonthYear(zoho?.end)}`,
      summary:
        'Worked deeply in embedded Linux workflows with OpenBMC and Yocto image customization for hardware-focused systems engineering.',
      impact:
        zohoPoints.length
          ? zohoPoints
          : [
              'Customized Yocto-based Linux images for Raspberry Pi and BeagleBone Black.',
              'Automated firmware build and deployment flows with shell scripting.',
              'Contributed to OpenBMC firmware tasks for server hardware management.',
            ],
      stack: (zoho?.technologies || ['Linux', 'Shell', 'Yocto', 'OpenBMC']).slice(0, 7),
    },
    {
      id: 'guestara-intern',
      company: 'Guestara',
      phase: 'Backend Internship',
      role: 'Backend Engineering Intern',
      period: `${formatMonthYear(guestara?.start)} -> Internship Conversion`,
      summary:
        'Started by shipping high-leverage integrations and building operational APIs that connected booking, guest, and payment systems.',
      impact:
        guestaraInternPoints.length
          ? guestaraInternPoints
          : [
              'Built PMS integrations with Beds24, Ezee, and Hotelogix.',
              'Maintained real-time room and guest synchronization across systems.',
              'Resolved production sync issues affecting booking consistency.',
            ],
      stack: (guestara?.technologies || ['Node.js', 'Express.js', 'Redis', 'Postgres']).slice(0, 8),
    },
    {
      id: 'guestara-fulltime',
      company: 'Guestara',
      phase: 'Full-Time Backend Engineer',
      role: 'Backend Engineer',
      period: 'Post Conversion -> Present',
      summary:
        'Scaled backend systems in production with smart automation, event-driven IoT workflows, resilient sync pipelines, and operational analytics APIs.',
      impact:
        guestaraFulltimePoints.length
          ? guestaraFulltimePoints
          : [
              'Designed smart room allocation logic for Beds24 booking flows.',
              'Built Tuya smart-lock passcode lifecycle synced with bookings.',
              'Delivered data-heavy operational dashboard APIs used by teams daily.',
            ],
      stack: (guestara?.technologies || ['Node.js', 'Redis', 'Postgres', 'Microservices', 'CloudWatch']).slice(0, 10),
      isActive: true,
    },
  ]
}

function getSkillScore(name: string) {
  const normalized = name.toLowerCase()
  if (/c\/c\+\+|python|node|linux|redis|postgres|mongodb|express|system integration/.test(normalized)) {
    return { score: 86, level: 'Advanced' as const }
  }
  if (/javascript|java|mysql|openai|cloudwatch|git|microservices/.test(normalized)) {
    return { score: 72, level: 'Proficient' as const }
  }
  return { score: 56, level: 'Intermediate' as const }
}

function getCategory(index: number) {
  if (index === 0) return 'featured'
  if (index === 1) return 'tall'
  if (index === 2) return 'small'
  return 'wide'
}

function useCountUp(inView: boolean) {
  const [counts, setCounts] = useState({
    internships: 0,
    technologies: 0,
    cgpa: 0,
  })

  useEffect(() => {
    if (!inView) return
    let frame = 0
    const duration = 1200
    const startedAt = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startedAt
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - progress, 3)

      setCounts({
        internships: Math.round(2 * eased),
        technologies: Math.round(5 * eased),
        cgpa: Number((8.53 * eased).toFixed(2)),
      })

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView])

  return counts
}

function useTypewriterLines(
  lines: string[],
  { startDelay = 300, typingDelay = 20, linePause = 220 }: { startDelay?: number; typingDelay?: number; linePause?: number } = {}
) {
  const [rendered, setRendered] = useState<string[]>([])

  useEffect(() => {
    let timeoutId: number | null = null
    let cancelled = false

    const writeLine = (lineIndex: number, charIndex: number, snapshot: string[]) => {
      if (cancelled) return
      if (lineIndex >= lines.length) return

      const line = lines[lineIndex]
      const nextSnapshot = [...snapshot]

      if (charIndex <= line.length) {
        nextSnapshot[lineIndex] = line.slice(0, charIndex)
        setRendered(nextSnapshot)
        timeoutId = window.setTimeout(
          () => writeLine(lineIndex, charIndex + 1, nextSnapshot),
          Math.max(typingDelay - Math.random() * 6, 8)
        )
        return
      }

      timeoutId = window.setTimeout(() => writeLine(lineIndex + 1, 0, nextSnapshot), linePause)
    }

    timeoutId = window.setTimeout(() => {
      writeLine(0, 0, new Array(lines.length).fill(''))
    }, startDelay)

    return () => {
      cancelled = true
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [linePause, lines, startDelay, typingDelay])

  return rendered.filter(Boolean)
}

export default function PortfolioPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [githubSummary, setGithubSummary] = useState<GitHubSummary | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('experience')
  const [cursorEnabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
  )
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [cursorActive, setCursorActive] = useState(false)

  const statsRef = useRef<HTMLElement | null>(null)
  const statsInView = useInView(statsRef, { threshold: 0.3 })
  const counts = useCountUp(statsInView)

  const terminalLines = useTypewriterLines(TERMINAL_LINES, {
    typingDelay: 16,
    linePause: 280,
    startDelay: 650,
  })

  useEffect(() => {
    apiGet('/api/profile')
      .then((response) => setProfile(response))
      .catch((error) => {
        console.error('Failed to load profile', error)
        setProfile(DEFAULT_PROFILE)
      })
  }, [])

  useEffect(() => {
    const handle = profile?.social?.githubHandle || profile?.social?.githubUrl?.split('/').filter(Boolean).pop()
    if (!handle) return
    fetchGitHubSummary(handle)
      .then((summary) => {
        if (summary) setGithubSummary(summary)
      })
      .catch((error) => {
        console.error('Failed to load github summary', error)
      })
  }, [profile])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0.1 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [profile])

  useEffect(() => {
    if (!cursorEnabled) return

    const move = (event: MouseEvent) => {
      setCursorPos({ x: event.clientX, y: event.clientY })
      const target = event.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest('a, button, .project-card, .social-icon, .terminal-shell')
      setCursorActive(Boolean(interactive))
    }

    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [cursorEnabled])

  const dataProfile = profile ?? DEFAULT_PROFILE

  const experienceStories = useMemo(() => buildExperienceStories(dataProfile), [dataProfile])

  const skillTables = useMemo(() => {
    const groups = profile?.skills.groups ?? {}
    return Object.entries(groups).map(([group, entries]) => {
      const rows: SkillRow[] = entries.map((entry) => {
        const { score, level } = getSkillScore(entry)
        return { name: entry, score, level }
      })
      return { group, rows }
    })
  }, [profile])

  const projectCards = useMemo<ProjectCard[]>(() => {
    const fromProfile = (profile?.projects ?? [])
      .filter((project) => /foodsnatch/i.test(project.name))
      .map((project) => ({
      category: 'Featured Product',
      title: project.name,
      description: project.description,
      stack: project.technologies,
      href: normalizeUrl(project.url),
      spanClass: 'featured',
    }))

    if (fromProfile.length) return fromProfile
    return [
      {
        category: 'Featured Product',
        title: 'foodSnatch',
        description: 'Full-stack food delivery and ordering platform with authentication, ordering, and tracking workflows.',
        stack: ['#MongoDB', '#Express', '#React', '#Node.js'],
        href: 'https://foodsnatch.onrender.com',
        spanClass: 'featured',
      },
    ]
  }, [profile])

  const resumeUrl = dataProfile.resume.pdfUrl
  const social = dataProfile.social
  const location = '20.3974° N, 78.1198° E'
  const githubHandle = dataProfile.social.githubHandle || dataProfile.social.githubUrl.split('/').filter(Boolean).pop() || 'KunalWadhai'
  const insightRows = [
    { label: 'Current Focus', value: 'Realtime Integrations + Distributed Data Sync' },
    { label: 'Core Stack', value: 'Node.js, Redis, Postgres, Observability Pipelines' },
    { label: 'Engineering Mode', value: 'Production Reliability, Measurable Latency, Clean Contracts' },
  ]

  return (
    <div className="systems-page">
      <div className="noise-layer" aria-hidden="true" />
      <div className="scan-line" aria-hidden="true" />

      {cursorEnabled && (
        <>
          <div className="cursor-dot" style={{ left: cursorPos.x, top: cursorPos.y }} />
          <div
            className={`cursor-ring ${cursorActive ? 'is-active' : ''}`}
            style={{ left: cursorPos.x, top: cursorPos.y }}
          />
        </>
      )}

      <nav className={`top-nav load-fade ${scrolled ? 'is-scrolled' : ''}`}>
        <a href="#" className="monogram" onClick={(e) => e.preventDefault()}>
          KW <span className="blink-cursor">▍</span>
        </a>

        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} className={activeSection === link.id ? 'is-active' : ''}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          {resumeUrl && (
            <a className="resume-link" href={resumeUrl} target="_blank" rel="noreferrer">
              Resume ↗
            </a>
          )}
          <a className="connect-pill" href={social?.linkedinUrl} target="_blank" rel="noreferrer">
            Connect →
          </a>
        </div>
      </nav>

      <main>
        <section className="hero" id="top">
          <div className="hero-left">
            <div className="status-badge load-badge">● AVAILABLE</div>

            <h1 className="hero-name">
              <span className="hero-word hero-word-a load-word">KUNAL</span>
              <span className="hero-word hero-word-b load-word">WADHAI</span>
            </h1>

            <p className="hero-subtitle load-copy">
              <span className="serif">Backend Engineer</span>
              <span className="slash">/</span>
              <span className="accent">System Architect</span>
            </p>

            <p className="hero-bio load-copy-2">
              Building resilient backend systems where real-time data, embedded hardware, and product reliability intersect.
            </p>

            <div className="hero-actions load-cta">
              <a className="connect-pill cta-primary" href={social?.linkedinUrl} target="_blank" rel="noreferrer">
                Connect <ArrowRight size={14} />
              </a>
              <a className="cta-link" href="#projects">
                View Work ↓
              </a>
            </div>
          </div>

          <div className="hero-right load-terminal">
            <div className="terminal-shell">
              <div className="terminal-titlebar">
                <div className="dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="terminal-meta">kunal@portfolio ~ zsh</div>
                <div className="terminal-status">live backend session</div>
              </div>

              <div className="terminal-body">
                {terminalLines.map((line, index) => (
                  <div key={`${line}-${index}`} className="terminal-line">
                    {line}
                    {index === terminalLines.length - 1 && <span className="term-cursor">▍</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`stats-band reveal ${statsInView ? 'in-view' : ''}`} ref={statsRef}>
          <div className="stats-grid">
            {STATS_CONFIG.map((stat) => {
              let value = 'text' in stat ? stat.text : ''
              if (stat.key === 'internships') value = `${counts.internships}${stat.suffix ?? ''}`
              if (stat.key === 'technologies') value = `${counts.technologies}${stat.suffix ?? ''}`
              if (stat.key === 'cgpa') value = counts.cgpa.toFixed(stat.decimals ?? 0)

              return (
                <div key={stat.key} className="stat-item">
                  <div className="stat-value">{value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="signal-brief reveal in-view">
          <div className="signal-brief__left">SYSTEM BRIEF</div>
          <div className="signal-brief__right">
            {insightRows.map((row) => (
              <div key={row.label} className="signal-row">
                <span>{row.label}</span>
                <p>{row.value}</p>
              </div>
            ))}
          </div>
        </section>

        <SectionFrame id="experience" title="Experience" subtitle="System logs from production environments.">
          <div className="experience-command-center">
            <ExperienceNetworkCanvas />

            <div className="experience-journey">
              {experienceStories.map((story, index) => (
                <article
                  key={story.id}
                  className={`experience-story reveal ${story.isActive ? 'is-active' : ''}`}
                  style={{ animationDelay: `${index * 110}ms` }}
                >
                  <div className="story-rail" aria-hidden="true">
                    <span className="story-index">0{index + 1}</span>
                    <span className="story-node" />
                    {index < experienceStories.length - 1 && <span className="story-line" />}
                  </div>

                  <div className="story-panel">
                    <header className="story-header">
                      <p className="experience-date">{story.period}</p>
                      <span className="story-phase">{story.phase}</span>
                    </header>

                    <h3>{story.company}</h3>
                    <p className="role serif">{story.role}</p>
                    <p className="story-summary">{story.summary}</p>

                    <ul>
                      {story.impact.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>

                    <div className="hash-tags">
                      {story.stack.map((tech) => (
                        <span key={tech}>#{tech.replace(/\s+/g, '')}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </SectionFrame>

        <SectionFrame
          id="assistant"
          title="AI Assistant"
          subtitle="Mission-control copilot trained on Kunal's profile, projects, and production engineering context."
        >
          <AssistantEmbed />
        </SectionFrame>

        <SectionFrame id="skills" title="Skills" subtitle="Capability matrix presented as terminal tables.">
          <div className="skills-panels">
            {skillTables.map((table, tableIndex) => (
              <article className="skills-panel reveal" key={table.group} style={{ animationDelay: `${tableIndex * 80}ms` }}>
                <div className="skills-panel-head">{table.group}</div>

                <div className="skills-table-head">
                  <span>LANGUAGES</span>
                  <span>PROFICIENCY</span>
                </div>

                <div className="skills-rows">
                  {table.rows.map((row, rowIndex) => (
                    <div
                      key={`${table.group}-${row.name}`}
                      className="skills-row"
                      style={{ animationDelay: `${tableIndex * 80 + rowIndex * 50}ms` }}
                    >
                      <span className="skill-name">{row.name}</span>
                      <div className="skill-meter-wrap">
                        <div className="skill-meter-track">
                          <span className="skill-meter-fill" style={{ width: `${row.score}%` }} />
                        </div>
                        <span className="skill-level">{row.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame id="projects" title="Projects" subtitle="Asymmetric product snapshots with clear systems context.">
          <div className="projects-bento">
            {projectCards.map((project, index) => (
              <article key={project.title} className={`project-card reveal ${project.spanClass}`} style={{ animationDelay: `${index * 80}ms` }}>
                <div className="project-circuit" aria-hidden="true" />
                <div className="project-category">{project.category}</div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="project-footer">
                  <div className="hash-tags">
                    {project.stack.map((item) => (
                      <span key={item}>{item.startsWith('#') ? item : `#${item}`}</span>
                    ))}
                  </div>

                  <a href={project.href} target="_blank" rel="noreferrer" className="project-link">
                    View → <ExternalLink size={13} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame
          id="platforms"
          title="Competitive Programming"
          subtitle="Profiles across LeetCode, HackerRank, and GeeksforGeeks with direct links."
        >
          <div className="platform-grid">
            <a className="platform-card reveal" href={normalizeUrl(dataProfile.programmingDashboards?.leetcode?.url)} target="_blank" rel="noreferrer">
              <h3>LeetCode</h3>
              <p>@{dataProfile.programmingDashboards?.leetcode?.handle || 'lost_war'}</p>
              <span>View Profile →</span>
            </a>
            <a className="platform-card reveal" href={normalizeUrl(dataProfile.programmingDashboards?.hackerrank?.url)} target="_blank" rel="noreferrer">
              <h3>HackerRank</h3>
              <p>@{dataProfile.programmingDashboards?.hackerrank?.username || 'Kunal_Wadhai'}</p>
              <span>View Profile →</span>
            </a>
            <a className="platform-card reveal" href={normalizeUrl(dataProfile.programmingDashboards?.gfg?.url)} target="_blank" rel="noreferrer">
              <h3>GeeksforGeeks</h3>
              <p>@{dataProfile.programmingDashboards?.gfg?.username || 'alone_warrior_11011'}</p>
              <span>View Profile →</span>
            </a>
          </div>
        </SectionFrame>

        <SectionFrame
          id="github"
          title="GitHub"
          subtitle="Repository highlights, account metrics, and contribution timeline."
        >
          <div className="github-grid">
            <article className="github-summary reveal">
              <div className="github-summary-stats">
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

              <div className="github-repo-list">
                {(githubSummary?.repos || []).slice(0, 6).map((repo) => (
                  <a key={repo.name} href={normalizeUrl(repo.html_url)} target="_blank" rel="noreferrer">
                    <span>{repo.name}</span>
                    <small>{repo.language || 'N/A'}</small>
                    <small>★ {repo.stargazers}</small>
                  </a>
                ))}
                {!githubSummary?.repos?.length && (
                  <div className="github-empty">
                    <p>Repository stats are temporarily unavailable.</p>
                    <a href={normalizeUrl(dataProfile.social.githubUrl)} target="_blank" rel="noreferrer">
                      Open GitHub Profile →
                    </a>
                  </div>
                )}
              </div>
            </article>

            <article className="github-contributions reveal">
              <iframe
                title="GitHub contributions"
                src={`https://github.com/users/${githubHandle}/contributions`}
              />
              <a className="github-open-link" href={normalizeUrl(dataProfile.social.githubUrl)} target="_blank" rel="noreferrer">
                Open full contribution graph on GitHub →
              </a>
            </article>
          </div>
        </SectionFrame>

        <SectionFrame id="contact" title="Contact" subtitle="Open for focused backend and systems work.">
          <div className="connection-panel reveal in-view">
            <div className="contact-main">
              <h3>
                Let's Build
                <span className="serif">Something.</span>
              </h3>
              <p>
                I collaborate with teams that value reliability, clear architecture, and deeply practical engineering.
              </p>

              <div className="social-row">
                <a className="social-icon" href={normalizeUrl(social?.githubUrl)} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <Github size={18} />
                </a>
                <a className="social-icon" href={normalizeUrl(social?.linkedinUrl)} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a className="social-icon" href={normalizeUrl(social?.xUrl)} target="_blank" rel="noreferrer" aria-label="X">
                  <Twitter size={18} />
                </a>
                <a className="social-icon" href={normalizeUrl(social?.leetcodeUrl)} target="_blank" rel="noreferrer" aria-label="LeetCode">
                  <TerminalSquare size={18} />
                </a>
                <a className="social-icon" href={social?.email ? `mailto:${social.email}` : '#'} aria-label="Email">
                  <Mail size={18} />
                </a>
              </div>

              <a className="message-cta" href={social?.email ? `mailto:${social.email}` : '#'}>
                Send a Message <Send size={16} />
              </a>
            </div>

            <aside className="contact-side">
              <div className="contact-side-block">
                <span>Timezone</span>
                <p>IST (UTC+05:30)</p>
              </div>
              <div className="contact-side-block">
                <span>Location</span>
                <p>Yavatmal, Maharashtra</p>
              </div>
              <div className="contact-side-block">
                <span>Coordinates</span>
                <p className="coordinates">{location}</p>
              </div>
              <div className="contact-side-block">
                <span>Email</span>
                <a href={social?.email ? `mailto:${social.email}` : '#'}>{social?.email}</a>
              </div>
            </aside>
          </div>
        </SectionFrame>
      </main>

      <footer className="footer-signature">
        <div className="footer-grid">
          <div>
            <h4>{dataProfile.name}</h4>
            <p>{dataProfile.title} focused on backend architecture, systems reliability, and integrations.</p>
          </div>
          <div>
            <h5>Navigation</h5>
            <div className="footer-links">
              <a href="#experience">Experience</a>
              <a href="#projects">Projects</a>
              <a href="#github">GitHub</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div>
            <h5>Profiles</h5>
            <div className="footer-links">
              <a href={normalizeUrl(social.githubUrl)} target="_blank" rel="noreferrer">GitHub</a>
              <a href={normalizeUrl(social.linkedinUrl)} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={normalizeUrl(social.leetcodeUrl)} target="_blank" rel="noreferrer">LeetCode</a>
              <a href={social.email ? `mailto:${social.email}` : '#'}>Email</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {dataProfile.name}. All rights reserved.</span>
          <a href={normalizeUrl(social?.githubUrl)} target="_blank" rel="noreferrer">
            Built with signal & systems <ArrowRight size={12} />
          </a>
        </div>
      </footer>
    </div>
  )
}

function SectionFrame({
  id,
  title,
  subtitle,
  children,
}: {
  id: string
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLElement | null>(null)
  const inView = useInView(ref, { threshold: 0.15 })

  return (
    <section id={id} className={`section-frame reveal ${inView ? 'in-view' : ''}`} ref={ref}>
      <header className="section-head">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </header>
      {children}
    </section>
  )
}

function ExperienceNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      canvas.width = rect.width * ratio
      canvas.height = rect.height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    resize()

    const points = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }))

    let raf = 0
    const draw = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      context.clearRect(0, 0, w, h)

      context.strokeStyle = 'rgba(99,210,167,0.11)'
      context.lineWidth = 1
      context.beginPath()

      for (let i = 0; i < points.length; i += 1) {
        const point = points[i]
        point.x += point.vx
        point.y += point.vy

        if (point.x < 0 || point.x > w) point.vx *= -1
        if (point.y < 0 || point.y > h) point.vy *= -1

        for (let j = i + 1; j < points.length; j += 1) {
          const other = points[j]
          const dx = point.x - other.x
          const dy = point.y - other.y
          const distance = Math.hypot(dx, dy)
          if (distance < 140) {
            context.moveTo(point.x, point.y)
            context.lineTo(other.x, other.y)
          }
        }
      }
      context.stroke()

      points.forEach((point) => {
        context.fillStyle = 'rgba(99,210,167,0.8)'
        context.beginPath()
        context.arc(point.x, point.y, 1.7, 0, Math.PI * 2)
        context.fill()
      })

      raf = window.requestAnimationFrame(draw)
    }

    raf = window.requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="experience-network-canvas" aria-hidden="true" />
}

function AssistantEmbed() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Signal online. I can walk you through Kunal's stack, projects, integrations, and architecture decisions.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const logEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const quickPrompts = [
    'What has Kunal shipped at Guestara?',
    'Explain his embedded systems background.',
    'What stack does he use most in production?',
  ]

  const localReply = (query: string) => {
    const q = query.toLowerCase()
    if (q.includes('guestara') || q.includes('experience')) {
      return 'At Guestara, Kunal worked on PMS integrations (Beds24, Ezee, Hotelogix), real-time data sync pipelines, and analytics APIs for operations.'
    }
    if (q.includes('stack') || q.includes('tech')) {
      return 'Primary production stack: Node.js, Express, Redis, Postgres, MongoDB, and cloud observability with CloudWatch.'
    }
    if (q.includes('embedded') || q.includes('firmware') || q.includes('yocto')) {
      return 'He also has embedded systems experience from Zoho: Yocto-based image customization, OpenBMC workflows, and Linux shell automation.'
    }
    if (q.includes('project')) {
      return 'Featured projects include production integration systems, smart lock orchestration, and full-stack product builds like foodSnatch.'
    }
    return 'Kunal is a backend engineer focused on reliable systems, integrations, and clear architecture. Ask about projects, stack, or production work.'
  }

  const sendMessage = async (value?: string) => {
    const message = (value ?? input).trim()
    if (!message || loading) return

    const userMessage: ChatMessage = { role: 'user', content: message }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const history = [...messages, userMessage]
      const data = await apiPost('/api/chat', {
        message,
        history,
      })

      const reply = data?.reply || data?.answer || 'No response received. Please retry.'
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (error) {
      console.error('Assistant embed error', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `${localReply(message)} (served via local fallback)`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="assistant-embed">
      <div className="assistant-embed__head">
        <div>
          <span className="assistant-status">● LIVE</span>
          <h3>Ask Kunal AI</h3>
        </div>
        <p>Profile aware assistant for stack, projects, and backend work.</p>
      </div>

      <div className="assistant-highlight">
        <span>Popular prompts:</span>
        <div>
          <button type="button" onClick={() => sendMessage('Tell me the most impactful backend work at Guestara')}>
            Guestara backend impact
          </button>
          <button type="button" onClick={() => sendMessage('How does Kunal approach reliable backend architecture?')}>
            Architecture approach
          </button>
        </div>
      </div>

      <div className="assistant-log">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`assistant-msg assistant-msg--${message.role}`}>
            <span>{message.role === 'assistant' ? 'assistant' : 'operator'}</span>
            <p>{message.content}</p>
          </div>
        ))}
        {loading && <div className="assistant-typing">typing...</div>}
        <div ref={logEndRef} />
      </div>

      <div className="assistant-prompts">
        {quickPrompts.map((prompt) => (
          <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      <div className="assistant-input-row">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              void sendMessage()
            }
          }}
          placeholder="Ask the assistant about system design, integrations, or projects"
        />
        <button type="button" disabled={loading || !input.trim()} onClick={() => void sendMessage()}>
          Send
        </button>
      </div>
    </div>
  )
}
