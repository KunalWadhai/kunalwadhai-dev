import type { Profile } from './types'

export const DEFAULT_PROFILE: Profile = {
  name: 'Kunal Wadhai',
  title: 'Backend Engineer',
  bio: 'Specializing in distributed architecture, high-throughput APIs, and the invisible infrastructure behind great products.',
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
      'Core Backend': ['Node.js', 'TypeScript', 'Express', 'FastAPI'],
      'Data & Infra': ['PostgreSQL', 'Redis', 'Docker', 'AWS', 'Kafka'],
      'Tooling & Practice': ['Git', 'CI/CD', 'REST', 'GraphQL', 'Microservices'],
    },
  },
  education: [{ cgpa: 8.53 }],
  experience: [
    {
      company: 'Guestara',
      role: 'Backend Engineer',
      start: '2024-11',
      end: 'Present',
      technologies: ['Node.js', 'Express.js', 'Redis', 'Postgres', 'MongoDB', 'CloudWatch'],
      achievements: [
        {
          title: 'PMS Integrations & Sync',
          points: [
            'Built PMS integrations with Beds24, Ezee, and Hotelogix for real-time booking sync.',
            'Maintained real-time booking and room synchronization across distributed systems.',
            'Resolved critical production sync issues and booking mismatches under SLA.',
            'Built Tuya smart-lock passcode generation and lifecycle orchestration.',
          ],
        },
      ],
    },
    {
      company: 'Zoho',
      role: 'Firmware Engineering Intern',
      start: '2025-01',
      end: '2025-04',
      technologies: ['Linux', 'Shell Scripting', 'Yocto Project', 'OpenBMC', 'Raspberry Pi'],
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
  ],
  projects: [
    {
      name: 'SupportIQ AI',
      url: '',
      githubUrl: 'https://github.com/KunalWadhai/SupportIQ.ai',
      description: 'RAG-powered customer support platform — upload docs, get an embeddable AI chat widget, resolve 80% of support tickets automatically. Full microservices architecture with per-org data isolation.',
      technologies: ['Next.js 14', 'TypeScript', 'FastAPI', 'LangChain', 'PostgreSQL', 'Qdrant', 'Redis', 'Docker'],
    },
    {
      name: 'foodSnatch',
      url: 'https://foodsnatch.onrender.com',
      githubUrl: 'https://github.com/KunalWadhai/foodSnatch',
      description: 'Short-video food reels platform — food partners upload video reels via ImageKit, users browse a TikTok-style feed with like/save. JWT auth with HTTP-only cookies, separate partner & user flows, Dockerized deployment.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'ImageKit', 'Docker'],
    },
  ],
  resume: { pdfUrl: 'https://drive.google.com/uc?export=download&id=17PSerWGj5S0aRT2TZJnEf_FtyOr91hCA' },
  programmingDashboards: {
    leetcode: { handle: 'lost_war', url: 'https://leetcode.com/u/lost_war/' },
    hackerrank: { username: 'Kunal_Wadhai', url: 'https://www.hackerrank.com/profile/Kunal_Wadhai' },
    gfg: { username: 'alone_warrior_11011', url: 'https://www.geeksforgeeks.org/profile/alone_warrior_11011' },
  },
}

export const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const

export const SKILLS_DATA = {
  'Core Backend': [
    { name: 'Node.js', level: 3 },
    { name: 'TypeScript', level: 3 },
    { name: 'Express', level: 3 },
    { name: 'FastAPI', level: 2 },
  ],
  'Data & Infra': [
    { name: 'PostgreSQL', level: 3 },
    { name: 'Redis', level: 3 },
    { name: 'Docker', level: 2 },
    { name: 'AWS', level: 2 },
    { name: 'Kafka', level: 1 },
  ],
  'Tooling & Practice': [
    { name: 'Git', level: 3 },
    { name: 'CI/CD', level: 2 },
    { name: 'REST', level: 3 },
    { name: 'GraphQL', level: 2 },
    { name: 'Microservices', level: 2 },
  ],
} as const

export const LEARNING_ITEMS = ['Genrative AI', 'Large Language Models', 'MCP Protocol'] as const

