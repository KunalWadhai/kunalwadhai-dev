import { AppError } from '../middleware/errorHandler.js'

const LEETCODE_API = 'https://leetcode.com/graphql'

const LEETCODE_QUERY = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking
        userAvatar
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      userProfileCalendar {
        totalActiveDays
        streak
        submissionCalendar
      }
    }
    userContestRanking(username: $username) {
      rating
      globalRanking
      topPercentage
      attendedContestsCount
    }
  }
`

export async function getLeetCodeSummary(username) {
  if (!username) {
    throw new AppError('username is required', 400, 'USERNAME_REQUIRED')
  }

  const res = await fetch(LEETCODE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Origin': 'https://leetcode.com',
      'Referer': 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    },
    body: JSON.stringify({
      query: LEETCODE_QUERY,
      variables: { username },
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const message = `LeetCode API error: ${res.status} ${res.statusText}${text ? ` - ${text.slice(0, 160)}` : ''}`
    throw new AppError(message, 502, 'LEETCODE_API_ERROR')
  }

  const payload = await res.json()
  if (payload?.errors?.length) {
    const first = payload.errors[0]
    const message = first?.message || 'LeetCode API error'
    throw new AppError(message, 502, 'LEETCODE_API_ERROR')
  }
  const data = payload?.data
  const matchedUser = data?.matchedUser

  if (!matchedUser) {
    throw new AppError('LeetCode profile not found', 404, 'LEETCODE_NOT_FOUND')
  }

  const solved = matchedUser?.submitStatsGlobal?.acSubmissionNum || []
  const allSolved = solved.find((entry) => entry.difficulty === 'All')
  const easySolved = solved.find((entry) => entry.difficulty === 'Easy')
  const mediumSolved = solved.find((entry) => entry.difficulty === 'Medium')
  const hardSolved = solved.find((entry) => entry.difficulty === 'Hard')

  const calendar = matchedUser?.userProfileCalendar
  const contest = data?.userContestRanking

  return {
    handle: matchedUser.username,
    avatarUrl: matchedUser.profile?.userAvatar || null,
    ranking: matchedUser.profile?.ranking || null,
    totalSolved: allSolved?.count || 0,
    solvedBreakdown: {
      easy: easySolved?.count || 0,
      medium: mediumSolved?.count || 0,
      hard: hardSolved?.count || 0,
    },
    contest: contest
      ? {
          rating: contest.rating || null,
          globalRanking: contest.globalRanking || null,
          topPercentage: contest.topPercentage || null,
          attendedContests: contest.attendedContestsCount || null,
        }
      : null,
    calendar: calendar
      ? {
          totalActiveDays: calendar.totalActiveDays || 0,
          streak: calendar.streak || 0,
          submissionCalendar: calendar.submissionCalendar || '{}',
        }
      : null,
  }
}
