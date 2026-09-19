import MediaPlaceholder from './MediaPlaceholder.jsx';
import styles from './SpatialRenders.module.css';

export default function SpatialRenders({ note, count }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {Array.from({ length: count }, (_, index) => (
          <MediaPlaceholder key={index} kind="image" note={index === 0 ? note : undefined} ratio="16 / 9" />
        ))}
      </div>
    </div>
  );
}
