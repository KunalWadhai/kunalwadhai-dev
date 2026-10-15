const CAPABILITIES = [
  { title: 'Ask the work', body: 'Experience, stack, and shipping decisions — answered from the live profile.' },
  { title: 'Grounded replies', body: 'The agent reads the same résumé data the site does. No invented titles.' },
  { title: 'Voice ready', body: 'Mic in, speech out — useful when your hands are on another keyboard.' },
]

export function AgentSection() {
  return (
    <section id="agent" className="section">
      <div className="container">
        <div className="section__inner">
          <div className="section__title">
            <h2>Agent</h2>
          </div>
          <div className="section__content">
            <div className="work-intro">
              <h3 className="work-intro__title">A private briefing room</h3>
              <p className="work-intro__description">
                The floating control in the corner talks to the same backend that serves this site. Open it when you want depth without a calendar invite.
              </p>
            </div>

            <div className="agent-grid">
              {CAPABILITIES.map((item) => (
                <article key={item.title} className="agent-card">
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
