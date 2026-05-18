import { Reveal } from './Reveal'

export interface SectionHeaderProps {
  readonly label: string
  readonly title: string
  readonly description?: string
}

export function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <header className="section-header">
      <Reveal>
        <p className="section-header__label">{label}</p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="section-header__title">{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={0.12}>
          <p className="section-header__desc">{description}</p>
        </Reveal>
      )}
    </header>
  )
}
