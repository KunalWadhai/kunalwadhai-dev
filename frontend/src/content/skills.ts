/**
 * Skills — Capability matrix (rows = areas, chips = tech, links to demos)
 * Grouped by résumé Section 3 grouping
 */

export interface SkillGroup {
  id: string
  category: string
  skills: Skill[]
}

export interface Skill {
  name: string
  /** Case study slug this skill links to (for demonstration) */
  demo?: string
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    category: 'Languages',
    skills: [
      { name: 'JavaScript', demo: 'smart-lock-provisioning' },
      { name: 'TypeScript', demo: 'smart-lock-provisioning' },
      { name: 'Java' },
      { name: 'C++' },
      { name: 'SQL', demo: 'reservation-state-machine' },
      { name: 'Python' },
    ],
  },
  {
    id: 'application',
    category: 'Application',
    skills: [
      { name: 'React', demo: 'shared-platform-library' },
      { name: 'Node.js', demo: 'smart-lock-provisioning' },
      { name: 'Express', demo: 'pms-webhook-ingestion' },
      { name: 'REST APIs', demo: 'smart-lock-provisioning' },
      { name: 'Microservices', demo: 'shared-platform-library' },
      { name: 'Event-driven architecture', demo: 'pms-webhook-ingestion' },
    ],
  },
  {
    id: 'data',
    category: 'Data',
    skills: [
      { name: 'MongoDB', demo: 'pms-webhook-ingestion' },
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
      { name: 'Redis', demo: 'service-health-tracing' },
      { name: 'OpenSearch', demo: 'pms-webhook-ingestion' },
    ],
  },
  {
    id: 'cloud-delivery',
    category: 'Cloud and delivery',
    skills: [
      { name: 'AWS Lambda', demo: 'pms-webhook-ingestion' },
      { name: 'AWS SQS' },
      { name: 'AWS EC2' },
      { name: 'AWS IAM' },
      { name: 'CloudWatch', demo: 'service-health-tracing' },
      { name: 'Docker' },
      { name: 'GitHub Actions' },
      { name: 'Serverless Framework', demo: 'pms-webhook-ingestion' },
      { name: 'Linux' },
      { name: 'Git' },
    ],
  },
  {
    id: 'security',
    category: 'Security',
    skills: [
      { name: 'AES encryption', demo: 'smart-lock-provisioning' },
      { name: 'HMAC-SHA256', demo: 'smart-lock-provisioning' },
      { name: 'JWT' },
      { name: 'OAuth 2.0' },
    ],
  },
  {
    id: 'ai-llm',
    category: 'AI/LLM',
    skills: [
      { name: 'RAG' },
      { name: 'LangChain' },
      { name: 'OpenAI API' },
      { name: 'Vector databases' },
    ],
  },
  {
    id: 'foundations',
    category: 'Foundations',
    skills: [
      { name: 'Data structures & algorithms' },
      { name: 'Object-oriented programming' },
      { name: 'Operating systems' },
      { name: 'Database management systems' },
      { name: 'Computer networks' },
      { name: 'System design' },
    ],
  },
] satisfies SkillGroup[]
