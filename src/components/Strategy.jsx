import styles from './Strategy.module.css';

export default function Strategy({ slip, heading, paragraphs }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.label}>
        <span className={styles.slip}>{slip}</span>
        <h2 className={styles.heading}>{heading}</h2>
      </div>
      <div className={styles.body}>
        {paragraphs.map((paragraph) => {
          const text = typeof paragraph === 'string' ? paragraph : paragraph.text;
          const lead = typeof paragraph === 'string' ? null : paragraph.lead;
          return (
            <p key={text.slice(0, 40)}>
              {lead && <strong>{lead}</strong>}
              {text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
