import { useEffect } from 'react';
import styles from './ContactWindows.module.css';

// Per Neama: clicking Instagram, LinkedIn or "Email me" at the end of the
// home film floats two windows over it, Contact and Send a message, in the
// site's own language (warm white like the film's walls, the frame purple,
// mono labels, Montserrat). The copy is the film's own ("What should we
// plan next?", "Let's talk. Have a project in mind?").
//
// Design only for now (per Neama): the form doesn't send yet.
// Project types: Amit's list and the site's own categories, together
// (per Neama; spatial branding and experience as one), "Other" last.
const PROJECT_TYPES = [
  'Branding',
  'Packaging',
  'UX / UI',
  'Website / Digital',
  'Creative / Campaign',
  'Spatial Branding / Experience',
  'Book Covers',
  'Other',
];

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 10.5V17M8 7.2v.1M12 17v-6.5M12 13.5c0-1.8 1.2-3 2.6-3S17 11.4 17 13v4" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.3 6.7v.1" />
  </svg>
);

// Neama's email and profiles, each with its address under the label.
const ROWS = [
  { label: 'Email me', Icon: MailIcon, href: 'mailto:neama.klein@gmail.com', detail: 'neama.klein@gmail.com' },
  {
    label: 'LinkedIn',
    Icon: LinkedInIcon,
    href: 'https://www.linkedin.com/in/neama-klein-6b8981368/',
    detail: 'Neama Klein',
  },
  { label: 'Instagram', Icon: InstagramIcon, href: 'https://www.instagram.com/neamak2001/', detail: '@neamak2001' },
];

export default function ContactWindows({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={styles.layer} role="dialog" aria-modal="true" aria-label="Contact" onClick={onClose}>
      <div className={styles.windows} onClick={(e) => e.stopPropagation()}>
        <section className={styles.window}>
          <header className={styles.bar}>
            <span>Contact</span>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
              ×
            </button>
          </header>
          <div className={styles.body}>
            <h2 className={styles.title}>What should we plan next?</h2>
            <p className={styles.lead}>Let’s talk. Have a project in mind?</p>
            <ul className={styles.rows}>
              {ROWS.map(({ label, Icon, href, detail }) => {
                const content = (
                  <>
                    <Icon />
                    <span className={styles.rowText}>
                      <span className={styles.rowLabel}>{label}</span>
                      <span className={styles.rowDetail}>{detail}</span>
                    </span>
                    <span className={styles.arrow} aria-hidden="true">
                      ↗
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    <a
                      className={styles.row}
                      href={href}
                      {...(href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' })}
                    >
                      {content}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className={styles.window}>
          <header className={styles.bar}>
            <span>Send a message</span>
          </header>
          <form className={`${styles.body} ${styles.form}`} onSubmit={(e) => e.preventDefault()}>
            <label className={styles.field}>
              <span>Name</span>
              <input type="text" name="name" autoComplete="name" />
            </label>
            <label className={styles.field}>
              <span>Email</span>
              <input type="email" name="email" autoComplete="email" />
            </label>
            <label className={`${styles.field} ${styles.wide}`}>
              <span>Project type</span>
              <select name="type" defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className={`${styles.field} ${styles.wide}`}>
              <span>Message</span>
              <textarea name="message" rows={5} />
            </label>
            <button type="submit" className={`${styles.send} ${styles.wide}`}>
              Send message ↗
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
