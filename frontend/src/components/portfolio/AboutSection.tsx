import { ABOUT_JSON, STAT_ITEMS } from '../../features/portfolio/constants'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export function AboutSection() {
  return (
    <section id="about" className="section section--about">
      <SectionHeader
        label="// about"
        title="Engineering with intent"
        description="I design backends that absorb complexity so product teams can move fast without breaking trust."
      />

      <div className="about__grid">
        <Reveal className="about__json-wrap">
          <div className="about__json">
            <div className="json-bracket">{'{'}</div>
            {Object.entries(ABOUT_JSON).map(([key, val]) => (
              <div key={key} className="json-line">
                <span className="json-key">&quot;{key}&quot;</span>
                <span className="json-bracket">: </span>
                {Array.isArray(val) ? (
                  <span className="json-value">
                    [
                    {val.map((v, i) => (
                      <span key={v} className="json-str">
                        &quot;{v}&quot;{i < val.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                    ]
                  </span>
                ) : (
                  <span className="json-str">&quot;{val}&quot;</span>
                )}
                <span className="json-bracket">,</span>
              </div>
            ))}
            <div className="json-bracket">{'}'}</div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="about__bio">
          <p>
            <strong>I care about systems that work when nobody&apos;s watching.</strong> My days are spent
            designing APIs for concurrent load, building real-time pipelines, and making distributed services
            fail gracefully.
          </p>
          <p>
            At Guestara, I own the PMS integration layer — syncing bookings, rooms, and guest data across
            property management systems in real time. Before that, embedded firmware at Zoho: custom Linux
            images and board-level automation.
          </p>
          <p>
            <strong>Great backend work disappears.</strong> When users never notice the infrastructure,
            that&apos;s the win.
          </p>
        </Reveal>
      </div>

      <div className="about__stats">
        {STAT_ITEMS.map((stat, i) => (
          <Reveal key={stat.label} delay={0.08 * i} className="stat-tile" data-hover>
            {stat.value === '∞' ? (
              <span className="stat-tile__value">{stat.value}</span>
            ) : (
              <AnimatedCounter value={stat.value} />
            )}
            <span className="stat-tile__label">{stat.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
