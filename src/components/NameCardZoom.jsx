import { useCallback, useEffect, useRef, useState } from 'react';
import zoom from '../assets/home/name-card-zoom.mp4';
import zoomTall from '../assets/home/name-card-zoom-mobile.mp4';
import zoomBack from '../assets/home/name-card-zoom-reverse.mp4';
import zoomBackTall from '../assets/home/name-card-zoom-mobile-reverse.mp4';
import styles from './NameCardZoom.module.css';

// Per Neama: the name card on the desk in the film's last frame opens her
// short zoom onto it. It plays once over the film (which ends on the same
// frame it starts from; upright phones get her vertical cut of it) and
// holds on the card, where her About me window
// rises beside it (in the contact windows' style; her words). The round
// arrow, as on the contact windows, goes back: the zoom plays in reverse
// (a reversed copy of the clip, from wherever the zoom had got to) and
// lands on the film's last frame (per Neama). Under her words, as in her
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

// The window rises while the camera is still settling on the card, not
// after the whole clip (per Neama: waiting for the end took too long).
const ABOUT_AT = 2;
// The camera stops moving 2.55s in (both cuts); the rest of the clip holds
// on the card, so the way back skips that hold.
const MOTION_END = 2.55;

export default function NameCardZoom({ tall, onClose }) {
  const [ended, setEnded] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [reversing, setReversing] = useState(false);
  const forward = useRef(null);
  const backward = useRef(null);

  const goBack = useCallback(() => {
    if (leaving) return;
    const from = forward.current;
    const to = backward.current;
    setLeaving(true);
    if (!from || !to || !to.duration) {
      onClose();
      return;
    }
    from.pause();
    to.currentTime = Math.max(0, to.duration - Math.min(from.currentTime, MOTION_END));
    to.play().catch(onClose);
  }, [leaving, onClose]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && goBack();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goBack]);

  return (
    <div className={styles.layer} role="dialog" aria-modal="true" aria-label="Neama Klein">
      <video
        ref={forward}
        className={styles.video}
        src={tall ? zoomTall : zoom}
        autoPlay
        muted
        playsInline
        aria-hidden="true"
        onTimeUpdate={(e) => e.currentTarget.currentTime >= ABOUT_AT && setEnded(true)}
        onEnded={() => setEnded(true)}
        onError={() => setEnded(true)}
      />
      {/* The way back: shown once it is playing, over the forward clip. */}
      <video
        ref={backward}
        className={`${styles.video} ${styles.backward} ${reversing ? styles.shown : ''}`}
        src={tall ? zoomBackTall : zoomBack}
        preload="auto"
        muted
        playsInline
        aria-hidden="true"
        onPlaying={() => setReversing(true)}
        onEnded={onClose}
        onError={() => leaving && onClose()}
      />
      {ended && !leaving && (
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
      {!leaving && (
        <button type="button" className={styles.back} onClick={goBack} aria-label="Back to the site">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}
