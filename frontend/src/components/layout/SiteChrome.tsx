import { useCursorGlow } from '../../hooks/useCursorGlow'

export function SiteChrome() {
  const { cursorRef, glowRef } = useCursorGlow()

  return (
    <>
      <div className="noise" aria-hidden="true" />
      <div className="mesh" aria-hidden="true" />
      <div className="grid-bg" aria-hidden="true" />
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div ref={cursorRef} className="cursor-dot" aria-hidden="true" />
      <a className="skip-link" href="#about">
        Skip to content
      </a>
    </>
  )
}
