import styles from './SectionLabel.module.css';

export default function SectionLabel({ slip, heading }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.slip}>{slip}</span>
      <h2 className={styles.heading}>{heading}</h2>
    </div>
  );
}
