import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bot, Mic, MicOff, Send, User, Volume2, VolumeX, X } from 'lucide-react'
import { apiPost } from '../../lib/api'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

interface ISpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((ev: Event & { results: SpeechRecognitionResultList }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition
    webkitSpeechRecognition?: new () => ISpeechRecognition
  }
}

const QUICK_PROMPTS = [
  'What do you own in production?',
  'Walk me through the smart-lock path',
  'Which stack do you ship on?',
]

export function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "I'm Kunal's site agent. Ask about systems, shipping, or how the platform is wired.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<ISpeechRecognition | null>(null)

  const hasSpeech = useMemo(
    () => typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    [],
  )

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const speak = useCallback(
    (text: string) => {
      if (!ttsEnabled || !window.speechSynthesis) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 1.04
      window.speechSynthesis.speak(u)
    },
    [ttsEnabled],
  )

  const send = useCallback(
    async (text?: string) => {
      const msg = (text || input).trim()
      if (!msg || loading) return
      const userMsg: ChatMessage = { role: 'user', content: msg }
      setMessages((prev) => [...prev, userMsg])
      setInput('')
      setLoading(true)
      try {
        const data = await apiPost('/api/chat', {
          message: msg,
          history: [...messages, userMsg],
        })
        const reply =
          (data as { reply?: string }).reply || 'I could not complete that. Try again in a moment.'
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
        speak(reply)
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'The agent is offline or the API is unreachable.' },
        ])
      } finally {
        setLoading(false)
      }
    },
    [input, loading, messages, speak],
  )

  const toggleListening = useCallback(() => {
    if (!hasSpeech) return
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop()
      setListening(false)
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const sr = new SR()
    sr.continuous = false
    sr.interimResults = false
    sr.lang = 'en-US'
    sr.onresult = (ev) => {
      const text = ev.results[0]?.[0]?.transcript
      if (text) setInput((prev) => `${prev}${text}`)
    }
    sr.onend = () => setListening(false)
    sr.onerror = () => setListening(false)
    recognitionRef.current = sr
    sr.start()
    setListening(true)
  }, [hasSpeech, listening])

  return (
    <>
      {!open && (
        <button type="button" className="agent-fab" onClick={() => setOpen(true)} aria-label="Ask about Kunal's work">
          <Bot size={21} aria-hidden="true" />
          <span className="agent-fab__status" aria-hidden="true" />
        </button>
      )}

      {open && (
        <div className="agent-modal" onClick={() => setOpen(false)} role="presentation">
          <section
            className="agent-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="agent-title"
          >
            <header className="agent-panel__head">
              <div className="agent-panel__id">
                <span className="agent-panel__avatar"><Bot size={19} aria-hidden="true" /></span>
                <div>
                  <span className="agent-panel__eyebrow">PORTFOLIO ASSISTANT</span>
                  <strong id="agent-title">Ask about my work</strong>
                  <span className="agent-panel__presence"><i />Here to help with systems, shipping, and impact</span>
                </div>
              </div>
              <div className="agent-panel__actions">
                {hasSpeech && (
                  <button type="button" className={`icon-btn ${listening ? 'is-on' : ''}`} onClick={toggleListening} aria-label={listening ? 'Stop voice input' : 'Start voice input'} title={listening ? 'Stop voice input' : 'Voice input'}>
                    {listening ? <MicOff size={15} /> : <Mic size={15} />}
                  </button>
                )}
                <button
                  type="button"
                  className={`icon-btn ${ttsEnabled ? 'is-on' : ''}`}
                  onClick={() => setTtsEnabled((v) => !v)}
                  aria-label={ttsEnabled ? 'Turn off spoken responses' : 'Turn on spoken responses'}
                  title={ttsEnabled ? 'Turn off spoken responses' : 'Turn on spoken responses'}
                >
                  {ttsEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                </button>
                <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close assistant" title="Close">
                  <X size={15} />
                </button>
              </div>
            </header>

            <div className="agent-panel__msgs" aria-live="polite" aria-relevant="additions">
              {messages.map((m, i) => (
                <div key={`${m.role}-${i}`} className={`agent-msg agent-msg--${m.role}${i === 0 ? ' agent-msg--welcome' : ''}`}>
                  <span className="agent-msg__icon">{m.role === 'assistant' ? <Bot size={13} aria-hidden="true" /> : <User size={13} aria-hidden="true" />}</span>
                  <p>{m.content}</p>
                </div>
              ))}
              {loading && <div className="agent-typing" role="status" aria-label="Assistant is thinking"><span /><span /><span /></div>}
              <div ref={endRef} />
            </div>

            {messages.length <= 1 && (
              <div className="agent-panel__quick">
                <span className="agent-panel__quick-label">TRY ASKING</span>
                {QUICK_PROMPTS.map((q) => (
                  <button key={q} type="button" onClick={() => send(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form
              className="agent-panel__input"
              onSubmit={(e) => {
                e.preventDefault()
                void send()
              }}
            >
              <label className="sr-only" htmlFor="agent-message">Message</label>
              <input
                id="agent-message"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the platform…"
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()} aria-label="Send">
                <Send size={16} />
              </button>
            </form>
            <p className="agent-panel__footnote">Answers are based on the portfolio and may take a moment.</p>
          </section>
        </div>
      )}
    </>
  )
}
