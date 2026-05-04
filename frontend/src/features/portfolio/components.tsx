import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { apiPost } from '../../lib/api'
import type { ChatMessage } from './types'

export function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <section id={id} className="section">
      <h2>{title}</h2>
      <p className="section-sub">{subtitle}</p>
      {children}
    </section>
  )
}

export function FadeIn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function AssistantPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Signal online. Ask about Kunal's projects, stack, or backend architecture." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const logEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

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

    const userMessage: ChatMessage = { role: 'user', content: message }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const history = [...messages, userMessage]
      const data = await apiPost('/api/chat', { message, history })
      const reply = data?.reply || data?.answer || 'No response received. Please retry.'
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: `${localReply(message)} (local fallback)` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="assistant">
      <div className="assistant-log" aria-live="polite">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`assistant-msg ${message.role}`}>
            <span>{message.role === 'assistant' ? 'assistant' : 'you'}</span>
            <p>{message.content}</p>
          </div>
        ))}
        {loading && <div className="assistant-typing">typing...</div>}
        <div ref={logEndRef} />
      </div>
      <div className="assistant-actions">
        <button type="button" onClick={() => sendMessage('What has Kunal shipped at Guestara?')}>Guestara impact</button>
        <button type="button" onClick={() => sendMessage('What backend stack does he use?')}>Stack</button>
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
