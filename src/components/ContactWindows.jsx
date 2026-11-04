import { useEffect, useRef, useState } from 'react';
import styles from './ContactWindows.module.css';

// Per Neama: clicking Instagram, LinkedIn or "Email me" at the end of the
// home film floats two windows over it, Contact and Send a message, in the
// site's own language (warm white like the film's walls, the frame purple,
// all type in Montserrat). The copy is the film's own ("What should we
// plan next?", "Let's talk. Have a project in mind?").
//
// The form posts to /api/contact (worker/index.js), which emails Neama. A
// Cloudflare Turnstile check in invisible mode keeps bots out without
// showing anything; the send button's own label reports progress. Builds
// without that endpoint (GitHub Pages, Vercel) fall back to "Email me".
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

const CONTACT_EMAIL = 'neama.klein@gmail.com';
const TURNSTILE_SITEKEY = '0x4AAAAAAFldYYnyqN8uB3rR';
const SEND_LABEL = {
  idle: 'Send message ↗',
  sending: 'Sending…',
  sent: 'Sent. Thank you ✓',
  failed: 'Couldn’t send. Email me instead ↗',
};

let turnstileScript;
function loadTurnstile() {
  turnstileScript ||= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return turnstileScript;
}

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
  const [status, setStatus] = useState('idle');
  const checkSlot = useRef(null);
  const widget = useRef(null);
  const token = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    let gone = false;
    loadTurnstile()
      .then((turnstile) => {
        if (gone || !checkSlot.current) return;
        widget.current = turnstile.render(checkSlot.current, {
          sitekey: TURNSTILE_SITEKEY,
          callback: (value) => (token.current = value),
          'expired-callback': () => (token.current = null),
        });
      })
      .catch(() => {}); // no check means no token: sending then fails over to "Email me"
    return () => {
      gone = true;
      if (widget.current != null) window.turnstile?.remove(widget.current);
    };
  }, []);

  // The check runs on its own as the window opens; a quick sender waits up to 5s for it.
  const waitForToken = async () => {
    for (let i = 0; i < 50 && !token.current; i += 1) await new Promise((r) => setTimeout(r, 100));
    return token.current;
  };

  async function send(e) {
    e.preventDefault();
    if (status === 'sending') return;
    if (status === 'failed') {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
      return;
    }
    const form = e.currentTarget;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), token: await waitForToken() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('failed');
    } finally {
      // A token is good for one check only.
      token.current = null;
      if (widget.current != null) window.turnstile?.reset(widget.current);
    }
  }

  return (
    <div className={styles.layer} role="dialog" aria-modal="true" aria-label="Contact" onClick={onClose}>
      <div className={styles.windows} onClick={(e) => e.stopPropagation()}>
        {/* Per Neama: back to the site, an icon is enough. */}
        <button type="button" className={styles.back} onClick={onClose} aria-label="Back to the site">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>
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
          <form className={`${styles.body} ${styles.form}`} onSubmit={send}>
            <label className={styles.field}>
              <span>Name</span>
              <input type="text" name="name" autoComplete="name" required maxLength={200} />
            </label>
            <label className={styles.field}>
              <span>Email</span>
              <input type="email" name="email" autoComplete="email" required maxLength={254} />
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
              <textarea name="message" rows={5} required maxLength={5000} />
            </label>
            <button type="submit" className={`${styles.send} ${styles.wide}`} aria-live="polite">
              {SEND_LABEL[status]}
            </button>
          </form>
          {/* Invisible spam check: Turnstile puts its hidden frame here. */}
          <div ref={checkSlot} className={styles.check} />
        </section>
      </div>
    </div>
  );
}
