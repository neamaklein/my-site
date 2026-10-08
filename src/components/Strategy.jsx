import SectionLabel from './SectionLabel.jsx';
import styles from './Strategy.module.css';

// `dir`/`lang` let a project keep copy in its original language (e.g. Hebrew).
export default function Strategy({ heading, paragraphs, dir, lang }) {
  return (
    <section className={styles.wrap}>
      <SectionLabel heading={heading} className={styles.label} />
      <div className={styles.body} dir={dir} lang={lang}>
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
