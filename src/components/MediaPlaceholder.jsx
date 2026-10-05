import { useEditableMedia, useMediaKey } from '../review/ReviewProvider.jsx';
import styles from './MediaPlaceholder.module.css';

// Renders real media when `src` is given; otherwise falls back to a
// labeled placeholder box (used only where no real asset exists yet).
// In the review copy, an uploaded replacement takes the slot's place.
export default function MediaPlaceholder({ kind = 'image', note, ratio, src }) {
  const { override, editProps } = useEditableMedia(useMediaKey(src, note));
  const { className: editClass = '', ...handlers } = editProps;
  const style = ratio ? { '--ratio': ratio } : undefined;
  const mediaSrc = override?.url || src;
  const mediaKind = override ? (override.contentType.startsWith('video/') ? 'video' : 'image') : kind;

  if (mediaSrc) {
    const className = `${styles.media} ${editClass}`;
    if (mediaKind === 'video') {
      return override ? (
        <video className={className} style={style} src={mediaSrc} autoPlay muted loop playsInline {...handlers} />
      ) : (
        <video className={className} style={style} src={mediaSrc} controls playsInline {...handlers} />
      );
    }
    return <img className={className} style={style} src={mediaSrc} alt={note || ''} loading="lazy" {...handlers} />;
  }

  return (
    <div className={`${styles.placeholder} ${editClass}`} style={style} {...handlers}>
      <div>
        <span className={styles.kind}>{kind === 'video' ? '▶ video' : 'image'} placeholder</span>
        {note && <span>{note}</span>}
      </div>
    </div>
  );
}
