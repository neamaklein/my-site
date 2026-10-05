import MediaPlaceholder from './MediaPlaceholder.jsx';
import styles from './Feature.module.css';

// The project's strongest single image, edge to edge, right after the
// title: the result comes before the system and the story.
export default function Feature({ kind = 'image', note, src }) {
  return (
    <section className={styles.feature}>
      <MediaPlaceholder kind={kind} note={note} src={src} ratio="16 / 9" />
    </section>
  );
}
