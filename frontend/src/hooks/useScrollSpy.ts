import { useEffect, useState } from 'react'

export function useScrollSpy(sectionIds: readonly string[], offset = 140) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const sections = sectionIds
          .map((id) => document.getElementById(id))
          .filter(Boolean) as HTMLElement[]

        for (let i = sections.length - 1; i >= 0; i--) {
          if (sections[i].getBoundingClientRect().top <= offset) {
            setActiveId(sectionIds[i])
            ticking = false
            return
          }
        }

        setActiveId('')
        ticking = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sectionIds, offset])

  return activeId
}
