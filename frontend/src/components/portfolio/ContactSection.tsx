import { useState } from 'react'
import { Mail } from 'lucide-react'
import type { Profile } from '../../features/portfolio/types'
import { normalizeUrl } from '../../features/portfolio/utils'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export interface ContactSectionProps {
  readonly data: Profile
}

/**
 * Brand-accurate logo via cdn.simpleicons.org
 * Format: https://cdn.simpleicons.org/<slug>/<hex-colour>
 * Content licensed under CC0 1.0 — https://simpleicons.org/legal.html
 */
interface Social {
  platform: string
  handle: string
  href: string
  label: string
  /** simpleicons.org slug */
  iconSlug: string
  /** Brand hex (no #) used to tint the logo */
  brandColor: string
  /** CSS accent used for card hover glow */
  accentVar: string
  description: string
}

function SocialCard({ platform, handle, href, label, iconSlug, brandColor, accentVar, description }: Social) {
  const [imgFailed, setImgFailed] = useState(false)
  const isMailto = href.startsWith('mailto:')

  return (
    <a
      href={href}
      target={isMailto ? undefined : '_blank'}
      rel={isMailto ? undefined : 'noreferrer'}
      className="social-card"
      aria-label={label}
      style={{ '--social-accent': `var(${accentVar})` } as React.CSSProperties}
    >
      {/* Top accent stripe */}
      <div className="social-card__stripe" aria-hidden="true" />

      {/* Logo */}
      <div className="social-card__logo-wrap" aria-hidden="true">
        {imgFailed ? (
          <span className="social-card__logo-fallback">{platform[0]}</span>
        ) : (
          <img
            src={`https://cdn.simpleicons.org/${iconSlug}/${brandColor}`}
            alt=""
            className="social-card__logo"
            width={28}
            height={28}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>

      {/* Text */}
      <div className="social-card__body">
        <span className="social-card__platform">{platform}</span>
        <span className="social-card__handle">{handle}</span>
        <span className="social-card__desc">{description}</span>
      </div>

      {/* External link arrow */}
      <svg
        className="social-card__arrow"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </a>
  )
}

export function ContactSection({ data }: ContactSectionProps) {
  const socials: Social[] = [
    {
      platform: 'Gmail',
      handle: data.social.email,
      href: `mailto:${data.social.email}?subject=Opportunity%20for%20Kunal`,
      label: 'Send an email',
      iconSlug: 'gmail',
      brandColor: 'EA4335',
      accentVar: '--contact-gmail',
      description: 'Fastest response · typically within 24 h',
    },
    {
      platform: 'GitHub',
      handle: `@${data.social.githubHandle || 'KunalWadhai'}`,
      href: normalizeUrl(data.social.githubUrl),
      label: 'GitHub profile',
      iconSlug: 'github',
      brandColor: 'ffffff',
      accentVar: '--contact-github',
      description: 'Source code · projects · activity',
    },
    {
      platform: 'LinkedIn',
      handle: '/in/kunal-wadhai',
      href: normalizeUrl(data.social.linkedinUrl),
      label: 'LinkedIn profile',
      iconSlug: 'linkedin',
      brandColor: '0A66C2',
      accentVar: '--contact-linkedin',
      description: 'Professional profile · connect',
    },
    {
      platform: 'X',
      handle: '@AloneWarrior27',
      href: normalizeUrl(data.social.xUrl),
      label: 'X profile',
      iconSlug: 'x',
      brandColor: 'ffffff',
      accentVar: '--contact-x',
      description: 'Thoughts on engineering · updates',
    },
  ]

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeader
          label="Contact"
          title="Get in touch"
          description="Open to software engineering roles, backend contract work, and interesting architecture conversations."
        />

        <div className="contact-layout">
          {/* Social cards grid */}
          <Reveal className="contact-socials-grid">
            {socials.map((s, i) => (
              <Reveal key={s.platform} delay={0.06 * i}>
                <SocialCard {...s} />
              </Reveal>
            ))}
          </Reveal>

          {/* Aside */}
          <Reveal delay={0.1} className="contact-aside">
            <div className="contact-status">
              <span className="contact-status__dot" aria-hidden="true" />
              <span>Open to opportunities</span>
            </div>

            <p className="contact-aside__note">
              Fastest response via email or LinkedIn. Response time is typically within 24 hours.
            </p>

            <a
              className="btn btn--primary contact-aside__cta"
              href={`mailto:${data.social.email}?subject=Opportunity%20for%20Kunal`}
            >
              <Mail size={15} aria-hidden="true" />
              Send an email
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
