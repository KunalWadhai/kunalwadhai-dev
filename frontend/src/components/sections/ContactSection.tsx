/**
 * Contact Section — Short and direct, no form.
 * Email link has copy-to-clipboard with a toast confirmation.
 */

import { profile } from '../../content/profile'
import { GmailIcon } from '../layout/GmailIcon'
import { SocialBrandIcon } from '../layout/SocialBrandIcon'

export function ContactSection() {
  return (
    <section id="contact" className="section" data-reveal>
      <div className="container">
        <div className="section__inner">
          <div className="section__title">
            <h2>Contact</h2>
          </div>

          <div className="section__content">
            <div className="contact-intro">
              <h3 className="contact-intro__title">Open to the right opportunity</h3>
              <p className="contact-intro__description">
                I'm looking for backend or full-stack engineering roles where owning systems end
                to end — reliability, integrations, and the interfaces teams depend on — is the job.
                If that's what you're hiring for, let's talk.
              </p>
            </div>

            <div className="contact-links">
              <a
                href={`mailto:${profile.email}`}
                className="contact-link contact-link--primary"
                aria-label="Email Kunal"
                title="Email Kunal"
              >
                <GmailIcon size={17} />
                <span className="contact-link__text">Email</span>
              </a>

              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                <SocialBrandIcon brand="linkedin" size={17} />
                <span className="contact-link__text">LinkedIn</span>
              </a>

              <a
                href={profile.social.github}
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                <SocialBrandIcon brand="github" size={17} />
                <span className="contact-link__text">GitHub</span>
              </a>
              <a
                href={profile.social.twitter}
                target="_blank"
                rel="noreferrer"
                className="contact-link"
                aria-label="X profile"
              >
                <SocialBrandIcon brand="x" size={17} />
                <span className="contact-link__text">X</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-intro {
          margin-bottom: var(--space-8);
        }

        .contact-intro__title {
          font-size: var(--text-2xl);
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .contact-intro__description {
          font-size: var(--text-md);
          line-height: 1.65;
          color: var(--text-secondary);
          max-width: 56ch;
        }

        .contact-links {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          max-width: 440px;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-raised);
          border: 1px solid var(--line-subtle);
          border-radius: var(--radius-md);
          box-shadow: var(--shine-top);
          transition: border-color var(--dur-fast) var(--ease-out),
                      background var(--dur-fast) var(--ease-out),
                      transform var(--dur-fast) var(--ease-out);
          color: var(--text-secondary);
          text-decoration: none;
        }

        .contact-link:hover {
          border-color: var(--line-strong);
          background: var(--bg-surface-2);
          color: var(--text-primary);
          transform: translateY(-1px);
        }

        .contact-link--primary {
          border-color: var(--accent-border);
          background: var(--accent-wash);
          color: var(--text-primary);
        }

        .contact-link--primary:hover {
          border-color: var(--accent);
          background: var(--accent-wash);
        }

        .contact-link__icon {
          flex-shrink: 0;
          color: var(--text-muted);
        }

        .contact-link--primary .contact-link__icon {
          color: var(--accent);
        }

        .contact-link__text {
          flex: 1;
          font-size: var(--text-sm);
          font-weight: 500;
          color: inherit;
          text-decoration: none;
        }

        .contact-link__copy {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--line-subtle);
          display: grid;
          place-items: center;
          color: var(--text-muted);
          transition: color var(--dur-fast) var(--ease-out),
                      border-color var(--dur-fast) var(--ease-out),
                      background var(--dur-fast) var(--ease-out);
          flex-shrink: 0;
        }

        .contact-link__copy:hover {
          color: var(--text-primary);
          border-color: var(--line-strong);
          background: rgba(128, 128, 160, 0.08);
        }
      `}</style>
    </section>
  )
}
