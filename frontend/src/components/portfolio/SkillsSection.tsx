import { LEARNING_ITEMS, SKILLS_DATA } from '../../features/portfolio/constants'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export function SkillsSection() {
  return (
    <section id="skills" className="section section--skills">
      <SectionHeader label="// skills" title="Stack & craft" />

      <div className="skills-grid">
        {Object.entries(SKILLS_DATA).map(([category, skills], ci) => (
          <Reveal key={category} delay={0.08 * ci} className="skills-col">
            <h3 className="skills-col__title">{category}</h3>
            <ul className="skills-col__items">
              {skills.map((skill) => (
                <li key={skill.name} className="skill-item" data-hover>
                  <span className="skill-item__name">{skill.name}</span>
                  <div className="skill-item__bar" aria-label={`Proficiency ${skill.level} of 3`}>
                    {[1, 2, 3].map((l) => (
                      <span key={l} className={l <= skill.level ? 'filled' : ''} />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3} className="skills-learning">
        <p className="skills-learning__title">
          Currently exploring <span className="typing-cursor" aria-hidden="true" />
        </p>
        <div className="skills-learning__items">
          {LEARNING_ITEMS.map((item) => (
            <span key={item} className="skills-learning__item">
              {item}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
