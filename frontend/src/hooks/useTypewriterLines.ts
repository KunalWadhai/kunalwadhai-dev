import { useEffect, useState } from 'react'

type TypewriterOptions = {
  startDelay?: number
  typingDelay?: number
  linePause?: number
}

export function useTypewriterLines(
  lines: string[],
  { startDelay = 300, typingDelay = 20, linePause = 220 }: TypewriterOptions = {}
) {
  const [rendered, setRendered] = useState<string[]>([])

  useEffect(() => {
    let timeoutId: number | null = null
    let cancelled = false

    const writeLine = (lineIndex: number, charIndex: number, snapshot: string[]) => {
      if (cancelled) return
      if (lineIndex >= lines.length) return

      const line = lines[lineIndex]
      const nextSnapshot = [...snapshot]

      if (charIndex <= line.length) {
        nextSnapshot[lineIndex] = line.slice(0, charIndex)
        setRendered(nextSnapshot)
        timeoutId = window.setTimeout(
          () => writeLine(lineIndex, charIndex + 1, nextSnapshot),
          Math.max(typingDelay - Math.random() * 6, 8)
        )
        return
      }

      timeoutId = window.setTimeout(() => writeLine(lineIndex + 1, 0, nextSnapshot), linePause)
    }

    timeoutId = window.setTimeout(() => {
      writeLine(0, 0, new Array(lines.length).fill(''))
    }, startDelay)

    return () => {
      cancelled = true
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [linePause, lines, startDelay, typingDelay])

  return rendered.filter(Boolean)
}
