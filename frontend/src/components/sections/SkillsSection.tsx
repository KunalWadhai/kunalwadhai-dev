/**
 * Skills Section — Capability matrix (rows = areas, chips link to demos)
 * No emoji, no "HOT SKILLS", no multi-color accents
 */

import { skillGroups } from '../../content/skills'

export function SkillsSection() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section__inner">
          <div className="section__title">
            <h2>Skills</h2>
          </div>

          <div className="section__content">
            <div className="skills-intro">
              <h3 className="skills-intro__title">What I work with</h3>
              <p className="skills-intro__description">
                Technologies grouped by capability area. Linked chips demonstrate the skill in a case study.
              </p>
            </div>

            <div className="skills-matrix">
              {skillGroups.map((group) => (
                <div key={group.id} className="skill-row">
                  <h4 className="skill-row__category">{group.category}</h4>
                  <div className="skill-row__chips">
                    {group.skills.map((skill) => {
                      if (skill.demo) {
                        return (
                          <a
                            key={skill.name}
                            href={`/work/${skill.demo}#${skill.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="chip skill-chip--linked"
                            title={`See ${skill.name} in action`}
                          >
                            {skill.name}
                            <sup className="skill-chip__marker" aria-hidden="true">•</sup>
                          </a>
                        )
                      }
                      
                      return (
                        <span key={skill.name} className="chip">
                          {skill.name}
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <p className="skills-note">
              <sup>•</sup> Linked chips demonstrate the skill in a case study.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .skills-intro {
          margin-bottom: var(--space-8);
        }

        .skills-intro__title {
          font-size: var(--text-2xl);
          font-weight: 600;
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .skills-intro__description {
          font-size: var(--text-md);
          color: var(--text-secondary);
          max-width: 60ch;
        }

        .skills-matrix {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .skill-row {
          display: grid;
          gap: var(--space-4);
          align-items: start;
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--line-subtle);
        }

        .skill-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        @media (min-width: 768px) {
          .skill-row {
            grid-template-columns: 200px 1fr;
          }
        }

        .skill-row__category {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-primary);
          padding-top: 0.25rem;
        }

        .skill-row__chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .skill-chip--linked {
          cursor: pointer;
          position: relative;
        }

        .skill-chip--linked:hover {
          border-color: var(--accent);
          color: var(--text-primary);
          background: var(--accent-wash);
        }

        .skill-chip__marker {
          font-size: 0.7em;
          margin-left: 2px;
          color: var(--accent);
        }

        .skills-note {
          margin-top: var(--space-8);
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .skills-note sup {
          color: var(--accent);
        }
      `}</style>
    </section>
  )
}
