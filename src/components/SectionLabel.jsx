import styles from './SectionLabel.module.css';

export default function SectionLabel({ slip, heading, sticky = false, className = '' }) {
  return (
    <div className={`${styles.wrap} ${sticky ? styles.sticky : ''} ${className}`}>
      <span className={styles.slip}>{slip}</span>
      <h2 className={styles.heading}>{heading}</h2>
    </div>
  );
}
