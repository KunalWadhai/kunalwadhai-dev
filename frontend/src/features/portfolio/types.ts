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

export type LeetCodeSolved = {
  total: number
  easy: number
  medium: number
  hard: number
}

export type LeetCodeContest = {
  rating: number
  globalRanking: number | null
  topPercentage: number | null
  attendedContestsCount: number
}

export type LeetCodeContestEntry = {
  title: string
  startTime: number
  rating: number
  ranking: number | null
  trend: string | null
}

export type LeetCodeActivityDay = {
  date: string
  count: number
}

export type LeetCodeStats = {
  handle: string
  profileUrl: string
  solved: LeetCodeSolved
  ranking: number | null
  reputation: number
  starRating: number | null
  streak: number
  totalActiveDays: number
  activeYears: number[]
  contest: LeetCodeContest
  contestHistory: LeetCodeContestEntry[]
  activity: LeetCodeActivityDay[]
  fetchedAt: string
}

export type CodingPlatform = {
  id: 'leetcode' | 'hackerrank' | 'gfg'
  label: string
  handle: string
  url: string
  accent: string
}
