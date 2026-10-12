import type { Profile } from './types'

export const DEFAULT_PROFILE: Profile = {
  name: 'Kunal Wadhai',
  title: 'Backend Engineer',
  bio: 'I build production backend systems, APIs, integrations and infrastructure with TypeScript, Node.js and AWS.',
  social: {
    linkedinUrl: 'https://www.linkedin.com/in/kunal-wadhai/',
    githubUrl: 'https://github.com/KunalWadhai',
    githubHandle: 'KunalWadhai',
    leetcodeUrl: 'https://leetcode.com/u/KunalWadhai11011/',
    xUrl: 'https://x.com/AloneWarrior27',
    email: 'kunalwadhai456@gmail.com',
  },
  skills: {
    groups: {
      Backend: ['Node.js', 'TypeScript', 'Express', 'REST APIs', 'Microservices'],
      Data: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis'],
      Infrastructure: ['AWS', 'Docker', 'CI/CD', 'CloudWatch', 'Linux'],
    },
  },
  education: [{ cgpa: 8.53 }],
  experience: [
    {
      company: 'Guestara',
      role: 'Backend Engineer',
      start: '2024-11',
      end: 'Present',
      technologies: ['Node.js', 'TypeScript', 'Redis', 'PostgreSQL', 'MongoDB', 'AWS SQS', 'CloudWatch'],
      achievements: [
        {
          title: '',
          points: [
            'Built PMS integrations with Beds24, Ezee, and Hotelogix, aggregating bookings from multiple OTAs into a unified booking layer with real-time room and guest sync.',
            'Engineered automated room allocation for Beds24 that selects optimal rooms based on availability and booking constraints, eliminating manual assignment overhead.',
            'Developed a financial sync pipeline with Hotelogix to propagate upsell and payment data, ensuring consistency between the property system and the Guestara platform.',
            'Designed a Tuya IoT smart lock system that generates time-bound digital passcodes and manages device lifecycle via Pulsar event streaming, triggered by the booking flow.',
            'Built data-heavy dashboard APIs unifying guest, booking, payment and occupancy data for real-time operational views.',
            'Implemented Redis-backed rolling-window monitoring for critical APIs with threshold-based alerting, reducing mean time to detect recurring production failures.',
          ],
        },
      ],
    },
    {
      company: 'Zoho',
      role: 'Firmware Engineering Intern',
      start: '2025-01',
      end: '2025-04',
      technologies: ['Linux', 'Shell Scripting', 'C', 'Yocto Project', 'OpenBMC', 'Raspberry Pi', 'BeagleBone Black'],
      achievements: [
        {
          title: '',
          points: [
            'Worked on OpenBMC firmware for server hardware management, gaining hands-on exposure to IPMI and BMC lifecycle workflows.',
            'Built and customized Yocto-based Linux images for Raspberry Pi and BeagleBone Black, managing layer configuration and cross-compilation.',
            'Automated firmware build and deployment operations with shell scripts, cutting manual build steps from the pipeline.',
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
      description:
        'RAG-powered customer support platform. Organizations upload documentation; the system generates an embeddable chat widget backed by a vector search pipeline that resolves support queries without human escalation. Built on a microservices architecture with per-org data isolation.',
      technologies: ['Next.js 14', 'TypeScript', 'FastAPI', 'LangChain', 'PostgreSQL', 'Qdrant', 'Redis', 'Docker', 'BullMQ'],
    },
    {
      name: 'foodSnatch',
      url: 'https://foodsnatch.onrender.com',
      githubUrl: 'https://github.com/KunalWadhai/foodSnatch',
      description:
        'Short-video food reel platform. Food partners upload video content via ImageKit CDN; users browse a TikTok-style feed with likes and saves. Implements separate partner and user JWT auth flows, HTTP-only cookie sessions, and Dockerized deployment on Render.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'ImageKit', 'Docker', 'JWT'],
    },
  ],
  resume: { pdfUrl: 'https://drive.google.com/uc?export=download&id=17PSerWGj5S0aRT2TZJnEf_FtyOr91hCA' },
  programmingDashboards: {
    leetcode: { handle: 'KunalWadhai11011', url: 'https://leetcode.com/u/KunalWadhai11011/' },
    hackerrank: { username: 'Kunal_Wadhai', url: 'https://www.hackerrank.com/profile/Kunal_Wadhai' },
    gfg: { username: 'alone_warrior_11011', url: 'https://www.geeksforgeeks.org/profile/alone_warrior_11011' },
  },
}

export const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'github', label: 'GitHub' },
  { id: 'coding', label: 'Coding' },
  { id: 'contact', label: 'Contact' },
] as const

export const NAV_SECTION_IDS = NAV_ITEMS.map((n) => n.id)

/** Per-project engineering metadata (role, key areas) */
export const PROJECT_META: Record<string, { role: string; areas: string[] }> = {
  'SupportIQ AI': {
    role: 'Full-stack',
    areas: ['API design', 'RAG pipeline', 'Vector search', 'Queue processing', 'Multi-tenancy'],
  },
  'foodSnatch': {
    role: 'Full-stack',
    areas: ['Authentication', 'Media pipeline', 'Feed API', 'Data modeling', 'Containerisation'],
  },
}

export const PROJECT_ARCH: Record<
  string,
  {
    nodes: readonly { id: string; label: string; sub: string; x: number; y: number }[]
    edges: readonly { from: string; to: string }[]
  }
> = {
  'SupportIQ AI': {
    nodes: [
      { id: 'client', label: 'Next.js Dashboard', sub: 'React · TypeScript', x: 30, y: 8 },
      { id: 'widget', label: 'Chat Widget', sub: 'Embeddable · SSE', x: 70, y: 8 },
      { id: 'gateway', label: 'API Gateway', sub: 'Node.js · Express · JWT · BullMQ', x: 50, y: 35 },
      { id: 'ai', label: 'AI Service', sub: 'FastAPI · LangChain', x: 25, y: 62 },
      { id: 'worker', label: 'Ingestion Worker', sub: 'BullMQ · PDF/DOCX parser', x: 75, y: 62 },
      { id: 'data', label: 'Data Layer', sub: 'PostgreSQL · Qdrant · Redis', x: 50, y: 88 },
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
      { id: 'frontend', label: 'React SPA', sub: 'Vite · Tailwind', x: 50, y: 8 },
      { id: 'api', label: 'Express API', sub: 'JWT Auth · REST', x: 50, y: 35 },
      { id: 'auth', label: 'Auth Layer', sub: 'User + Partner · HTTP-only cookies', x: 22, y: 62 },
      { id: 'media', label: 'ImageKit CDN', sub: 'Video upload · streaming', x: 78, y: 62 },
      { id: 'db', label: 'MongoDB Atlas', sub: 'Users · Reels · Likes', x: 50, y: 88 },
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

export const TERMINAL_LINES = [
  { text: '$ node server.ts', type: 'cmd' as const, delay: 0 },
  { text: '✓ PostgreSQL connected [pool:10]', type: 'ok' as const, delay: 400 },
  { text: '✓ Redis cache warmed', type: 'ok' as const, delay: 700 },
  { text: '✓ API routes loaded (15)', type: 'ok' as const, delay: 1000 },
  { text: '✓ SQS consumer started', type: 'ok' as const, delay: 1300 },
  { text: '⚡ Server running on :4000', type: 'ok' as const, delay: 1600 },
] as const
