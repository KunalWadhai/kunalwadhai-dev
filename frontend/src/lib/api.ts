/// <reference types="vite/client" />
// In dev: Vite proxies /api/* → localhost:4000 (no CORS issue, no env var needed)
// In prod: set VITE_API_URL to your deployed backend URL (e.g. https://api.yoursite.com)
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export async function apiGet(path: string) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GET ${path} failed: ${res.status} ${text}`.trim())
  }
  return res.json()
}

export async function apiPost(path: string, body: unknown) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`POST ${path} failed: ${res.status} ${text}`.trim())
  }
  return res.json()
}

