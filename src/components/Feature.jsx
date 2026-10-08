import MediaPlaceholder from './MediaPlaceholder.jsx';
import styles from './Feature.module.css';

// The project's strongest single image, edge to edge, right after the
// title: the result comes before the system and the story.
// With `over`, the image holds a full screen (on a `background` band) and
// the second media slides up over it as you scroll, then both move on.
// `word` (depth trial) sets a giant word between the two: in front of the
// first media, behind the one sliding over.
export default function Feature({ kind = 'image', note, src, over, background, word }) {
  if (over) {
    return (
      <section className={`${styles.feature} ${styles.stack}`} style={{ '--feature-bg': background }}>
        <div className={styles.stage}>
          <MediaPlaceholder kind={kind} note={note} src={src} ratio="16 / 9" />
          {word && (
            <span className={styles.word} aria-hidden="true">
              {word}
            </span>
          )}
        </div>
        <div className={`${styles.stage} ${styles.over}`}>
          <MediaPlaceholder kind={over.kind} note={over.note} src={over.src} ratio="16 / 9" />
        </div>
      </section>
    );
  }
  return (
    <section className={styles.feature}>
      <MediaPlaceholder kind={kind} note={note} src={src} ratio="16 / 9" />
    </section>
  );
}
