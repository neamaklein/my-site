import styles from './SpatialRenders.module.css';

// Figma "Component 7": a single row of renders far wider than the page
// (4690px on a 1481px canvas), shown as a continuously moving strip.
export default function SpatialRenders({ images = [], note }) {
  if (!images.length) return null;
  const loop = [...images, ...images];
  return (
    <section className={styles.strip} aria-label={note}>
      <div className={styles.track} style={{ '--count': images.length }}>
        {loop.map((src, index) => (
          <img key={index} src={src} alt="" loading="lazy" aria-hidden={index >= images.length} />
        ))}
      </div>
    </section>
  );
}
