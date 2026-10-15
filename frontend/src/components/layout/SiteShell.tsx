import type { ReactNode } from 'react'
import { BackgroundGrid } from './BackgroundGrid'
import { Header } from './Header'
import { Footer } from './Footer'
import { TelemetryBar } from './TelemetryBar'
import { AIChatWidget } from '../ai/AIChatWidget'

export interface SiteShellProps {
  readonly children: ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <BackgroundGrid />
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <TelemetryBar />
      <Header />
      {children}
      <Footer />
      <AIChatWidget />
    </>
  )
}
