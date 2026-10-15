import { Link } from 'react-router-dom'
import { SiteShell } from '../components/layout/SiteShell'

export function NotFoundPage() {
  return (
    <SiteShell>
      <main id="main" className="page-main">
        <div className="container">
          <p className="label">404</p>
          <h1>Page not found</h1>
          <Link to="/" className="cs-back-link">
            ← Back to home
          </Link>
        </div>
      </main>
    </SiteShell>
  )
}
