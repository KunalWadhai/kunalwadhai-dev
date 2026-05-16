import { useEffect, useRef, useState, type ReactNode } from 'react'
import { apiPost } from '../../lib/api'
import type { ChatMessage } from './types'

export function Section({
  id,
  title,
  subtitle,
  children,
  variant,
  titleAddon,
}: {
  id: string
  title: string
  subtitle: string
  children: ReactNode
  variant?: string
  titleAddon?: ReactNode
}) {
  return (
    <section id={id} className={`section ${variant ? `section--${variant}` : ''}`.trim()}>
      <h2>
        {title}
        {titleAddon}
      </h2>
      <p className="section-sub">{subtitle}</p>
      {children}
    </section>
  )
}

export function FadeIn({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function LogoBadge({
  src,
  alt,
  fallback,
  className,
}: {
  src?: string
  alt: string
  fallback: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return <div className={`logo-fallback ${className ?? ''}`.trim()} aria-hidden="true">{fallback}</div>
  }

  return (
    <img
      className={`logo-img ${className ?? ''}`.trim()}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

export function AssistantPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const logEndRef = useRef<HTMLDivElement | null>(null)

  const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (char) => {
      switch (char) {
        case '&':
          return '&amp;'
        case '<':
          return '&lt;'
        case '>':
          return '&gt;'
        case '"':
          return '&quot;'
        case "'":
          return '&#39;'
        default:
          return char
      }
    })

  const formatInline = (value: string) => {
    const escaped = escapeHtml(value)
    const withStrong = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    return withStrong.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noreferrer">$1</a>'
    )
  }

  const formatMessage = (value: string) => {
    const lines = value.split('\n')
    let html = ''
    let inList = false

    for (const line of lines) {
      const trimmed = line.trim()
      const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ')

      if (isBullet) {
        if (!inList) {
          html += '<ul>'
          inList = true
        }
        const bulletText = trimmed.replace(/^(-|•)\s+/, '')
        html += `<li>${formatInline(bulletText)}</li>`
        continue
      }

      if (inList) {
        html += '</ul>'
        inList = false
      }

      if (!trimmed) {
        html += '<br />'
        continue
      }

      html += `<p>${formatInline(trimmed)}</p>`
    }

    if (inList) html += '</ul>'
    return html
  }

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const formatTimestamp = () =>
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

  const localReply = (query: string) => {
    const q = query.toLowerCase()
    if (q.includes('guestara') || q.includes('experience')) return 'At Guestara, Kunal shipped PMS integrations and real-time sync APIs.'
    if (q.includes('stack')) return 'Primary stack: Node.js, Express, Redis, Postgres, MongoDB, CloudWatch.'
    if (q.includes('embedded')) return 'Embedded background includes Yocto, OpenBMC, Linux scripting, and board-level workflows.'
    return 'Kunal is a backend engineer focused on reliable systems and practical architecture.'
  }

  const sendMessage = async (value?: string) => {
    const message = (value ?? input).trim()
    if (!message || loading) return

    const userMessage: ChatMessage = { role: 'user', content: message, timestamp: formatTimestamp() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const history = [...messages, userMessage]
      const data = await apiPost('/api/chat', { message, history })
      const reply = data?.reply || data?.answer || 'No response received. Please retry.'
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, timestamp: formatTimestamp() }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: `${localReply(message)} (local fallback)`, timestamp: formatTimestamp() }])
    } finally {
      setLoading(false)
    }
  }

  const suggestions = [
    'How does Guestara integration work?',
    "What's your backend stack?",
    'Tell me about SupportIQ AI',
  ]

  return (
    <div className="assistant">
      <div className="assistant-log" aria-live="polite">
        {messages.length === 0 && (
          <div className="assistant-empty">
            <p>Signal online. Ask about projects, stack, or integrations.</p>
            <div className="assistant-suggestions">
              {suggestions.map((text) => (
                <button key={text} type="button" onClick={() => void sendMessage(text)}>
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`assistant-msg ${message.role}`}>
            <div className="assistant-meta">
              <span>{message.role === 'assistant' ? 'assistant' : 'you'}</span>
              <small>{message.timestamp}</small>
            </div>
            {message.role === 'assistant' ? (
              <div
                className="assistant-body"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
              />
            ) : (
              <p>{message.content}</p>
            )}
          </div>
        ))}
        {loading && (
          <div className="assistant-typing" aria-live="polite">
            <span />
            <span />
            <span />
          </div>
        )}
        <div ref={logEndRef} />
      </div>
      <div className="assistant-input">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              void sendMessage()
            }
          }}
          placeholder="Ask about architecture, integrations, projects..."
        />
        <button type="button" disabled={loading || !input.trim()} onClick={() => void sendMessage()}>
          Send
        </button>
      </div>
    </div>
  )
}
