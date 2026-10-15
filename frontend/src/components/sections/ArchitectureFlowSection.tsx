const NODES = [
  { id: 'edge', label: 'Staff / guest clients', sub: 'Web · PWA' },
  { id: 'gw', label: 'API gateway', sub: 'Node · JWT' },
  { id: 'q', label: 'Queues', sub: 'BullMQ · Redis' },
  { id: 'pms', label: 'PMS adapters', sub: 'Beds24 · eZee' },
  { id: 'iot', label: 'IoT locks', sub: 'Tuya · PIN' },
  { id: 'data', label: 'System of record', sub: 'Postgres · Redis' },
] as const

export function ArchitectureFlowSection() {
  return (
    <section id="system" className="section">
      <div className="container">
        <div className="section__inner">
          <div className="section__title">
            <h2>System</h2>
          </div>
          <div className="section__content">
            <div className="work-intro">
              <h3 className="work-intro__title">How the platform breathes</h3>
              <p className="work-intro__description">
                Request in, side effects out. A grid of the production path I own — not a marketing diagram.
              </p>
            </div>

            <div className="arch-grid">
              {NODES.map((node, i) => (
                <article key={node.id} className="arch-node" style={{ animationDelay: `${i * 80}ms` }}>
                  <span className="arch-node__index">0{i + 1}</span>
                  <h4>{node.label}</h4>
                  <p>{node.sub}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
