import { useEffect } from 'react';
import zoom from '../assets/home/name-card-zoom.mp4';
import styles from './NameCardZoom.module.css';

// Per Neama: the name card on the desk in the film's last frame opens her
// short zoom onto it. It plays once over the film (which ends on the same
// frame it starts from) and holds on the card; the round arrow, as on the
// contact windows, goes back.
export default function NameCardZoom({ tall, onClose }) {
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
      />
      <button type="button" className={styles.back} onClick={onClose} aria-label="Back to the site">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
      </button>
    </div>
  );
}
