export type Achievement = {
  title: string
  points: string[]
}

export type Experience = {
  company: string
  role: string
  start: string
  end: string | null
  technologies: string[]
  achievements: Achievement[]
}

export type SocialLinks = {
  linkedinUrl: string
  githubUrl: string
  githubHandle?: string
  leetcodeUrl: string
  xUrl: string
  email: string
}

export type Project = {
  name: string
  url: string
  githubUrl: string
  description: string
  technologies: string[]
}

export type ProgrammingDashboards = {
  leetcode?: { handle: string; url?: string }
  hackerrank?: { username: string | null; url?: string }
  gfg?: { username: string | null; url?: string }
}

export type Profile = {
  name: string
  title: string
  bio?: string
  social: SocialLinks
  skills: { groups: Record<string, string[]> }
  education: Array<{ cgpa?: number }>
  experience: Experience[]
  projects: Project[]
  resume: { pdfUrl: string }
  programmingDashboards?: ProgrammingDashboards
}

export type GitHubRepo = {
  name: string
  html_url: string
  language: string | null
  stargazers: number
}

export type GitHubSummary = {
  publicRepos: number
  followers: number
  following: number
  repos: GitHubRepo[]
}

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}
