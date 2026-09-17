import styles from './Strategy.module.css';

export default function Strategy({ slip, heading, paragraphs }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.label}>
        <span className={styles.slip}>{slip}</span>
        <h2 className={styles.heading}>{heading}</h2>
      </div>
      <div className={styles.body}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
