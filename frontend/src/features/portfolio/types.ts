export type Achievement = {
  title: string
  points: string[]
  metric?: string
}

export type Experience = {
  company: string
  role: string
  start: string
  end: string | null
  technologies: string[]
  achievements: Achievement[]
  logoUrl?: string
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
  leetcode?: { handle: string; url?: string; logoUrl?: string }
  hackerrank?: { username: string | null; url?: string; logoUrl?: string }
  gfg?: { username: string | null; url?: string; logoUrl?: string }
}

export type CodingStats = {
  leetcode?: {
    handle: string
    totalSolved: number
    solvedBreakdown: { easy: number; medium: number; hard: number }
    ranking?: number | null
    lastVerified?: string
    contest?: {
      rating?: number | null
      globalRanking?: number | null
      topPercentage?: number | null
      attendedContests?: number | null
    } | null
    calendar?: {
      totalActiveDays: number
      streak: number
      submissionCalendar: string
    } | null
  }
  gfg?: {
    username: string
    solved?: number
    score?: number
    streak?: string
    lastVerified?: string
  }
  hackerrank?: {
    username: string
    badges?: string[]
    stars?: number
    lastVerified?: string
  }
}

export type About = {
  headline?: string
  summary: string
  focus: string[]
  values: string[]
  approach?: string[]
}

export type Profile = {
  name: string
  title: string
  bio?: string
  about?: About
  location?: string
  social: SocialLinks
  skills: { groups: Record<string, string[]> }
  education: Array<{ cgpa?: number }>
  experience: Experience[]
  projects: Project[]
  resume: { pdfUrl: string }
  programmingDashboards?: ProgrammingDashboards
  codingStats?: CodingStats
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
  timestamp?: string
}
