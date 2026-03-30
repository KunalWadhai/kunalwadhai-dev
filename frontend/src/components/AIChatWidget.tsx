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
  onresult: (event: ISpeechRecognitionEvent) => void;
  onerror: (event: unknown) => void;
  onend: () => void;
  start(): void;
  stop(): void;
}

interface ISpeechRecognitionConstructor {
  new(): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: ISpeechRecognitionConstructor;
    webkitSpeechRecognition: ISpeechRecognitionConstructor;
  }
}

const SR = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;

const QUICK_PROMPTS = [
  'Summarise your backend journey',
  'Tell me about Guestara & Tuya IoT',
  'What is your best project?',
  'How can I contact you?',
  'What tech stack do you use?',
  'Any open-source work?',
]

const INITIAL_MSG: ChatMessage = {
  role: 'assistant',
  content: "Hey! 👋 I'm Kunal's AI assistant. Ask me anything about his skills, experience, projects, or how to reach him.",
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MSG])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [typing, setTyping] = useState(false)
  const [voiceActive, setVoiceActive] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [transcript, setTranscript] = useState('')

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recogRef = useRef<ISpeechRecognition | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || sending) return

    setSending(true)
    setTyping(true)
    const userMsg: ChatMessage = { role: 'user', content: trimmed }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setTranscript('')

    try {
      const history = nextMessages.slice(1).slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }))
      const historyWithoutLast = history.slice(0, -1)

      const res = await apiPost('/api/chat', { message: trimmed, history: historyWithoutLast })
      const answer = String(res?.answer || '').trim() || 'No response.'

      setTyping(false)
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }])

      // TTS
      if (ttsEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utt = new SpeechSynthesisUtterance(answer)
        utt.rate = 1.05
        utt.pitch = 1
        const voices = window.speechSynthesis.getVoices()
        const preferred = voices.find(
          (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('google'),
        ) || voices.find((v) => v.lang.startsWith('en'))
        if (preferred) utt.voice = preferred
        window.speechSynthesis.speak(utt)
      }
    } catch {
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Hmm, I couldn't reach the server right now. Make sure the backend is running at port 4000.",
        },
      ])
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }, [messages, sending, ttsEnabled])

  const toggleVoice = useCallback(() => {
    if (!SR) {
      alert('Speech recognition is not supported in this browser. Try Chrome.')
      return
    }

    if (voiceActive) {
      recogRef.current?.stop()
      setVoiceActive(false)
      return
    }

    const recog = new SR()
    recog.continuous = false
    recog.interimResults = true
    recog.lang = 'en-US'

    recog.onresult = (event) => {
      const interim = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('')
      setTranscript(interim)

      const final = Array.from(event.results)
        .filter((r) => r.isFinal)
        .map((r) => r[0].transcript)
        .join('')
      if (final) {
        setVoiceActive(false)
        send(final)
      }
    }

    recog.onerror = () => setVoiceActive(false)
    recog.onend = () => setVoiceActive(false)

    recogRef.current = recog
    recog.start()
    setVoiceActive(true)
  }, [voiceActive, send])

  const toggleTts = useCallback(() => {
    if (ttsEnabled) window.speechSynthesis?.cancel()
    setTtsEnabled((v) => !v)
  }, [ttsEnabled])

  const quickSend = useCallback((text: string) => send(text), [send])

  const shownQuick = useMemo(
    () => (messages.length <= 2 ? QUICK_PROMPTS : QUICK_PROMPTS.slice(0, 3)),
    [messages.length],
  )

  return (
    <>
      <button
        className="chatFAB"
        onClick={() => setOpen(true)}
        aria-label="Open AI Chat"
        style={{ display: open ? 'none' : undefined }}
      >
        <Bot size={26} />
        <span className="chatFAB__tooltip">Ask me anything</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="chatModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
          >
            <motion.div
              className="chatModal__panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              {/* Header */}
              <div className="chatModal__header">
                <div className="chatModal__avatar">🤖</div>
                <div className="chatModal__info">
                  <div className="chatModal__name">Kunal's AI Assistant</div>
                  <div className="chatModal__status">Online — portfolio-tuned</div>
                </div>
                <div className="chatModal__actions">
                  <button
                    className={`iconBtn ${ttsEnabled ? 'iconBtn--active' : ''}`}
                    onClick={toggleTts}
                    title={ttsEnabled ? 'Mute voice responses' : 'Enable voice responses'}
                  >
                    {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                  <button
                    className={`iconBtn ${voiceActive ? 'iconBtn--voice-active' : ''}`}
                    onClick={toggleVoice}
                    title={voiceActive ? 'Stop listening' : 'Ask by voice'}
                  >
                    {voiceActive ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                  <button className="iconBtn" onClick={() => setOpen(false)} title="Close">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="chatModal__messages" role="log" aria-live="polite">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    className={`chatMsg chatMsg--${m.role}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="chatMsg__icon">
                      {m.role === 'assistant' ? <Bot size={16} /> : <User size={14} />}
                    </div>
                    <div className="chatMsg__bubble">{m.content}</div>
                  </motion.div>
                ))}

                {typing && (
                  <motion.div
                    className="chatMsg chatMsg--assistant"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="chatMsg__icon"><Bot size={16} /></div>
                    <div className="typingIndicator">
                      <span /><span /><span />
                    </div>
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Voice transcript */}
              {voiceActive && (
                <div className="voicePreview">
                  {transcript || 'Listening…'}
                </div>
              )}

              {/* Quick prompts */}
              <div className="chatModal__quick">
                {shownQuick.map((p) => (
                  <button
                    key={p}
                    className="chip"
                    onClick={() => quickSend(p)}
                    disabled={sending}
                    type="button"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div className="chatModal__inputRow">
                <button
                  className={`iconBtn ${voiceActive ? 'iconBtn--voice-active' : ''}`}
                  onClick={toggleVoice}
                  title={voiceActive ? 'Stop' : 'Voice input'}
                  type="button"
                >
                  {voiceActive ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <form
                  style={{ display: 'contents' }}
                  onSubmit={(e) => { e.preventDefault(); send(input) }}
                >
                  <input
                    ref={inputRef}
                    className="chatModal__input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={voiceActive ? 'Listening…' : 'Ask anything about Kunal…'}
                    disabled={sending || voiceActive}
                    aria-label="Chat input"
                  />
                  <button
                    className="chatModal__sendBtn"
                    type="submit"
                    disabled={sending || !input.trim()}
                    aria-label="Send"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
