import type { CodingPlatform, ProgrammingDashboards } from './types'
import { normalizeUrl } from './utils'

export function buildCodingPlatforms(dashboards?: ProgrammingDashboards): CodingPlatform[] {
  const platforms: CodingPlatform[] = []

  if (dashboards?.leetcode?.handle) {
    platforms.push({
      id: 'leetcode',
      label: 'LeetCode',
      handle: dashboards.leetcode.handle,
      url: normalizeUrl(dashboards.leetcode.url || `https://leetcode.com/u/${dashboards.leetcode.handle}/`),
      accent: '#ffa116',
    })
  }

  if (dashboards?.hackerrank?.username) {
    platforms.push({
      id: 'hackerrank',
      label: 'HackerRank',
      handle: dashboards.hackerrank.username,
      url: normalizeUrl(
        dashboards.hackerrank.url ||
          `https://www.hackerrank.com/profile/${dashboards.hackerrank.username}`
      ),
      accent: '#00ea64',
    })
  }

  if (dashboards?.gfg?.username) {
    platforms.push({
      id: 'gfg',
      label: 'GeeksforGeeks',
      handle: dashboards.gfg.username,
      url: normalizeUrl(
        dashboards.gfg.url ||
          `https://www.geeksforgeeks.org/user/${dashboards.gfg.username}/`
      ),
      accent: '#2f8d46',
    })
  }

  return platforms
}
