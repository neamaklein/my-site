import styles from './MediaPlaceholder.module.css';

// Stands in for real media until the full-res files from the local
// /portfolio-source/ folder are dropped in — never fed by Figma exports.
export default function MediaPlaceholder({ kind = 'image', note, ratio }) {
  return (
    <div className={styles.placeholder} style={ratio ? { '--ratio': ratio } : undefined}>
      <div>
        <span className={styles.kind}>{kind === 'video' ? '▶ video' : 'image'} placeholder</span>
        {note && <span>{note}</span>}
      </div>
    </div>
  );
}
