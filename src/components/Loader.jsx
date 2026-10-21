import { useEffect, useState } from 'react';
import body from '../assets/loader/parts/body.png';
import head from '../assets/loader/parts/head.png';
import hair from '../assets/loader/parts/hair.png';
import laptop from '../assets/loader/parts/laptop.png';
import handLeft from '../assets/loader/parts/hand_left.png';
import handRight from '../assets/loader/parts/hand_right.png';
import eyes from '../assets/loader/parts/eyes.png';
import butterflies from '../assets/loader/parts/butterflies.png';
import styles from './Loader.module.css';

// Neama's character types while the page loads, and the whole layer fades
// out around her as she keeps typing. Shown once per visit: the flag is
// kept for the tab's session, so moving between projects never shows it.
const SEEN = 'loader-seen';
const MIN_SHOW = 3000; // one full typing loop, blink included
const FADE = 350;

// Her layers, cut from the illustration, each placed where it sits in the
// 889×1071 drawing. The head, hair, eyes and clips tilt together from the
// neck; the base under the face is flat skin, so the tilt never shows a
// second face.
const layer = (src, x, y, w, h, className) => (
  <image href={src} x={x} y={y} width={w} height={h} className={className} />
);

function alreadySeen() {
  try {
    return sessionStorage.getItem(SEEN) === '1';
  } catch {
    return false;
  }
}

function pageReady() {
  const loaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const min = new Promise((resolve) => setTimeout(resolve, MIN_SHOW));
  return Promise.all([loaded, fonts, min]);
}

export default function Loader() {
  const [phase, setPhase] = useState(() => (alreadySeen() ? 'gone' : 'loading'));

  useEffect(() => {
    if (phase === 'loading') {
      let cancelled = false;
      pageReady().then(() => {
        if (!cancelled) setPhase('fading');
      });
      return () => {
        cancelled = true;
      };
    }
    if (phase === 'fading') {
      try {
        sessionStorage.setItem(SEEN, '1');
      } catch {
        // Private windows may refuse storage; the loader just shows again.
      }
      const t = setTimeout(() => setPhase('gone'), FADE);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [phase]);

  if (phase === 'gone') return null;

  return (
    <div
      className={`${styles.loader} ${phase === 'fading' ? styles.fading : ''}`}
      role="status"
      aria-label="loading dispatch factory"
    >
      <svg className={styles.character} viewBox="0 0 889 1071" aria-hidden="true">
        {/* A soft shadow on the floor under her. */}
        <defs>
          <radialGradient id="loader-shadow">
            <stop offset="0" stopColor="#000" stopOpacity="0.28" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="505" cy="955" rx="400" ry="48" fill="url(#loader-shadow)" />
        {layer(body, 0, 0, 889, 1071)}
        <g className={styles.head}>
          {layer(head, 264, 116, 186, 184)}
          {layer(hair, 42, 57, 471, 512, styles.hair)}
          {layer(eyes, 342, 191, 83, 34, styles.eyes)}
          {layer(butterflies, 253, 38, 188, 52)}
        </g>
        {layer(laptop, 328, 516, 467, 260)}
        {layer(handLeft, 303, 665, 171, 66, styles.handLeft)}
        {layer(handRight, 464, 647, 71, 54, styles.handRight)}
      </svg>
      <p className={styles.text} aria-hidden="true">
        loading dispatch factory
        <span className={styles.dots}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    </div>
  );
}
