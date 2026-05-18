import { TECH_MARQUEE } from '../../features/portfolio/constants'

export function TechMarquee() {
  const items = [...TECH_MARQUEE, ...TECH_MARQUEE]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((tech, i) => (
          <span key={`${tech}-${i}`} className="marquee__item">
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
