import MediaPlaceholder from './MediaPlaceholder.jsx';
import styles from './Hero.module.css';

export default function Hero({ heading, subtitle, scrollLabel }) {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <MediaPlaceholder kind="image" note="hero background" ratio="16 / 9" />
      </div>
      <div className={styles.content}>
        {heading ? (
          <h1 className={styles.heading}>{heading}</h1>
        ) : (
          <p className={styles.empty}>[ hero heading — not written yet ]</p>
        )}
        {subtitle ? (
          <p className={styles.subtitle}>{subtitle}</p>
        ) : (
          <p className={styles.empty}>[ hero subtitle — not written yet ]</p>
        )}
      </div>
      {scrollLabel && (
        <div className={`mono-tag ${styles.scroll}`}>
          <span>{scrollLabel}</span>
          <span aria-hidden="true">↓</span>
        </div>
      )}
    </section>
  );
}
