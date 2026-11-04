import styles from './SectionLabel.module.css';

// A section's headline. Apple-style: one large heading; the shipping
// language (packing slips) lives only in the page's moments. `eyebrow`: a
// chapter's own small line above it, where the project's copy has one.
export default function SectionLabel({ heading, eyebrow, sticky = false, className = '' }) {
  return (
    <div className={`${styles.wrap} ${sticky ? styles.sticky : ''} ${className}`}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2 className={`${styles.heading} reveal serif-section`}>{heading}</h2>
    </div>
  );
}
