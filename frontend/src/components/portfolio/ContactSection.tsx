import { useState, type FormEvent } from 'react'
import { Github, Linkedin, Mail, Send, Twitter } from 'lucide-react'
import type { Profile } from '../../features/portfolio/types'
import { normalizeUrl } from '../../features/portfolio/utils'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export interface ContactSectionProps {
  readonly data: Profile
}

export function ContactSection({ data }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formSending, setFormSending] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return
    setFormSending(true)
    await new Promise((r) => setTimeout(r, 1500))
    setFormSending(false)
    setFormData({ name: '', email: '', message: '' })
  }

  const socials = [
    {
      icon: Github,
      platform: 'GitHub',
      href: normalizeUrl(data.social.githubUrl),
      handle: `@${data.social.githubHandle || 'KunalWadhai'}`,
      label: 'GitHub profile',
    },
    {
      icon: Linkedin,
      platform: 'LinkedIn',
      href: normalizeUrl(data.social.linkedinUrl),
      handle: '/in/kunal-wadhai',
      label: 'LinkedIn profile',
    },
    {
      icon: Twitter,
      platform: 'X',
      href: normalizeUrl(data.social.xUrl),
      handle: '@AloneWarrior27',
      label: 'X profile',
    },
    {
      icon: Mail,
      platform: 'Email',
      href: `mailto:${data.social.email}`,
      handle: data.social.email,
      label: 'Send email',
    },
  ] as const

  return (
    <section id="contact" className="section section--contact">
      <SectionHeader
        label="// contact"
        title="Let's build something durable"
        description="Ambitious products, architecture reviews, or a conversation about distributed systems — reach out."
      />

      <div className="contact-grid">
        <Reveal>
          <form className="contact__form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              className="contact__input"
              placeholder="Your name"
              required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            />
            <label className="sr-only" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              className="contact__input"
              type="email"
              placeholder="you@company.com"
              required
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            />
            <label className="sr-only" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              className="contact__input contact__textarea"
              placeholder="What are you building?"
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
            />
            <button type="submit" className="btn btn--primary contact__submit" disabled={formSending} data-hover>
              {formSending ? (
                <span className="dot-loader" aria-label="Sending">
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                <>
                  Send message <Send size={14} />
                </>
              )}
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.12} className="contact__aside">
          <div className="contact__socials">
            {socials.map(({ icon: Icon, platform, href, handle, label }) => (
              <a key={platform} className="contact-social" href={href} target="_blank" rel="noreferrer" aria-label={label} data-hover>
                <Icon size={20} className="contact-social__icon" />
                <div className="contact-social__info">
                  <span className="contact-social__platform">{platform}</span>
                  <span className="contact-social__handle">{handle}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="contact__status">
            <span className="contact__status-dot" aria-hidden="true" />
            Open to freelance & consulting
          </div>
        </Reveal>
      </div>
    </section>
  )
}
