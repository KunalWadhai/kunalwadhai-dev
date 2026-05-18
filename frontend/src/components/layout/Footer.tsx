import { ChevronUp } from 'lucide-react'

export interface FooterProps {
  readonly onScrollTop: () => void
}

export function Footer({ onScrollTop }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__left">
        <span className="footer__wordmark">Kunal Wadhai</span>
        <span className="footer__meta">Backend Engineer · {year}</span>
      </div>
      <button type="button" className="footer__top" onClick={onScrollTop} aria-label="Back to top" data-hover>
        <ChevronUp size={18} />
      </button>
    </footer>
  )
}
