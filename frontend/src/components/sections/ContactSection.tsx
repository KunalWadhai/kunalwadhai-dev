/**
 * Contact Section — Short and direct, no form
 */

import { profile } from '../../content/profile'
import { Mail, Github, Linkedin } from 'lucide-react'

export function ContactSection() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section__inner">
          <div className="section__title">
            <h2>Contact</h2>
          </div>

          <div className="section__content">
            <div className="contact-intro">
              <h3 className="contact-intro__title">Get in touch</h3>
              <p className="contact-intro__description">
                Open to backend engineering roles where platform ownership and system reliability matter.
              </p>
            </div>

            <div className="contact-links">
              <a href={`mailto:${profile.email}`} className="contact-link contact-link--primary">
                <Mail size={18} aria-hidden="true" />
                <span className="contact-link__text">{profile.email}</span>
              </a>

              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                <Linkedin size={18} aria-hidden="true" />
                <span className="contact-link__text">LinkedIn</span>
              </a>

              <a
                href={profile.social.github}
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                <Github size={18} aria-hidden="true" />
                <span className="contact-link__text">GitHub</span>
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
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .contact-intro__description {
          font-size: var(--text-md);
          color: var(--text-secondary);
          max-width: 60ch;
        }

        .contact-links {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          max-width: 400px;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-raised);
          border: 1px solid var(--line-subtle);
          border-radius: var(--radius);
          transition: border-color var(--dur-fast) var(--ease-out),
                      background var(--dur-fast) var(--ease-out);
          color: var(--text-secondary);
        }

        .contact-link:hover {
          border-color: var(--accent);
          background: var(--accent-wash);
          color: var(--text-primary);
        }

        .contact-link--primary {
          border-color: var(--accent);
          color: var(--text-primary);
        }

        .contact-link--primary:hover {
          background: var(--accent-wash);
        }

        .contact-link__text {
          font-size: var(--text-sm);
          font-weight: 500;
        }
      `}</style>
    </section>
  )
}
