import SectionLabel from './SectionLabel.jsx';
import styles from './Strategy.module.css';

export default function Strategy({ slip, heading, paragraphs }) {
  return (
    <section className={styles.wrap}>
      <SectionLabel slip={slip} heading={heading} className={styles.label} />
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
    </section>
  );
}
