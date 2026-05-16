import { useEffect, useMemo, useState } from 'react'
import { apiGet } from '../../lib/api'
import { DEFAULT_PROFILE } from './constants'
import type { GitHubSummary, Profile } from './types'
import { deriveGithubHandle } from './utils'

type DataState = 'idle' | 'loading' | 'ready' | 'error'

export function usePortfolioData() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [githubSummary, setGithubSummary] = useState<GitHubSummary | null>(null)
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

  const data = useMemo(() => {
    const base = profile ?? DEFAULT_PROFILE
    // Merge frontend-defined projects (e.g. SupportIQ) into API data
    const apiProjectNames = new Set(base.projects.map(p => p.name.toLowerCase()))
    const extraProjects = DEFAULT_PROFILE.projects.filter(
      p => !apiProjectNames.has(p.name.toLowerCase())
    )
    if (extraProjects.length > 0) {
      return { ...base, projects: [...extraProjects, ...base.projects] }
    }
    return base
  }, [profile])
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

  return { data, githubSummary, githubHandle, state }
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
