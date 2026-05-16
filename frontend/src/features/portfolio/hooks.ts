import { useEffect, useMemo, useState } from 'react'
import { apiGet } from '../../lib/api'
import { DEFAULT_PROFILE } from './constants'
import type { CodingStats, GitHubSummary, Profile } from './types'
import { deriveGithubHandle } from './utils'

type DataState = 'idle' | 'loading' | 'ready' | 'error'

export function usePortfolioData() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [githubSummary, setGithubSummary] = useState<GitHubSummary | null>(null)
  const [codingStats, setCodingStats] = useState<CodingStats | null>(null)
  const [codingState, setCodingState] = useState<DataState>('idle')
  const [codingSource, setCodingSource] = useState<'live' | 'snapshot' | 'none'>('none')
  const [state, setState] = useState<DataState>('idle')

  useEffect(() => {
    let active = true
    setState('loading')

    apiGet('/api/profile')
      .then((response) => {
        if (!active) return
        setProfile(response as Profile)
        setState('ready')
      })
      .catch(() => {
        if (!active) return
        setProfile(DEFAULT_PROFILE)
        setState('error')
      })

    return () => {
      active = false
    }
  }, [])

  const data = profile ?? DEFAULT_PROFILE
  const githubHandle = useMemo(
    () => deriveGithubHandle(data.social.githubUrl, data.social.githubHandle) || 'KunalWadhai',
    [data.social.githubHandle, data.social.githubUrl]
  )

  useEffect(() => {
    let active = true
    if (!githubHandle) return

    fetchGithubSummary(githubHandle)
      .then((summary) => {
        if (!active) return
        setGithubSummary(summary)
      })
      .catch(() => {
        if (!active) return
        setGithubSummary(null)
      })

    return () => {
      active = false
    }
  }, [githubHandle])

  useEffect(() => {
    let active = true
    const leetcodeHandle = data.programmingDashboards?.leetcode?.handle
    if (!leetcodeHandle) {
      setCodingState('error')
      setCodingStats(null)
      setCodingSource('none')
      return () => {
        active = false
      }
    }

    fetchLeetCodeStats(leetcodeHandle, null, setCodingStats, setCodingState, setCodingSource, active)

    return () => {
      active = false
    }
  }, [data.codingStats, data.programmingDashboards?.leetcode?.handle])

  const refreshCodingStats = async () => {
    const handle = data.programmingDashboards?.leetcode?.handle
    if (!handle) return
    await fetchLeetCodeStats(handle, null, setCodingStats, setCodingState, setCodingSource, true)
  }

  return { data, githubSummary, githubHandle, codingStats, codingState, codingSource, refreshCodingStats, state }
}

async function fetchLeetCodeStats(
  handle: string,
  fallback: CodingStats | undefined,
  setStats: (value: CodingStats | null) => void,
  setState: (value: DataState) => void,
  setSource: (value: 'live' | 'snapshot' | 'none') => void,
  active: boolean
) {
  if (!active) return
  setState('loading')

  try {
    const response = await apiGet(`/api/coding/leetcode?username=${encodeURIComponent(handle)}`)
    if (!active) return
    const { ok, ...stats } = response as Record<string, unknown>
    const payload = stats as CodingStats['leetcode']
    setStats({ leetcode: payload })
    setSource('live')
    setState('ready')
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('leetcode-snapshot', JSON.stringify({ payload, savedAt: new Date().toISOString() }))
    }
  } catch {
    if (!active) return
    const snapshot = readLeetCodeSnapshot()
    if (snapshot) {
      setStats({ leetcode: snapshot })
      setSource('snapshot')
      setState('ready')
      return
    }
    setStats(fallback ?? null)
    setSource(fallback?.leetcode ? 'snapshot' : 'none')
    setState('error')
  }
}

function readLeetCodeSnapshot(): CodingStats['leetcode'] | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem('leetcode-snapshot')
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { payload?: CodingStats['leetcode'] }
    return parsed.payload ?? null
  } catch {
    return null
  }
}

async function fetchGithubSummary(username: string): Promise<GitHubSummary | null> {
  try {
    const summary = await apiGet(`/api/github/summary?username=${encodeURIComponent(username)}`)
    return summary as GitHubSummary
  } catch {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`),
      ])
      if (!userRes.ok || !reposRes.ok) return null

      const user = await userRes.json()
      const repos = await reposRes.json()

      return {
        publicRepos: Number(user?.public_repos ?? 0),
        followers: Number(user?.followers ?? 0),
        following: Number(user?.following ?? 0),
        repos: (Array.isArray(repos) ? repos : []).map((repo: Record<string, unknown>) => ({
          name: String(repo.name || ''),
          html_url: String(repo.html_url || '#'),
          language: repo.language ? String(repo.language) : null,
          stargazers: Number(repo.stargazers_count || 0),
        })),
      }
    } catch {
      return null
    }
  }
}
