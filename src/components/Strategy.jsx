import SectionLabel from './SectionLabel.jsx';
import styles from './Strategy.module.css';

// `dir`/`lang` let a project keep copy in its original language (e.g. Hebrew).
export default function Strategy({ heading, paragraphs, dir, lang }) {
  return (
    <section className={styles.wrap}>
      {heading && <SectionLabel heading={heading} className={styles.label} />}
      <div className={styles.body} dir={dir} lang={lang}>
        {paragraphs.map((paragraph) => {
          const text = typeof paragraph === 'string' ? paragraph : paragraph.text;
          const lead = typeof paragraph === 'string' ? null : paragraph.lead;
          // `before`: words ahead of the bold lead ("The existing **Wheel of Time** covers...").
          const before = typeof paragraph === 'string' ? null : paragraph.before;
          return (
            <p key={`${before || ''}${lead || ''}${text.slice(0, 40)}`}>
              {before}
              {lead && <strong>{lead}</strong>}
              {text}
            </p>
          );
        })}
      </div>
    </section>
  );
}
