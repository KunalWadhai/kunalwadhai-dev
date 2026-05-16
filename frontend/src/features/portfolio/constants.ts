import type { Profile } from './types'

export const DEFAULT_PROFILE: Profile = {
  name: 'Kunal Wadhai',
  title: 'Backend Engineer',
  bio: 'Backend Engineer focused on scalable systems, integrations, and production reliability.',
  location: 'Yavatmal, Maharashtra, India',
  about: {
    headline: 'I build backend systems that stay calm under pressure.',
    summary:
      'I design pragmatic APIs and integration layers that keep real-world systems in sync. My focus is dependable data flow, observability, and making backend work feel effortless for product teams.',
    focus: ['Reliable integrations', 'Event-driven sync', 'Production observability'],
    values: ['Clear APIs', 'Measured reliability', 'Human-readable systems'],
    approach: ['Async-first debugging', 'Contract-driven integrations', 'Metric-driven deployments'],
  },
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
      'Cloud/Observability': ['Amazon CloudWatch', 'Docker', 'GitHub Actions', 'Nginx', 'PM2', 'Webhook monitoring', 'Uptime Kuma'],
      'AI/Generative AI': ['OpenAI API', 'LangChain', 'RAG pipelines', 'Vector DBs', 'Qdrant', 'Prompt engineering', 'OpenAI SDK'],
      'Systems & Embedded/Hardware': ['Linux', 'OpenBMC', 'Yocto Project', 'Raspberry Pi'],
    },
  },
  education: [{ cgpa: 8.53 }],
  experience: [
    {
      company: 'Zoho',
      logoUrl: '/logos/companies/zoho.svg',
      role: 'Firmware Engineering Intern / Project Trainee',
      start: '2025-01',
      end: '2025-04',
      technologies: ['Linux', 'Shell Scripting', 'Yocto Project', 'OpenBMC', 'Raspberry Pi'],
      achievements: [
        {
          title: 'Embedded Systems',
          metric: '2 embedded platforms',
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
      logoUrl: '/logos/companies/guestara.svg',
      role: 'Backend Engineering Intern -> Full Time',
      start: '2024-11',
      end: 'Present',
      technologies: ['Node.js', 'Express.js', 'Redis', 'Postgres', 'MongoDB', 'CloudWatch'],
      achievements: [
        {
          title: 'PMS Integrations & Sync',
          metric: '3 PMS integrations',
          points: [
            'Built PMS integrations with Beds24, Ezee, and Hotelogix.',
            'Maintained real-time booking and room synchronization.',
            'Resolved critical production sync issues and booking mismatches.',
            'Built Tuya smart-lock passcode generation and lifecycle orchestration.',
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
  resume: { pdfUrl: 'https://drive.google.com/uc?export=download&id=17PSerWGj5S0aRT2TZJnEf_FtyOr91hCA' },
  programmingDashboards: {
    leetcode: { handle: 'lost_war', url: 'https://leetcode.com/u/lost_war/', logoUrl: '/logos/platforms/leetcode.svg' },
    hackerrank: { username: 'Kunal_Wadhai', url: 'https://www.hackerrank.com/profile/Kunal_Wadhai', logoUrl: '/logos/platforms/hackerrank.svg' },
    gfg: { username: 'alone_warrior_11011', url: 'https://www.geeksforgeeks.org/profile/alone_warrior_11011', logoUrl: '/logos/platforms/gfg.svg' },
  },
}

export const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'coding', label: 'Coding' },
  { id: 'github', label: 'GitHub' },
  { id: 'readiness', label: 'Readiness' },
  { id: 'testimonials', label: 'Reviews' },
  { id: 'assistant', label: 'AI' },
  { id: 'faq', label: 'FAQ' },
] as const

export const TESTIMONIALS = [
  {
    quote:
      'Kunal consistently solved integration edge cases under pressure and improved our production reliability with clean backend architecture decisions.',
    author: 'Engineering Lead',
    org: 'Hospitality SaaS',
    title: 'Engineering Lead',
  },
  {
    quote:
      'Strong systems thinking. He balances delivery speed with maintainability and quickly debugs high-impact incidents in distributed flows.',
    author: 'Product Manager',
    org: 'Guest Operations Platform',
    title: 'Product Manager',
  },
  {
    quote:
      'Dependable under pressure. Clear API contracts, fast incident response, and a pragmatic approach to scale.',
    author: 'Tech Lead',
    org: 'SaaS Platform',
    title: 'Tech Lead',
  },
]

export const READINESS_AREAS = [
  {
    title: 'Production Reliability',
    detail: 'Error handling, observability-first debugging, and resilient data synchronization across integrated systems.',
  },
  {
    title: 'Architecture & APIs',
    detail: 'Contract-driven API design, service boundaries, and pragmatic modular backend structures for scale.',
  },
  {
    title: 'Global Collaboration',
    detail: 'Clear technical communication, well-documented decisions, and ownership in multi-team delivery workflows.',
  },
]
