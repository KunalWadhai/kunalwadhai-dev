import { profile } from '../../content/profile'
import { SITE } from '../../content/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__meta">
        <p>
          {profile.name} · {year} · {SITE.timezoneLabel}
        </p>
        <p className="footer__tag">Backend-first. Shipped with intent.</p>
      </div>
      <div className="footer__name" aria-hidden="true">
        Kunal Wadhai
      </div>
    </footer>
  )
}
