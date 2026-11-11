import { useEffect, useState } from 'react';
import { IN_PHONE } from './flags.js';
import styles from './Review.module.css';

// Review-copy only (per Neama): view the whole site as on a phone, from a
// desktop. The site runs again inside a 390×844 frame, so its own phone
// layout, the vertical film and every page apply as they would on a
// phone; it opens on the page being viewed. The frame shares this page's
// claude.ai connection, so saved edits show there too. The choice is
// remembered in this browser only.
const KEY = 'review-view';
const PHONE = { width: 390, height: 844 };

function read() {
  try {
    return localStorage.getItem(KEY) === 'mobile' ? 'mobile' : 'wide';
  } catch {
    return 'wide';
  }
}

// The same site, as a document of its own: this page's stylesheets and
// scripts, and its claude.ai connection handed down. Its address is a
// blob: one, so <base> points its relative URLs (images, fonts, the dev
// server's) back at this page's; the router allows for <base>.
function frameUrl() {
  // Inline module scripts too: on `npm run edit` the dev server's React
  // preamble is one.
  const tags = [...document.querySelectorAll('link[rel="stylesheet"], script[type="module"]')]
    .map((el) => {
      if (el.tagName === 'LINK') return `<link rel="stylesheet" crossorigin href="${el.href}">`;
      if (el.src) return `<script type="module" crossorigin src="${el.src}"></script>`;
      return `<script type="module">${el.textContent}</script>`;
    })
    .join('\n');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<base href="${document.baseURI}">
<script>try { window.claude = parent.claude; } catch (e) {}</script>
${tags}
</head>
<body><div id="root"></div></body>
</html>`;
  return URL.createObjectURL(new Blob([html], { type: 'text/html' }));
}

export function useView() {
  const [view, setView] = useState(read);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, view);
    } catch {
      // Storage blocked: the choice simply isn't remembered.
    }
  }, [view]);
  return [view, setView];
}

export function ViewToggle({ view, setView }) {
  return (
    <span className={styles.viewToggle} role="group" aria-label="View">
      {['wide', 'mobile'].map((option) => (
        <button key={option} type="button" aria-pressed={view === option} onClick={() => setView(option)}>
          {option === 'wide' ? 'Wide' : 'Mobile'}
        </button>
      ))}
    </span>
  );
}

export function PhoneFrame() {
  const [src, setSrc] = useState(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const url = frameUrl();
    setSrc(url + window.location.hash);
    return () => URL.revokeObjectURL(url);
  }, []);

  // Whole phone in view: shrink it on a screen shorter than it.
  useEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerHeight - 48) / PHONE.height));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  if (IN_PHONE || !src) return null;
  return (
    <div className={styles.phoneLayer} data-review-ui>
      <div
        className={styles.phone}
        style={{ width: PHONE.width * scale, height: PHONE.height * scale }}
      >
        <iframe
          name="phone-preview"
          title="The site on a phone"
          src={src}
          style={{ width: PHONE.width, height: PHONE.height, transform: `scale(${scale})` }}
        />
      </div>
    </div>
  );
}
