import { useEffect, useState } from 'react';
import body from '../assets/loader/parts/body.png';
import hair from '../assets/loader/parts/hair.png';
import laptop from '../assets/loader/parts/laptop.png';
import handLeft from '../assets/loader/parts/hand_left.png';
import handRight from '../assets/loader/parts/hand_right.png';
import eyes from '../assets/loader/parts/eyes.png';
import butterflies from '../assets/loader/parts/butterflies.png';
import styles from './Loader.module.css';

// Neama's character types while the page loads, then looks up at the
// viewer and the whole layer fades out. Shown once per visit: the flag is
// kept for the tab's session, so moving between projects never shows it.
const SEEN = 'loader-seen';
const MIN_SHOW = 1500;
const LOOK_UP = 700; // the look-up, before the fade
const FADE = 600;

// Her layers, cut from the illustration, each placed where it sits in the
// 889×1071 drawing (bottom to top).
const LAYERS = [
  { src: body, x: 0, y: 0, w: 889, h: 1071 },
  { src: hair, x: 42, y: 57, w: 471, h: 512, className: styles.hair },
  { src: laptop, x: 328, y: 516, w: 467, h: 260 },
  { src: handLeft, x: 303, y: 665, w: 171, h: 66, className: styles.handLeft },
  { src: handRight, x: 464, y: 647, w: 71, h: 54, className: styles.handRight },
  { src: eyes, x: 342, y: 191, w: 83, h: 34, className: styles.eyes, group: styles.gaze },
  { src: butterflies, x: 253, y: 38, w: 188, h: 52 },
];

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
        if (!cancelled) setPhase('loaded');
      });
      return () => {
        cancelled = true;
      };
    }
    if (phase === 'loaded') {
      const t = setTimeout(() => setPhase('fading'), LOOK_UP);
      return () => clearTimeout(t);
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
      className={`${styles.loader} ${phase !== 'loading' ? styles.loaded : ''} ${
        phase === 'fading' ? styles.fading : ''
      }`}
      role="status"
      aria-label="loading dispatch factory"
    >
      <svg className={styles.character} viewBox="0 0 889 1071" aria-hidden="true">
        {LAYERS.map(({ src, x, y, w, h, className, group }) => {
          const image = (
            <image key={src} href={src} x={x} y={y} width={w} height={h} className={className} />
          );
          return group ? (
            <g key={src} className={group}>
              {image}
            </g>
          ) : (
            image
          );
        })}
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
