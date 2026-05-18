import { TESTIMONIALS } from '../../features/portfolio/constants'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export function TestimonialsSection() {
  return (
    <section className="section section--testimonials" aria-label="Testimonials">
      <SectionHeader label="// voices" title="What collaborators say" />

      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.author} delay={0.1 * i} className="testimonial">
            <div className="testimonial__mark" aria-hidden="true">
              &ldquo;
            </div>
            <blockquote className="testimonial__text">{t.quote}</blockquote>
            <footer className="testimonial__author">
              {t.author} · {t.org}
            </footer>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
