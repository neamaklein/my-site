import MediaPlaceholder from './MediaPlaceholder.jsx';
import styles from './SpatialRenders.module.css';

export default function SpatialRenders({ note, count, images = [] }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {Array.from({ length: count }, (_, index) => (
          <MediaPlaceholder
            key={index}
            kind="image"
            note={index === 0 && !images[index] ? note : undefined}
            src={images[index]}
            ratio="16 / 9"
          />
        ))}
      </div>
    </div>
  );
}
