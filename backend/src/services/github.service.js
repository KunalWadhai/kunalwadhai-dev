import { env } from '../config/env.js'

const GITHUB_API = env.GITHUB_API || 'https://api.github.com'
const CONTRIB_TTL_MS = 10 * 60 * 1000
const contribCache = new Map()

function headers() {
    const h = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    }
    if (env.GITHUB_TOKEN) {
        h['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`
    }
    return h
}

export async function getGithubSummary(username) {
    if (!username) throw Object.assign(new Error('username is required'), { status: 400 })

    const [userRes, reposRes] = await Promise.all([
        fetch(`${GITHUB_API}/users/${encodeURIComponent(username)}`, { headers: headers() }),
        fetch(`${GITHUB_API}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`, { headers: headers() }),
    ])

    if (!userRes.ok) {
        throw Object.assign(
            new Error(`GitHub API error: ${userRes.status} ${userRes.statusText}`),
            { status: userRes.status === 404 ? 404 : 502 },
        )
    }

    const user = await userRes.json()
    const repos = reposRes.ok ? await reposRes.json() : []

    return {
        publicRepos: user.public_repos ?? 0,
        followers: user.followers ?? 0,
        following: user.following ?? 0,
        avatarUrl: user.avatar_url ?? null,
        bio: user.bio ?? null,
        repos: Array.isArray(repos)
            ? repos.map((r) => ({
                name: r.name,
                description: r.description,
                html_url: r.html_url,
                language: r.language,
                stargazers: r.stargazers_count,
                forks: r.forks_count,
                updatedAt: r.updated_at,
            }))
            : [],
    }
}

function levelFromCount(count) {
    if (count <= 0) return 0
    if (count <= 2) return 1
    if (count <= 5) return 2
    if (count <= 9) return 3
    return 4
}

async function fetchContributionsGraphql(username, year) {
    const query = `
      query($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `

    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            ...headers(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: {
                login: username,
                from: new Date(Date.UTC(year, 0, 1)).toISOString(),
                to: new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)).toISOString(),
            },
        }),
    })

    if (!res.ok) return null
    const json = await res.json()
    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar
    if (!calendar) return null

    const days = calendar.weeks.flatMap((week) =>
        week.contributionDays.map((d) => ({
            date: d.date,
            count: d.contributionCount,
            level: Math.min(
                4,
                Math.max(0, ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'].indexOf(
                    d.contributionLevel,
                )),
            ),
        })),
    )

    return {
        total: calendar.totalContributions,
        days,
        source: 'github-graphql',
    }
}

async function fetchContributionsPublic(username, year) {
    const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${year}`,
    )
    if (!res.ok) return null
    const json = await res.json()
    const rows = Array.isArray(json.contributions) ? json.contributions : []
    const days = rows.map((d) => ({
        date: d.date,
        count: Number(d.count || 0),
        level: Number.isFinite(d.level) ? d.level : levelFromCount(d.count),
    }))
    const total =
        json.total?.[String(year)] ?? days.reduce((sum, d) => sum + d.count, 0)

    return { total, days, source: 'public-mirror' }
}

export async function getGithubContributions(username, requestedYear = new Date().getUTCFullYear()) {
    if (!username) throw Object.assign(new Error('username is required'), { status: 400 })

    const handle = username.trim()
    const year = Number(requestedYear)
    const currentYear = new Date().getUTCFullYear()
    if (!Number.isInteger(year) || year < 2008 || year > currentYear) {
        throw Object.assign(new Error(`year must be between 2008 and ${currentYear}`), { status: 400 })
    }

    const cacheKey = `${handle}:${year}`
    const cached = contribCache.get(cacheKey)
    if (cached && Date.now() - cached.ts < CONTRIB_TTL_MS) return cached.data

    let data = env.GITHUB_TOKEN ? await fetchContributionsGraphql(handle, year) : null
    if (!data) data = await fetchContributionsPublic(handle, year)
    if (!data) {
        throw Object.assign(new Error('Could not load GitHub contributions'), { status: 502 })
    }

    const result = {
        handle,
        year,
        profileUrl: `https://github.com/${handle}`,
        total: data.total,
        days: data.days.filter((day) => day.date.startsWith(`${year}-`)),
        source: data.source,
        fetchedAt: new Date().toISOString(),
    }

    contribCache.set(cacheKey, { ts: Date.now(), data: result })
    return result
}
