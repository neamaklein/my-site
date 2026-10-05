import MediaPlaceholder from './MediaPlaceholder.jsx';
import styles from './Process.module.css';

// Figma "Frame 33": a full-bleed cover image pins under the nav, then a
// row of posters (also sticky) slides up over it, before both release.
export default function Process({ cover, row = [] }) {
  return (
    <section className={styles.stack}>
      <div className={styles.cover}>
        <MediaPlaceholder kind={cover.kind} note={cover.note} src={cover.src} ratio="auto" />
      </div>
      {row.length > 0 && (
        <div className={styles.rowCard}>
          <div className={styles.row}>
            {row.map((item) => (
              <MediaPlaceholder key={item.note} kind={item.kind} note={item.note} src={item.src} ratio="386 / 541" />
            ))}
          </div>
        </div>
      )}
      <div className={styles.hold} aria-hidden="true" />
    </section>
  );
}
