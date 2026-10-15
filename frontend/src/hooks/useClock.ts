import { useEffect, useState } from 'react'
import { SITE } from '../content/site'

export function useClock(timezone = SITE.timezone) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const local = new Intl.DateTimeFormat('en-IN', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)

  const utc = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)

  return {
    now,
    local,
    utc,
    iso: now.toISOString(),
  }
}
