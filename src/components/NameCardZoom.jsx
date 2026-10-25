import { useEffect, useState } from 'react';
import zoom from '../assets/home/name-card-zoom.mp4';
import zoomTall from '../assets/home/name-card-zoom-mobile.mp4';
import styles from './NameCardZoom.module.css';

// Per Neama: the name card on the desk in the film's last frame opens her
// short zoom onto it. It plays once over the film (which ends on the same
// frame it starts from; upright phones get her vertical cut of it) and
// holds on the card, where her About me window
// rises beside it (in the contact windows' style; her words). The round
// arrow, as on the contact windows, goes back. Under her words, as in her
// reference: View CV, then where she is based and her focus.
const ABOUT =
  'When I’m not designing, you’ll find me dancing, doing Pilates, or trying something new in the kitchen. I love traveling and getting lost in richly imagined worlds, whether in books or anime. And my one requirement for a good evening? A glass of wine.';

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

// A target (per Neama: not the three circles).
const FocusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" />
  </svg>
);

const FACTS = [
  { label: 'Based in', detail: 'Rishon LeZion, Israel', Icon: PinIcon },
  { label: 'Focus', detail: 'Brand / UX UI / Digital / Spatial', Icon: FocusIcon },
];

// Fetch the zoom ahead, once the card can be clicked, so it starts at once.
export function preloadNameCardZoom(tall) {
  const video = document.createElement('video');
  video.preload = 'auto';
  video.muted = true;
  video.src = tall ? zoomTall : zoom;
  video.load();
  return video;
}

export default function NameCardZoom({ tall, onClose }) {
  const [ended, setEnded] = useState(false);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={styles.layer} role="dialog" aria-modal="true" aria-label="Neama Klein">
      <video
        className={styles.video}
        src={tall ? zoomTall : zoom}
        autoPlay
        muted
        playsInline
        aria-hidden="true"
        onEnded={() => setEnded(true)}
        onError={() => setEnded(true)}
      />
      {ended && (
        <section className={`${styles.about} ${tall ? styles.aboutTall : ''}`} aria-label="About me">
          <header className={styles.bar}>About me</header>
          <div className={styles.body}>
            {/* Per Neama (her pick). */}
            <h2 className={styles.title}>Off the grid.</h2>
            <p className={styles.text}>{ABOUT}</p>
            {/* TODO(Neama): the CV file to link. */}
            <button type="button" className={styles.cv}>
              View CV <span aria-hidden="true">↗</span>
            </button>
            <ul className={styles.facts}>
              {FACTS.map(({ label, detail, Icon }) => (
                <li key={label} className={styles.fact}>
                  <Icon />
                  <span className={styles.factText}>
                    <span className={styles.factLabel}>{label}</span>
                    <span className={styles.factDetail}>{detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <button type="button" className={styles.back} onClick={onClose} aria-label="Back to the site">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
      </button>
    </div>
  );
}
