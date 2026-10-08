import styles from './MetaGrid.module.css';

export default function MetaGrid({ items }) {
  return (
    <div className={styles.grid}>
      {items.map(({ label, value }) => (
        <div className={styles.item} key={label}>
          <span className={styles.label}>{label}</span>
          <span className={styles.value}>{value}</span>
        </div>
      ))}
    </div>
  );
}
