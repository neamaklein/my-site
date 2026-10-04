import styles from './MediaPlaceholder.module.css';

// Renders real media when `src` is given; otherwise falls back to a
// labeled placeholder box (used only where no real asset exists yet).
export default function MediaPlaceholder({ kind = 'image', note, ratio, src }) {
  if (src) {
    const style = ratio ? { '--ratio': ratio } : undefined;
    return kind === 'video' ? (
      <video className={styles.media} style={style} src={src} controls playsInline />
    ) : (
      <img className={styles.media} style={style} src={src} alt={note || ''} loading="lazy" />
    );
  }

  return (
    <div className={styles.placeholder} style={ratio ? { '--ratio': ratio } : undefined}>
      <div>
        <span className={styles.kind}>{kind === 'video' ? '▶ video' : 'image'} placeholder</span>
        {note && <span>{note}</span>}
      </div>
    </div>
  );
}
