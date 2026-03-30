import { env } from '../config/env.js'

const GITHUB_API = 'https://api.github.com'

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
