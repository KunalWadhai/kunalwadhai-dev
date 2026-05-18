import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'
import type { LeetCodeStats, ProgrammingDashboards } from '../features/portfolio/types'

type LoadState = 'idle' | 'loading' | 'ready' | 'error'

export function useCodingStats(dashboards?: ProgrammingDashboards) {
  const [leetcode, setLeetcode] = useState<LeetCodeStats | null>(null)
  const [state, setState] = useState<LoadState>('idle')

  const handle = dashboards?.leetcode?.handle?.trim()

  useEffect(() => {
    if (!handle) {
      setLeetcode(null)
      setState('idle')
      return
    }

    let active = true
    setState('loading')

    apiGet(`/api/leetcode/stats?username=${encodeURIComponent(handle)}`)
      .then((res) => {
        if (!active) return
        const { ok, ...stats } = res as { ok: boolean } & LeetCodeStats
        if (ok === false) {
          setState('error')
          setLeetcode(null)
          return
        }
        setLeetcode(stats as LeetCodeStats)
        setState('ready')
      })
      .catch(async () => {
        if (!active) return
        const fallback = await fetchLeetcodeDirect(handle)
        if (!active) return
        if (fallback) {
          setLeetcode(fallback)
          setState('ready')
        } else {
          setLeetcode(null)
          setState('error')
        }
      })

    return () => {
      active = false
    }
  }, [handle])

  return { leetcode, state, handle }
}

async function fetchLeetcodeDirect(username: string): Promise<LeetCodeStats | null> {
  try {
    const year = new Date().getFullYear()
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query($u:String!,$y:Int!){matchedUser(username:$u){submitStats{acSubmissionNum{difficulty count}}profile{ranking reputation starRating}userCalendar(year:$y){submissionCalendar activeYears streak totalActiveDays}}userContestRanking(username:$u){attendedContestsCount rating globalRanking topPercentage}userContestRankingHistory(username:$u){attended rating ranking trendDirection contest{title startTime}}}`,
        variables: { u: username, y: year },
      }),
    })
    if (!res.ok) return null
    const json = await res.json()
    if (!json.data?.matchedUser) return null

    const user = json.data.matchedUser
    const rows = user.submitStats?.acSubmissionNum ?? []
    const byDiff = Object.fromEntries(rows.map((r: { difficulty: string; count: number }) => [r.difficulty, r.count]))
    const cal = user.userCalendar ?? {}
    const contest = json.data.userContestRanking ?? {}

    let activity: { date: string; count: number }[] = []
    try {
      const raw = JSON.parse(cal.submissionCalendar || '{}') as Record<string, number>
      const cutoff = Date.now() - 168 * 86400000
      activity = Object.entries(raw)
        .map(([ts, count]) => ({ date: new Date(Number(ts) * 1000), count: Number(count) }))
        .filter((e) => e.date.getTime() >= cutoff)
        .map((e) => ({ date: e.date.toISOString().slice(0, 10), count: e.count }))
    } catch {
      activity = []
    }

    const history = (json.data.userContestRankingHistory ?? [])
      .filter((h: { attended: boolean; contest?: { startTime: number } }) => h.attended && h.contest?.startTime)
      .sort((a: { contest: { startTime: number } }, b: { contest: { startTime: number } }) => a.contest.startTime - b.contest.startTime)
      .slice(-16)
      .map((h: { contest: { title: string; startTime: number }; rating: number; ranking: number; trendDirection: string }) => ({
        title: h.contest.title,
        startTime: h.contest.startTime,
        rating: Math.round(h.rating),
        ranking: h.ranking,
        trend: h.trendDirection,
      }))

    return {
      handle: username,
      profileUrl: `https://leetcode.com/u/${username}/`,
      solved: {
        total: byDiff.All ?? 0,
        easy: byDiff.Easy ?? 0,
        medium: byDiff.Medium ?? 0,
        hard: byDiff.Hard ?? 0,
      },
      ranking: user.profile?.ranking ?? null,
      reputation: user.profile?.reputation ?? 0,
      starRating: user.profile?.starRating ?? null,
      streak: cal.streak ?? 0,
      totalActiveDays: cal.totalActiveDays ?? 0,
      activeYears: cal.activeYears ?? [],
      contest: {
        rating: Math.round(contest.rating ?? 0),
        globalRanking: contest.globalRanking ?? null,
        topPercentage: contest.topPercentage ?? null,
        attendedContestsCount: contest.attendedContestsCount ?? 0,
      },
      contestHistory: history,
      activity,
      fetchedAt: new Date().toISOString(),
    }
  } catch {
    return null
  }
}
