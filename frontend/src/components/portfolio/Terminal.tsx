import { useEffect, useRef, useState } from 'react'
import { TERMINAL_LINES } from '../../features/portfolio/constants'

export function Terminal() {
  const [visibleLines, setVisibleLines] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        TERMINAL_LINES.forEach((line, i) => {
          setTimeout(() => setVisibleLines(i + 1), line.delay)
        })
      },
      { threshold: 0.25 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="terminal" role="img" aria-label="Animated server terminal output">
      <div className="terminal__bar">
        <span className="terminal__dot terminal__dot--red" />
        <span className="terminal__dot terminal__dot--amber" />
        <span className="terminal__dot terminal__dot--green" />
        <span className="terminal__title">kunal@prod — zsh</span>
        <span className="terminal__live">live</span>
      </div>
      <div className="terminal__body">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={`terminal__line terminal__line--${line.type}`}>
            {line.text}
          </div>
        ))}
        {visibleLines >= TERMINAL_LINES.length && <span className="terminal__cursor" aria-hidden="true" />}
      </div>
    </div>
  )
}
