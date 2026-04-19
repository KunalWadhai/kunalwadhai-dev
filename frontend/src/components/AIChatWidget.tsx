import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Mic, MicOff, Volume2, VolumeX, Send, Bot, User } from 'lucide-react'
import { apiPost } from '../lib/api'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

interface ISpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((ev: ISpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((ev: Event & { error: string }) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

const QUICK_PROMPTS = [
  'Tell me about yourself',
  'What technologies do you use?',
  'Describe your experience',
  'What projects have you built?',
]

export function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hey! I'm Kunal's AI assistant. Ask me anything about his skills, experience, or projects." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(false)
  const [interimText, setInterimText] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<ISpeechRecognition | null>(null)

  const hasSpeech = useMemo(
    () => typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    []
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // ── Speech-to-Text ───────────────────────────────
  const toggleListening = useCallback(() => {
    if (!hasSpeech) return

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop()
      setListening(false)
      setInterimText('')
      return
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const sr = new SR()
    sr.continuous = false
    sr.interimResults = true
    sr.lang = 'en-US'

    sr.onresult = (ev) => {
      let final = ''
      let interim = ''
      for (let i = 0; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) {
          final += ev.results[i][0].transcript
        } else {
          interim += ev.results[i][0].transcript
        }
      }
      if (final) {
        setInput((prev) => prev + final)
        setInterimText('')
      } else {
        setInterimText(interim)
      }
    }

    sr.onend = () => {
      setListening(false)
      setInterimText('')
    }
    sr.onerror = () => {
      setListening(false)
      setInterimText('')
    }

    recognitionRef.current = sr
    sr.start()
    setListening(true)
  }, [hasSpeech, listening])

  // ── TTS ──────────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 1.05
    u.pitch = 1
    window.speechSynthesis.speak(u)
  }, [ttsEnabled])

  // ── Send message ─────────────────────────────────
  const send = useCallback(async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return

    const userMsg: ChatMessage = { role: 'user', content: msg }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const data = await apiPost('/api/chat', {
        message: msg,
        history,
      })

      // Backend returns { ok: true, reply: string }
      const reply = data.reply || data.answer || 'Sorry, I could not process that.'
      const assistantMsg: ChatMessage = { role: 'assistant', content: reply }
      setMessages((prev) => [...prev, assistantMsg])
      speak(reply)
    } catch (err: unknown) {
      console.error('Chat error:', err)
      
      // Better error message handling
      let errorMsg = 'Sorry, something went wrong. Please try again.'
      
      const axiosErr = err as { response?: { data?: { error?: string; code?: string } } }
      if (axiosErr?.response?.data?.error) {
        errorMsg = axiosErr.response.data.error
      } else if (err instanceof Error) {
        // If it's a timeout or network error
        if (err.message?.includes('timeout')) {
          errorMsg = 'Request timed out. Please try again.'
        } else if (err.message?.includes('429')) {
          errorMsg = 'Too many requests. Please wait a moment and try again.'
        } else if (err.message?.includes('503') || err.message?.includes('502')) {
          errorMsg = 'AI service is temporarily unavailable. Please try again soon.'
        }
      }
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: errorMsg },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, speak])

  return (
    <>
      {/* ── FAB ─────────────────────────────────────── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            className="chatFAB"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            aria-label="Open AI Chat"
          >
            <Bot size={26} />
            <span className="chatFAB__tooltip">Ask me anything</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ──────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chatModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="chatModal__panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="chatModal__header">
                <div className="chatModal__avatar">
                  <Bot size={20} />
                </div>
                <div className="chatModal__info">
                  <div className="chatModal__name">Kunal's AI</div>
                  <div className="chatModal__status">Online</div>
                </div>
                <div className="chatModal__actions">
                  {hasSpeech && (
                    <button
                      className={`iconBtn ${listening ? 'iconBtn--voice-active' : ''}`}
                      onClick={toggleListening}
                      title={listening ? 'Stop listening' : 'Voice input'}
                    >
                      {listening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                  )}
                  <button
                    className={`iconBtn ${ttsEnabled ? 'iconBtn--active' : ''}`}
                    onClick={() => setTtsEnabled((v) => !v)}
                    title={ttsEnabled ? 'Mute TTS' : 'Enable TTS'}
                  >
                    {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                  <button className="iconBtn" onClick={() => setOpen(false)} title="Close">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="chatModal__messages">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    className={`chatMsg chatMsg--${m.role}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="chatMsg__icon">
                      {m.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <div className="chatMsg__bubble">{m.content}</div>
                  </motion.div>
                ))}

                {loading && (
                  <div className="chatMsg chatMsg--assistant">
                    <div className="chatMsg__icon">
                      <Bot size={14} />
                    </div>
                    <div className="typingIndicator">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick prompts  */}
              {messages.length <= 1 && (
                <div className="chatModal__quick">
                  {QUICK_PROMPTS.map((q) => (
                    <button key={q} className="chip" onClick={() => send(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Interim voice text */}
              {interimText && (
                <div className="voicePreview">{interimText}</div>
              )}

              {/* Input */}
              <div className="chatModal__inputRow">
                <input
                  ref={inputRef}
                  className="chatModal__input"
                  placeholder="Ask me anything…"
                  value={input}
                  disabled={loading}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      send()
                    }
                  }}
                />
                <button
                  className="chatModal__sendBtn"
                  disabled={loading || !input.trim()}
                  onClick={() => send()}
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
