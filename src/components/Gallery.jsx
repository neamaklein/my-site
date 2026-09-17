import SectionLabel from './SectionLabel.jsx';
import MediaPlaceholder from './MediaPlaceholder.jsx';
import styles from './Gallery.module.css';

export default function Gallery({ slip, heading, media }) {
  return (
    <div className={styles.wrap}>
      <SectionLabel slip={slip} heading={heading} />
      <div className={styles.grid}>
        {media.map((item) => (
          <MediaPlaceholder key={item.note} kind={item.kind} note={item.note} />
        ))}
      </div>
    </div>
  );
}
