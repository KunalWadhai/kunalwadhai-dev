export function normalizeUrl(url: string | undefined) {
  if (!url) return '#'
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

export function formatMonthYear(raw: string | null | undefined) {
  if (!raw) return 'Present'
  const [year, month] = raw.split('-')
  if (!month) return year
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function deriveGithubHandle(githubUrl?: string, explicitHandle?: string) {
  if (explicitHandle?.trim()) return explicitHandle.trim()
  if (!githubUrl) return ''
  const parts = githubUrl.split('/').filter(Boolean)
  return parts.at(-1) ?? ''
}
