import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeader label="About" title="Engineering with intent" />

        <div className="about__grid">
          <Reveal className="about__primary">
            <p>
              I work on systems where correctness is non-negotiable — booking platforms, property
              management integrations, real-time data pipelines. At{' '}
              <strong>Guestara</strong>, I own the PMS integration layer: syncing rooms, bookings
              and guest data across multiple third-party systems in real time, handling edge cases
              that only appear under production load.
            </p>
            <p>
              Before that, embedded firmware at <strong>Zoho</strong> — building custom Yocto
              Linux images for Raspberry Pi and BeagleBone Black, automating firmware build and
              deploy pipelines.
            </p>
            <p>
              My defaults are typed interfaces, explicit error handling, and operational visibility.
              A backend that your team can debug at 2am is worth more than one that's clever.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="about__meta">
            <dl className="about__details">
              <div className="about__detail-row">
                <dt>Currently</dt>
                <dd>Backend Engineer · Guestara</dd>
              </div>
              <div className="about__detail-row">
                <dt>Location</dt>
                <dd>India</dd>
              </div>
              <div className="about__detail-row">
                <dt>Education</dt>
                <dd>B.E. Computer Science · GCEC · 8.53 CGPA</dd>
              </div>
              <div className="about__detail-row">
                <dt>Interests</dt>
                <dd>Distributed systems, API design, observability, embedded</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
