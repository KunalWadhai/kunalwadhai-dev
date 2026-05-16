import { env } from '../config/env.js'
import { GITHUB_API } from '../constants.js'
import { AppError } from '../middleware/errorHandler.js'


function headers() {
    const h = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'portfolio-backend',
    }
    if (env.GITHUB_TOKEN) {
        h['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`
    }
    return h
}

export async function getGithubSummary(username) {
    if (!username) throw new AppError('username is required', 400, 'USERNAME_REQUIRED')

    const [userRes, reposRes] = await Promise.all([
        fetch(`${GITHUB_API}/users/${encodeURIComponent(username)}`, { headers: headers() }),
        fetch(`${GITHUB_API}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`, { headers: headers() }),
    ])

    if (!userRes.ok) {
        const status = userRes.status
        const message = `GitHub API error: ${status} ${userRes.statusText}`
        throw new AppError(message, status === 404 ? 404 : 502, 'GITHUB_API_ERROR')
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
