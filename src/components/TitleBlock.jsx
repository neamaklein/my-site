import styles from './TitleBlock.module.css';

export default function TitleBlock({ tag, name, tagline }) {
  return (
    <div className={styles.wrap}>
      <span className={`mono-tag ${styles.tag}`}>{tag}</span>
      <h1 className={styles.name}>{name}</h1>
      <p className={styles.tagline}>{tagline}</p>
    </div>
  );
}
