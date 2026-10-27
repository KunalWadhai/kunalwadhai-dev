/**
 * Error Boundary — Catches React errors and displays fallback UI
 * Prevents entire app crash from component errors
 */

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console in development
    console.error('ErrorBoundary caught error:', error, errorInfo)
    
    // In production, you could send to error tracking service:
    // sendToErrorTracking(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__inner">
            <h1 className="error-boundary__title">Something went wrong</h1>
            <p className="error-boundary__message">
              An unexpected error occurred. Please refresh the page to try again.
            </p>
            <button
              className="btn btn--primary"
              onClick={() => window.location.href = '/'}
            >
              Return to home
            </button>
            
            {/* Show error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <details className="error-boundary__details">
                <summary>Error details</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
          </div>

          <style>{`
            .error-boundary {
              min-height: 100vh;
              display: grid;
              place-items: center;
              padding: var(--space-8);
              background: var(--bg-base);
              color: var(--text-primary);
            }

            .error-boundary__inner {
              max-width: 600px;
              text-align: center;
              display: flex;
              flex-direction: column;
              gap: var(--space-5);
            }

            .error-boundary__title {
              font-size: var(--text-3xl);
              font-weight: 600;
              margin: 0;
            }

            .error-boundary__message {
              font-size: var(--text-md);
              color: var(--text-secondary);
              margin: 0;
            }

            .error-boundary__details {
              margin-top: var(--space-4);
              padding: var(--space-4);
              background: var(--bg-raised);
              border: 1px solid var(--line-subtle);
              border-radius: var(--radius);
              text-align: left;
            }

            .error-boundary__details summary {
              cursor: pointer;
              font-weight: 600;
              margin-bottom: var(--space-2);
            }

            .error-boundary__details pre {
              font-size: var(--text-sm);
              color: var(--text-secondary);
              overflow-x: auto;
              margin: 0;
            }
          `}</style>
        </div>
      )
    }

    return this.props.children
  }
}
