import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Code,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
  Download,
  ExternalLink,
} from 'lucide-react'
import { apiGet } from './lib/api'
import { Hero3D } from './components/Hero3D'
import { AIChatWidget } from './components/AIChatWidget'

// ─── Types matching the updated profile.json ───────────────
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
  integrations: string[]
  achievements: Achievement[]
  notes?: string
}

type Profile = {
  name: string
  title: string
  bio?: string
  location: string
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
    school: string
    degree: string
    startYear: number
    endYear: number
    cgpa?: number
    percentage?: number
  }>
  experience: Experience[]
  projects: Array<{
    name: string
    url: string
    githubUrl: string
    description: string
    technologies: string[]
    highlights: string[]
  }>
  resume: {
    pdfUrl: string
    videoUrl?: string | null
  }
  maps: {
    query: string
  }
  programmingDashboards?: {
    leetcode?: { handle: string; url?: string }
    hackerrank?: { username: string | null; url?: string }
    gfg?: { username: string | null; url?: string }
  }
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

// ─── Helpers ────────────────────────────────────────────────
function formatWhen(ex: Pick<Experience, 'start' | 'end'>) {
  const fmtDate = (s: string) => {
    const [y, m] = s.split('-')
    if (!m) return y
    const date = new Date(Number(y), Number(m) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return `${fmtDate(ex.start)} → ${ex.end && ex.end !== 'Present' ? fmtDate(ex.end) : 'Present'}`
}

// ─── Shared components ───────────────────────────────────────
function TiltCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`tilt ${className || ''}`}
      onPointerMove={(e) => {
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        el.style.setProperty('--rx', `${(y - 0.5) * -10}deg`)
        el.style.setProperty('--ry', `${(x - 0.5) * 10}deg`)
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty('--rx', '0deg')
        e.currentTarget.style.setProperty('--ry', '0deg')
      }}
    >
      {children}
    </div>
  )
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <motion.section
      id={id}
      className="section"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-50px' }}
    >
      <div className="section__head">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children}
    </motion.section>
  )
}

