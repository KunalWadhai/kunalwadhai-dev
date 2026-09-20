import { ArrowUp } from 'lucide-react'

export interface FooterProps {
  readonly onScrollTop: () => void
}

export function Footer({ onScrollTop }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__left">
          <span className="footer__name">Kunal Wadhai</span>
          <span className="footer__meta">
            © {year} · Built with React + TypeScript
          </span>
        </div>

        <div className="footer__right">
          <a
            href="https://github.com/KunalWadhai"
            target="_blank"
            rel="noreferrer"
            className="footer__link"
            aria-label="GitHub"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/kunal-wadhai/"
            target="_blank"
            rel="noreferrer"
            className="footer__link"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href="mailto:kunalwadhai456@gmail.com"
            className="footer__link"
            aria-label="Email"
          >
            Email
          </a>
          <button
            type="button"
            className="footer__top-btn"
            onClick={onScrollTop}
            aria-label="Back to top"
          >
            <ArrowUp size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  )
}
