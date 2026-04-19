import { GITHUB_TOKEN } from "../constants.js"

export const github = async (req, res) => {
  const username = req.query.username || profile?.social?.githubHandle
  if (!username) return res.status(400).json({ error: 'Missing username' })

  try {
    const token = process.env.GITHUB_TOKEN
    const headers = {
      Accept: 'application/vnd.github+json',
    }
    if (token) headers.Authorization = `Bearer ${token}`

    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
    })
    if (!userRes.ok) {
      return res.status(userRes.status).json({ error: 'GitHub request failed' })
    }
    const user = await userRes.json()

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
      { headers },
    )
    const repos = await reposRes.json()

    res.json({
      username,
      name: user.name || username,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      repos: (Array.isArray(repos) ? repos : []).map((r) => ({
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        language: r.language,
        updatedAt: r.updated_at,
        stargazers: r.stargazers_count,
      })),
    })
  } catch (err) {
    console.error('GitHub summary error:', err)
    res.status(500).json({ error: 'Failed to load GitHub summary' })
  }
}