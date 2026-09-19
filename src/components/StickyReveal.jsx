import MediaPlaceholder from './MediaPlaceholder.jsx';
import styles from './StickyReveal.module.css';

// Reproduces the sticky scroll-reveal from Figma: each item pins to the top
// of the viewport while its wrapper scrolls past, then the next item takes
// over. Only used where Figma actually marks nodes `sticky` (the process
// visuals and the Space Design gallery) — not a default for every gallery.
export default function StickyReveal({ items }) {
  return (
    <div className={styles.wrap}>
      {items.map((item, index) => (
        <div className={`${styles.item} ${item.full ? styles.full : ''}`} key={index}>
          <div className={styles.pin}>
            {item.type === 'row' ? (
              <div className={styles.row}>
                {item.media.map((media) => (
                  <MediaPlaceholder key={media.note} kind={media.kind} note={media.note} ratio="3 / 4" />
                ))}
              </div>
            ) : (
              <MediaPlaceholder kind={item.media.kind} note={item.media.note} ratio={item.full ? '16 / 9' : '4 / 3'} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
