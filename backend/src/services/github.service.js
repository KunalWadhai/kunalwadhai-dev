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

async function fetchContributionsGraphql(username) {
    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
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
        body: JSON.stringify({ query, variables: { login: username } }),
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
                ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'].indexOf(
                    d.contributionLevel,
                ),
            ),
        })),
    )

    return {
        total: calendar.totalContributions,
        days,
        source: 'github-graphql',
    }
}

async function fetchContributionsPublic(username) {
    const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}`,
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
        json.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0)

    return { total, days, source: 'public-mirror' }
}

export async function getGithubContributions(username) {
    if (!username) throw Object.assign(new Error('username is required'), { status: 400 })

    const handle = username.trim()
    const cached = contribCache.get(handle)
    if (cached && Date.now() - cached.ts < CONTRIB_TTL_MS) return cached.data

    let data = env.GITHUB_TOKEN ? await fetchContributionsGraphql(handle) : null
    if (!data) data = await fetchContributionsPublic(handle)
    if (!data) {
        throw Object.assign(new Error('Could not load GitHub contributions'), { status: 502 })
    }

    const result = {
        handle,
        profileUrl: `https://github.com/${handle}`,
        total: data.total,
        days: data.days.slice(-371),
        source: data.source,
        fetchedAt: new Date().toISOString(),
    }

    contribCache.set(handle, { ts: Date.now(), data: result })
    return result
}
