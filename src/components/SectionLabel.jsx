import styles from './SectionLabel.module.css';

// A section's headline. Apple-style: one large heading, no eyebrow; the
// shipping language (packing slips) lives only in the page's moments.
export default function SectionLabel({ heading, sticky = false, className = '' }) {
  return (
    <div className={`${styles.wrap} ${sticky ? styles.sticky : ''} ${className}`}>
      <h2 className={`${styles.heading} reveal serif-section`}>{heading}</h2>
    </div>
  );
}
