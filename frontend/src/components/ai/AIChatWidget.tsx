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
        <button type="button" className="agent-fab" onClick={() => setOpen(true)} aria-label="Open AI agent">
          <Bot size={22} />
        </button>
      )}

      {open && (
        <div className="agent-modal" onClick={() => setOpen(false)}>
          <div className="agent-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="AI agent">
            <header className="agent-panel__head">
              <div className="agent-panel__id">
                <Bot size={16} />
                <div>
                  <strong>Site agent</strong>
                  <span>Live · grounded on profile</span>
                </div>
              </div>
              <div className="agent-panel__actions">
                {hasSpeech && (
                  <button type="button" className="icon-btn" onClick={toggleListening} aria-label="Voice input">
                    {listening ? <MicOff size={15} /> : <Mic size={15} />}
                  </button>
                )}
                <button
                  type="button"
                  className={`icon-btn ${ttsEnabled ? 'is-on' : ''}`}
                  onClick={() => setTtsEnabled((v) => !v)}
                  aria-label="Toggle speech"
                >
                  {ttsEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                </button>
                <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close">
                  <X size={15} />
                </button>
              </div>
            </header>

            <div className="agent-panel__msgs">
              {messages.map((m, i) => (
                <div key={`${m.role}-${i}`} className={`agent-msg agent-msg--${m.role}`}>
                  <span className="agent-msg__icon">{m.role === 'assistant' ? <Bot size={12} /> : <User size={12} />}</span>
                  <p>{m.content}</p>
                </div>
              ))}
              {loading && <div className="agent-typing" aria-hidden="true"><span /><span /><span /></div>}
              <div ref={endRef} />
            </div>

            {messages.length <= 1 && (
              <div className="agent-panel__quick">
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
              <input
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
          </div>
        </div>
      )}
    </>
  )
}
