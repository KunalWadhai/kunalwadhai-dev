import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

/**
 * Skills section — grouped tag-cloud layout.
 * Each group has a coloured accent, a category label, and pill tags.
 * Inspired by the reference screenshot: dense, scannable, no progress bars.
 */

interface SkillGroup {
  id: string
  category: string
  /** Emoji icon shown next to the category label */
  icon: string
  /** CSS var or hex for the group accent colour */
  accent: string
  tags: string[]
  hot?: boolean
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'backend',
    category: 'Backend Development',
    icon: '⚙️',
    accent: 'var(--accent)',
    hot: true,
    tags: [
      'Node.js',
      'TypeScript',
      'JavaScript',
      'Express.js',
      'REST APIs',
      'Microservices',
      'API Design',
      'Webhooks',
      'Rate Limiting',
      'JWT Auth',
    ],
  },
  {
    id: 'data',
    category: 'Databases & Caching',
    icon: '🗄️',
    accent: '#22c55e',
    tags: [
      'PostgreSQL',
      'MongoDB',
      'MySQL',
      'Redis',
      'Data Modeling',
      'Indexing',
      'Query Optimisation',
      'Aggregation Pipelines',
    ],
  },
  {
    id: 'infra',
    category: 'Cloud & Infrastructure',
    icon: '☁️',
    accent: '#f59e0b',
    tags: [
      'AWS',
      'AWS Lambda',
      'AWS SQS',
      'CloudWatch',
      'Docker',
      'CI/CD',
      'Linux',
      'Nginx',
      'Environment Config',
    ],
  },
  {
    id: 'async',
    category: 'Messaging & Async',
    icon: '📨',
    accent: '#a78bfa',
    tags: [
      'SQS',
      'BullMQ',
      'Apache Pulsar',
      'Background Jobs',
      'Event-Driven',
      'Retry Logic',
      'Dead-Letter Queues',
    ],
  },
  {
    id: 'observability',
    category: 'Observability & Reliability',
    icon: '📡',
    accent: '#38bdf8',
    tags: [
      'CloudWatch Logs',
      'Alerting',
      'Monitoring',
      'Error Tracking',
      'Health Checks',
      'Rolling-Window Metrics',
      'OpenSearch',
    ],
  },
  {
    id: 'integrations',
    category: 'Integrations',
    icon: '🔌',
    accent: '#fb7185',
    tags: [
      'Beds24',
      'Ezee',
      'Hotelogix',
      'Tuya IoT',
      'OTA Sync',
      'PMS Integration',
      'Third-Party APIs',
      'Webhook Handlers',
    ],
  },
  {
    id: 'frontend',
    category: 'Frontend',
    icon: '🖥️',
    accent: '#34d399',
    tags: [
      'React',
      'Next.js',
      'HTML',
      'CSS',
      'Vite',
      'TypeScript',
    ],
  },
  {
    id: 'languages',
    category: 'Languages',
    icon: '💬',
    accent: '#c084fc',
    tags: [
      'TypeScript',
      'JavaScript',
      'C/C++',
      'Java',
      'Python',
      'Shell',
    ],
  },
  {
    id: 'tools',
    category: 'Tooling & Practice',
    icon: '🛠️',
    accent: '#fbbf24',
    tags: [
      'Git',
      'GitHub',
      'GitLab',
      'Postman',
      'OpenAPI',
      'ESLint',
      'Code Review',
      'Agile',
    ],
  },
  {
    id: 'exploring',
    category: 'Currently Exploring',
    icon: '🔭',
    accent: '#818cf8',
    tags: [
      'LLM Tooling',
      'Model Context Protocol',
      'LangChain',
      'Generative AI',
      'RAG Pipelines',
      'Vector Databases',
    ],
  },
]

export function SkillsSection() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeader
          label="Skills"
          title="What I work with"
          description="Technologies grouped by concern — not sorted by how they look on a résumé."
        />

        <div className="skillcloud-grid">
          {SKILL_GROUPS.map((group, i) => (
            <Reveal key={group.id} delay={0.04 * i}>
              <div
                className="skillcloud-group"
                style={{ '--group-accent': group.accent } as React.CSSProperties}
              >
                <div className="skillcloud-group__header">
                  <span className="skillcloud-group__icon" aria-hidden="true">
                    {group.icon}
                  </span>
                  <h3 className="skillcloud-group__title">{group.category}</h3>
                  {group.hot && (
                    <span className="skillcloud-group__hot" aria-label="Hot skills">
                      HOT SKILLS
                    </span>
                  )}
                </div>

                <div className="skillcloud-group__tags" role="list" aria-label={group.category}>
                  {group.tags.map((tag) => (
                    <span key={tag} className="skillcloud-tag" role="listitem">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
