const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql'
const CACHE_TTL_MS = 5 * 60 * 1000
const cache = new Map()

const STATS_QUERY = `
  query userStats($username: String!, $year: Int!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
      profile {
        ranking
        reputation
        starRating
      }
      userCalendar(year: $year) {
        submissionCalendar
        activeYears
        streak
        totalActiveDays
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      topPercentage
    }
    userContestRankingHistory(username: $username) {
      attended
      rating
      ranking
      trendDirection
      contest {
        title
        startTime
      }
    }
  }
`

async function graphql(query, variables) {
  const res = await fetch(LEETCODE_GRAPHQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw Object.assign(new Error(`LeetCode API error: ${res.status}`), { status: 502 })
  }

  const json = await res.json()
  if (json.errors?.length) {
    const msg = json.errors.map((e) => e.message).join('; ')
    throw Object.assign(new Error(msg), { status: 502 })
  }

  return json.data
}

function parseSolved(submitStats) {
  const rows = submitStats?.acSubmissionNum ?? []
  const byDiff = Object.fromEntries(rows.map((r) => [r.difficulty, r.count]))
  return {
    total: byDiff.All ?? 0,
    easy: byDiff.Easy ?? 0,
    medium: byDiff.Medium ?? 0,
    hard: byDiff.Hard ?? 0,
  }
}

function mergeSubmissionCalendars(...calendars) {
  const merged = {}
  for (const cal of calendars) {
    if (!cal) continue
    try {
      const raw = JSON.parse(cal)
      Object.assign(merged, raw)
    } catch {
      /* skip invalid */
    }
  }
  return JSON.stringify(merged)
}

function parseActivityCalendar(submissionCalendar, days = 365) {
  let raw = {}
  try {
    raw = JSON.parse(submissionCalendar || '{}')
  } catch {
    return []
  }

  const entries = Object.entries(raw)
    .map(([ts, count]) => ({
      date: new Date(Number(ts) * 1000),
      count: Number(count),
    }))
    .filter((e) => !Number.isNaN(e.date.getTime()))
    .sort((a, b) => a.date - b.date)

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return entries
    .filter((e) => e.date.getTime() >= cutoff)
    .map((e) => ({
      date: e.date.toISOString().slice(0, 10),
      count: e.count,
    }))
}

function parseContestHistory(history) {
  if (!Array.isArray(history)) return []

  return history
    .filter((h) => h.attended && h.contest?.startTime)
    .sort((a, b) => a.contest.startTime - b.contest.startTime)
    .slice(-16)
    .map((h) => ({
      title: h.contest.title,
      startTime: h.contest.startTime,
      rating: Math.round(h.rating ?? 0),
      ranking: h.ranking ?? null,
      trend: h.trendDirection ?? null,
    }))
}

export async function getLeetcodeStats(username) {
  if (!username?.trim()) {
    throw Object.assign(new Error('username is required'), { status: 400 })
  }

  const handle = username.trim().toLowerCase()
  const cacheKey = `lc:${handle}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data
  }

  const year = new Date().getFullYear()
  const [data, prevYearData] = await Promise.all([
    graphql(STATS_QUERY, { username: handle, year }),
    graphql(STATS_QUERY, { username: handle, year: year - 1 }),
  ])

  if (!data?.matchedUser) {
    throw Object.assign(new Error(`LeetCode user "${handle}" not found`), { status: 404 })
  }

  const user = data.matchedUser
  const calendar = user.userCalendar ?? {}
  const prevCalendar = prevYearData?.matchedUser?.userCalendar ?? {}
  const mergedSubmission = mergeSubmissionCalendars(
    prevCalendar.submissionCalendar,
    calendar.submissionCalendar,
  )
  const contest = data.userContestRanking ?? {}

  const result = {
    handle,
    profileUrl: `https://leetcode.com/u/${handle}/`,
    solved: parseSolved(user.submitStats),
    ranking: user.profile?.ranking ?? null,
    reputation: user.profile?.reputation ?? 0,
    starRating: user.profile?.starRating ?? null,
    streak: Math.max(calendar.streak ?? 0, prevCalendar.streak ?? 0),
    totalActiveDays: Math.max(calendar.totalActiveDays ?? 0, prevCalendar.totalActiveDays ?? 0),
    activeYears: [
      ...new Set([...(prevCalendar.activeYears ?? []), ...(calendar.activeYears ?? [])]),
    ].sort(),
    contest: {
      rating: Math.round(contest.rating ?? 0),
      globalRanking: contest.globalRanking ?? null,
      topPercentage: contest.topPercentage ?? null,
      attendedContestsCount: contest.attendedContestsCount ?? 0,
    },
    contestHistory: parseContestHistory(data.userContestRankingHistory),
    activity: parseActivityCalendar(mergedSubmission),
    fetchedAt: new Date().toISOString(),
  }

  cache.set(cacheKey, { ts: Date.now(), data: result })
  return result
}
