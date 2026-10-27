import { profile } from '../../content/profile'
import { SITE } from '../../content/site'
import { useClock } from '../../hooks/useClock'

export function Footer() {
  const year = new Date().getFullYear()
  const { local, utc } = useClock()

  return (
    <footer className="footer">
      <div className="container">
        {/* Telemetry info - moved from top */}
        <div className="footer__telemetry">
          <span className="footer__telemetry-item">
            <em>LOC</em> {SITE.region}
          </span>
          <span className="footer__telemetry-sep">/</span>
          <span className="footer__telemetry-item">
            <em>{SITE.timezoneLabel}</em> {local}
          </span>
          <span className="footer__telemetry-sep">/</span>
          <span className="footer__telemetry-item">
            <em>UTC</em> {utc}
          </span>
        </div>

        <div className="footer__meta">
          <p>
            {profile.name} · {year} · {SITE.timezoneLabel}
          </p>
          <p className="footer__tag">Backend-first. Shipped with intent.</p>
        </div>
      </div>
      <div className="footer__name" aria-hidden="true">
        Kunal Wadhai
      </div>
    </footer>
  )
}
