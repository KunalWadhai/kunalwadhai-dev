import { Link } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { BackgroundGrid } from '../components/layout/BackgroundGrid'

export function NotFoundPage() {
  return (
    <>
      <BackgroundGrid />
      <a href="#main" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-16))', paddingBottom: 'var(--space-16)' }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>404</p>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 600, marginBottom: 'var(--space-5)' }}>Page not found</h1>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--accent)' }}>
            ← Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
