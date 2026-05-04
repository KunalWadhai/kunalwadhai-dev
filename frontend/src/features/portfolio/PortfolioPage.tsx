import { Github, Linkedin, Mail, Send, TerminalSquare, Twitter, Copy, Check } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AssistantPanel, FadeIn, Section } from './components'
import { NAV_ITEMS, READINESS_AREAS, TESTIMONIALS } from './constants'
import { usePortfolioData } from './hooks'
import { formatMonthYear, normalizeUrl } from './utils'
import './portfolio.css'

export default function PortfolioPage() {
  const { data, githubSummary, githubHandle, state } = usePortfolioData()
  const [copied, setCopied] = useState(false)
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

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(data.social.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="page">
      <a className="skip-link" href="#experience">Skip to content</a>
      <header className="hero">
        <nav className="topbar">
          <strong>{data.name}</strong>
          <div>
            {NAV_ITEMS.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <FadeIn className="hero-body">
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

      <Section id="experience" title="Experience" subtitle="Detailed production work and engineering impact.">
        <div className="stack">
          {data.experience.map((exp) => (
            <article className="card" key={`${exp.company}-${exp.role}`}>
              <div className="card-head">
                <h3>{exp.company}</h3>
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

      <Section id="coding" title="Coding Profiles" subtitle="Platform profiles fetched from backend profile data.">
        <div className="grid three">
          <a className="card link-card" href={normalizeUrl(data.programmingDashboards?.leetcode?.url)} target="_blank" rel="noreferrer">
            <h3>LeetCode</h3>
            <p>@{data.programmingDashboards?.leetcode?.handle || 'lost_war'}</p>
          </a>
          <a className="card link-card" href={normalizeUrl(data.programmingDashboards?.hackerrank?.url)} target="_blank" rel="noreferrer">
            <h3>HackerRank</h3>
            <p>@{data.programmingDashboards?.hackerrank?.username || 'Kunal_Wadhai'}</p>
          </a>
          <a className="card link-card" href={normalizeUrl(data.programmingDashboards?.gfg?.url)} target="_blank" rel="noreferrer">
            <h3>GeeksforGeeks</h3>
            <p>@{data.programmingDashboards?.gfg?.username || 'alone_warrior_11011'}</p>
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
