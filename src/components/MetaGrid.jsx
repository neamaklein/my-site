import styles from './MetaGrid.module.css';

// One row of facts on wide screens, however many there are (up to five).
// `monoLabels` sets the labels in the mono (per Neama, on PALATE).
export default function MetaGrid({ items, monoLabels = false }) {
  return (
    <div className={styles.grid} style={{ '--cols': Math.min(items.length, 5) }}>
      {items.map(({ label, value }) => (
        <div className={styles.item} key={label}>
          <span className={`${styles.label} ${monoLabels ? styles.mono : ''}`}>{label}</span>
          <span className={styles.value}>{value}</span>
        </div>
      ))}
    </div>
  );
}
