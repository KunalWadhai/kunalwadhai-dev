import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

type UseInViewOptions = {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { threshold = 0.15, rootMargin = '0px 0px -8% 0px', once = true }: UseInViewOptions = {}
) {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setIsInView(false)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, threshold, rootMargin, once])

  return isInView
}