export const TESTIMONIALS = [
  {
    quote: 'Kunal consistently solved integration edge cases under pressure and improved our production reliability with clean backend architecture decisions.',
    author: 'Engineering Lead',
    org: 'Hospitality SaaS',
  },
  {
    quote: 'Strong systems thinking. He balances delivery speed with maintainability and quickly debugs high-impact incidents in distributed flows.',
    author: 'Product Manager',
    org: 'Guest Operations Platform',
  },
]

export const TERMINAL_LINES = [
  { text: '$ node server.ts', type: 'cmd' as const, delay: 0 },
  { text: '✓ PostgreSQL connected [pool:10]', type: 'ok' as const, delay: 400 },
  { text: '✓ Redis cache warmed', type: 'ok' as const, delay: 700 },
  { text: '✓ API routes loaded (15)', type: 'ok' as const, delay: 1000 },
  { text: '✓ WebSocket server ready', type: 'ok' as const, delay: 1300 },
  { text: '⚡ Server running on :4000', type: 'ok' as const, delay: 1600 },
  { text: '', type: 'default' as const, delay: 1900 },
  { text: '> 847 requests/sec', type: 'stat' as const, delay: 2200 },
  { text: '> avg latency: 12ms', type: 'stat' as const, delay: 2500 },
  { text: '> uptime: 99.98%', type: 'stat' as const, delay: 2800 },
]

export const STAT_ITEMS = [
  { value: '2+', label: 'Years Engineering' },
  { value: '100+', label: 'APIs Shipped' },
  { value: '∞', label: 'Coffees Consumed' },
]

export const ABOUT_JSON = {
  name: 'Kunal Wadhai',
  role: 'Backend Engineer',
  company: 'Guestara',
  stack: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis'],
  currently: 'Building PMS integrations at scale',
}

export const PROJECT_ARCH: Record<string, {
  nodes: readonly { id: string; label: string; sub: string; x: number; y: number }[]
  edges: readonly { from: string; to: string }[]
}> = {
  'SupportIQ AI': {
    nodes: [
      { id: 'client', label: 'Next.js Dashboard', sub: 'React · TypeScript · Tailwind', x: 50, y: 8 },
      { id: 'widget', label: 'Chat Widget', sub: 'Embeddable · SSE Stream', x: 80, y: 8 },
      { id: 'gateway', label: 'API Gateway', sub: 'Node.js · Express · JWT · BullMQ', x: 50, y: 32 },
      { id: 'ai', label: 'AI Service', sub: 'FastAPI · LangChain · GPT-4o', x: 25, y: 56 },
      { id: 'worker', label: 'Ingestion Worker', sub: 'BullMQ · PDF/DOCX Parser', x: 75, y: 56 },
      { id: 'data', label: 'Data Layer', sub: 'PostgreSQL · Qdrant · Redis · MinIO', x: 50, y: 80 },
    ],
    edges: [
      { from: 'client', to: 'gateway' },
      { from: 'widget', to: 'gateway' },
      { from: 'gateway', to: 'ai' },
      { from: 'gateway', to: 'worker' },
      { from: 'ai', to: 'data' },
      { from: 'worker', to: 'ai' },
      { from: 'worker', to: 'data' },
    ],
  },
  'foodSnatch': {
    nodes: [
      { id: 'frontend', label: 'React SPA', sub: 'Vite · Tailwind · Framer Motion', x: 50, y: 8 },
      { id: 'api', label: 'Express API', sub: 'JWT Auth · REST · Multer', x: 50, y: 32 },
      { id: 'auth', label: 'Auth Layer', sub: 'User + Partner JWT · Cookies', x: 25, y: 56 },
      { id: 'media', label: 'ImageKit CDN', sub: 'Video Upload · Streaming', x: 75, y: 56 },
      { id: 'db', label: 'MongoDB Atlas', sub: 'Mongoose · Users · Reels · Likes', x: 50, y: 80 },
    ],
    edges: [
      { from: 'frontend', to: 'api' },
      { from: 'api', to: 'auth' },
      { from: 'api', to: 'media' },
      { from: 'auth', to: 'db' },
      { from: 'media', to: 'db' },
      { from: 'api', to: 'db' },
    ],
  },
}