export default function PortfolioPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [githubSummary, setGithubSummary] = useState<GitHubSummary | null>(null)


  useEffect(() => {
    apiGet('/api/profile')
      .then((p) => setProfile(p))
      .catch((e) => console.error('Profile fetch error:', e))
  }, [])

  useEffect(() => {
    const handle = profile?.social?.githubHandle || profile?.social?.githubUrl?.split('/').pop()
    if (!handle) return
    apiGet(`/api/github/summary?username=${encodeURIComponent(handle)}`)
      .then((s) => setGithubSummary(s))
      .catch((e) => console.error('GitHub fetch error:', e))
  }, [profile])

  const social = useMemo(() => profile?.social, [profile])
  const mapsQuery = profile?.maps?.query || 'Yavatmal, Maharashtra, India'
  const resumeUrl = profile?.resume?.pdfUrl
  const githubHandle = profile?.social?.githubHandle || 'KunalWadhai'

  return (
    <div className="portfolio">
      <Hero3D />

      <header className="topbar">
        <div className="topbar__left">
          <div className="brand">
            <span className="brand__dot" />
            <span className="brand__name">{profile?.name || 'Kunal Wadhai'}</span>
          </div>
          <div className="topbar__title">{profile?.title || 'Backend Engineer'}</div>
        </div>
        <div className="topbar__right">
          {resumeUrl ? (
            <a className="btn btn--ghost" href={resumeUrl} target="_blank" rel="noreferrer">
              <Download size={14} /> Resume
            </a>
          ) : null}
          <a className="btn btn--primary" href={social?.linkedinUrl} target="_blank" rel="noreferrer">
            Connect
          </a>
        </div>
      </header>

      <div className="gridGlow" aria-hidden="true" />

      {/* ── Experience ──────────────────────────────────── */}
      <Section
        id="experience"
        title="Experience"
        subtitle="Two roles across firmware and backend — integrations, IoT, and scalable APIs."
      >
        <div className="timeline">
          {(profile?.experience || []).map((ex, idx) => (
            <TiltCard key={`${ex.company}-${idx}`} className="timeline__card">
              <div className="timeline__company">{ex.company}</div>
              <div className="timeline__role">{ex.role}</div>
              <div className="timeline__when">{formatWhen(ex)}</div>

              {ex.integrations?.length ? (
                <div className="timeline__integrations">
                  {ex.integrations.map((int) => (
                    <span key={int} className="integration-badge">{int}</span>
                  ))}
                </div>
              ) : null}

              {ex.achievements?.map((a, i) => (
                <div key={i} className="achievement-block">
                  <div className="achievement-title">{a.title}</div>
                  <ul className="achievement-points">
                    {a.points.map((pt, j) => (
                      <li key={j}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {ex.technologies?.length ? (
                <div className="tagRow">
                  {ex.technologies.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              ) : null}

              {ex.notes ? <div className="note">{ex.notes}</div> : null}
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* ── Education ───────────────────────────────────── */}
      <Section id="education" title="Education" subtitle="Engineering background in Computer Science.">
        <div className="eduRow">
          {(profile?.education || []).map((ed, idx) => (
            <TiltCard key={`${ed.school}-${idx}`} className="eduCard">
              <div className="eduCard__top">
                <div className="eduCard__school">{ed.school}</div>
                <div className="eduCard__years">{ed.startYear} – {ed.endYear}</div>
              </div>
              <div className="eduCard__degree">{ed.degree}</div>
              {ed.cgpa ? (
                <div className="eduCard__grade">CGPA {ed.cgpa.toFixed(2)}</div>
              ) : ed.percentage ? (
                <div className="eduCard__grade">{ed.percentage}%</div>
              ) : null}
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* ── Skills ──────────────────────────────────────── */}
      <Section
        id="skills"
        title="Skills"
        subtitle="Languages, backend systems, cloud, AI, and embedded hardware."
      >
        <div className="skillsGrid">
          {profile
            ? Object.entries(profile.skills.groups).map(([group, items]) => (
              <TiltCard key={group} className="skillGroup">
                <div className="skillGroup__title">{group}</div>
                <div className="skillGroup__items">
                  {items.map((s) => (
                    <span className="pill" key={s}>{s}</span>
                  ))}
                </div>
              </TiltCard>
            ))
            : null}
        </div>
      </Section>

      {/* ── Projects ────────────────────────────────────── */}
      <Section
        id="projects"
        title="Projects"
        subtitle="Shipped products with real users."
      >
        <div className="projectGrid">
          {(profile?.projects || []).map((p) => (
            <TiltCard key={p.name} className="projectCard">
              <div className="projectCard__header">
                <div className="projectCard__name">{p.name}</div>
              </div>
              <div className="projectCard__desc">{p.description}</div>

              {p.highlights?.length ? (
                <ul className="projectCard__highlights">
                  {p.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              ) : null}

              <div className="projectCard__links">
                <a className="linkBtn" href={p.url} target="_blank" rel="noreferrer">
                  <ExternalLink size={13} /> Live
                </a>
                <a className="linkBtn linkBtn--secondary" href={p.githubUrl} target="_blank" rel="noreferrer">
                  <Github size={13} /> GitHub
                </a>
              </div>

              {p.technologies?.length ? (
                <div className="tagRow">
                  {p.technologies.map((t, i) => <span className="tag" key={i}>{t}</span>)}
                </div>
              ) : null}
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* ── Programming Dashboards ──────────────────────── */}
      <Section
        id="dashboards"
        title="Competitive Programming"
        subtitle="Practice profiles across LeetCode, HackerRank, and GFG."
      >
        <div className="dashGrid">
          <TiltCard className="dashCard">
            <div className="dashCard__title">LeetCode</div>
            <div className="dashCard__meta">
              Handle: <span className="mono">{profile?.programmingDashboards?.leetcode?.handle || '—'}</span>
            </div>
            <a
              className="dashCard__link"
              href={profile?.programmingDashboards?.leetcode?.url || '#'}
              target="_blank"
              rel="noreferrer"
            >
              View Profile <ExternalLink size={12} />
            </a>
          </TiltCard>

          <TiltCard className="dashCard">
            <div className="dashCard__title">HackerRank</div>
            <div className="dashCard__meta">
              Username: <span className="mono">{profile?.programmingDashboards?.hackerrank?.username || '—'}</span>
            </div>
            <a
              className="dashCard__link"
              href={profile?.programmingDashboards?.hackerrank?.url || '#'}
              target="_blank"
              rel="noreferrer"
            >
              View Profile <ExternalLink size={12} />
            </a>
          </TiltCard>

          <TiltCard className="dashCard">
            <div className="dashCard__title">GeeksforGeeks</div>
            <div className="dashCard__meta">
              Username: <span className="mono">{profile?.programmingDashboards?.gfg?.username || '—'}</span>
            </div>
            <a
              className="dashCard__link"
              href={profile?.programmingDashboards?.gfg?.url || '#'}
              target="_blank"
              rel="noreferrer"
            >
              View Profile <ExternalLink size={12} />
            </a>
          </TiltCard>
        </div>
      </Section>

      {/* ── GitHub Stats ─────────────────────────────────── */}
      <Section id="github" title="GitHub Stats" subtitle="Public activity and top repositories.">
        <div className="githubGrid">
          <TiltCard className="githubCard">
            <div className="githubCard__row">
              <div className="githubCard__title">Overview</div>
              <Code size={16} />
            </div>
            {githubSummary ? (
              <div className="githubStats">
                <div className="stat">
                  <div className="stat__k">{githubSummary.publicRepos ?? 0}</div>
                  <div className="stat__l">Repos</div>
                </div>
                <div className="stat">
                  <div className="stat__k">{githubSummary.followers ?? 0}</div>
                  <div className="stat__l">Followers</div>
                </div>
                <div className="stat">
                  <div className="stat__k">{githubSummary.following ?? 0}</div>
                  <div className="stat__l">Following</div>
                </div>
              </div>
            ) : (
              <div className="muted" style={{ marginTop: 14 }}>Loading GitHub stats…</div>
            )}

            <div className="repoList">
              {(githubSummary?.repos || []).map((r) => (
                <a key={r.name} className="repoRow" href={r.html_url} target="_blank" rel="noreferrer">
                  <span className="repoRow__name">{r.name}</span>
                  <span className="repoRow__lang">{r.language || '—'}</span>
                  <span className="repoRow__stars">★ {r.stargazers}</span>
                </a>
              ))}
            </div>
          </TiltCard>

          <TiltCard className="contribCard">
            <div className="contribCard__title">Contributions</div>
            <iframe
              title="GitHub contributions"
              className="contribFrame"
              src={`https://github.com/users/${githubHandle}/contributions`}
            />
          </TiltCard>
        </div>
      </Section>

      {/* ── Resume ───────────────────────────────────────── */}
      <Section id="resume" title="Resume" subtitle="Download or view directly.">
        <div className="resumeGrid">
          {resumeUrl ? (
            <TiltCard className="resumeCard">
              <div className="resumeCard__title">Resume (PDF)</div>
              <div className="resumeCard__meta">One-click download</div>
              <a className="btn btn--primary" href={resumeUrl} target="_blank" rel="noreferrer">
                <Download size={14} /> Download PDF
              </a>
            </TiltCard>
          ) : null}

          <TiltCard className="resumeCard">
            <div className="resumeCard__title">AI Chat</div>
            <div className="resumeCard__meta">Ask the AI assistant anything about my background</div>
            <button className="btn btn--ghost" style={{ marginTop: 14 }} type="button">
              Try the chatbot ↗
            </button>
          </TiltCard>
        </div>
      </Section>

      {/* ── Contact ──────────────────────────────────────── */}
      <Section id="contact" title="Contact" subtitle="Let's build something great together.">
        <div className="contactGrid">
          <a className="contactTile" href={social?.linkedinUrl} target="_blank" rel="noreferrer">
            <Linkedin size={20} />
            <div className="contactTile__text">LinkedIn</div>
          </a>
          <a className="contactTile" href={social?.githubUrl} target="_blank" rel="noreferrer">
            <Github size={20} />
            <div className="contactTile__text">GitHub</div>
          </a>
          <a className="contactTile" href={social?.leetcodeUrl} target="_blank" rel="noreferrer">
            <Code size={20} />
            <div className="contactTile__text">LeetCode</div>
          </a>
          <a className="contactTile" href={social?.xUrl} target="_blank" rel="noreferrer">
            <Twitter size={20} />
            <div className="contactTile__text">X / Twitter</div>
          </a>
          <a
            className="contactTile"
            href={social?.email ? `mailto:${social.email}` : undefined}
          >
            <Mail size={20} />
            <div className="contactTile__text">Email</div>
          </a>
        </div>
      </Section>

      {/* ── Location ─────────────────────────────────────── */}
      <Section id="location" title="Location" subtitle="Based in Maharashtra, India.">
        <div className="mapWrap">
          <div className="mapHeader">
            <MapPin size={14} />
            <span>{mapsQuery}</span>
          </div>
          <iframe
            title="Google map"
            className="mapFrame"
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`}
            loading="lazy"
          />
        </div>
      </Section>

      {/* ── AI Chat Widget (always rendered, FAB controls open) */}
      <AIChatWidget />
    </div>
  )
}
