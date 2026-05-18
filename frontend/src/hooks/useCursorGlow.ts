import { useEffect, useRef } from 'react'

export function useCursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (prefersReducedMotion || isTouch) return

    const onMove = (e: MouseEvent) => {
      const { clientX: cx, clientY: cy } = e
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cx - 10}px, ${cy - 10}px, 0)`
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${cx - 320}px, ${cy - 320}px, 0)`
      }
    }

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement
      if (t.closest('a, button, input, textarea, [data-hover]')) {
        cursorRef.current?.classList.add('cursor-dot--hover')
      }
    }

    const onOut = () => cursorRef.current?.classList.remove('cursor-dot--hover')

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return { cursorRef, glowRef }
}
