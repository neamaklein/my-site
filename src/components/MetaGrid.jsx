import styles from './MetaGrid.module.css';

// One row of facts on wide screens, however many there are (up to five).
export default function MetaGrid({ items }) {
  return (
    <div className={styles.grid} style={{ '--cols': Math.min(items.length, 5) }}>
      {items.map(({ label, value }) => (
        <div className={styles.item} key={label}>
          <span className={styles.label}>{label}</span>
          <span className={styles.value}>{value}</span>
        </div>
      ))}
    </div>
  );
}
