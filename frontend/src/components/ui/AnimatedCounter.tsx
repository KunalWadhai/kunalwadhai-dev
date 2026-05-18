import { useEffect, useRef, useState } from 'react'

export interface AnimatedCounterProps {
  readonly value: string
  readonly className?: string
}

export function AnimatedCounter({ value, className = 'stat-tile__value' }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState('0')
  const counted = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || counted.current) return
        counted.current = true

        const numMatch = value.match(/^(\d+)/)
        if (!numMatch) {
          setDisplay(value)
          return
        }

        const target = parseInt(numMatch[1], 10)
        const suffix = value.slice(numMatch[1].length)
        const duration = 1400
        const start = performance.now()

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 4)
          setDisplay(Math.floor(eased * target) + suffix)
          if (progress < 1) requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
