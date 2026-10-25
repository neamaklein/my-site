import { useEffect, useState } from 'react';
import zoom from '../assets/home/name-card-zoom.mp4';
import styles from './NameCardZoom.module.css';

// Per Neama: the name card on the desk in the film's last frame opens her
// short zoom onto it. It plays once over the film (which ends on the same
// frame it starts from) and holds on the card, where her About me window
// rises beside it (in the contact windows' style; her words). The round
// arrow, as on the contact windows, goes back.
const ABOUT =
  'When I’m not designing, you’ll find me dancing, doing Pilates, or trying something new in the kitchen. I love traveling and getting lost in richly imagined worlds, whether in books or anime. And my one requirement for a good evening? A glass of wine.';

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
        className={`${styles.video} ${tall ? styles.tall : ''}`}
        src={zoom}
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
          <p className={styles.text}>{ABOUT}</p>
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
