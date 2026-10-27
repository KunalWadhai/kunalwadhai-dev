import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'
import { SITE } from '../content/site'
import type { GitHubContributions } from '../features/portfolio/types'

type State = 'idle' | 'loading' | 'ready' | 'error'

export function useGithubContributions(year: number, handle = SITE.githubHandle) {
  const [data, setData] = useState<GitHubContributions | null>(null)
  const [state, setState] = useState<State>('idle')

  useEffect(() => {
    let active = true
    setData(null)
    setState('loading')

    apiGet(`/api/github/contributions?username=${encodeURIComponent(handle)}&year=${year}`)
      .then((res) => {
        if (!active) return
        const payload = res as GitHubContributions & { ok?: boolean }
        if (payload.ok === false) {
          setState('error')
          return
        }
        setData(payload)
        setState('ready')
      })
      .catch(async () => {
        if (!active) return
        try {
          const res = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(handle)}?y=${year}`,
          )
          if (!res.ok) throw new Error('mirror failed')
          const json = await res.json()
          const days = (json.contributions ?? []).map(
            (d: { date: string; count: number; level?: number }) => ({
              date: d.date,
              count: Number(d.count || 0),
              level: d.level ?? 0,
            }),
          )
          if (!active) return
          setData({
            handle,
            profileUrl: `https://github.com/${handle}`,
            year,
            total: json.total?.[String(year)] ?? days.reduce((s: number, d: { count: number }) => s + d.count, 0),
            days,
            source: 'public-mirror',
            fetchedAt: new Date().toISOString(),
          })
          setState('ready')
        } catch {
          if (!active) return
          setData(null)
          setState('error')
        }
      })

    return () => {
      active = false
    }
  }, [handle, year])

  return { data, state }
}
