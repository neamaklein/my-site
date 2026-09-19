import SectionLabel from './SectionLabel.jsx';
import MediaPlaceholder from './MediaPlaceholder.jsx';
import StickyReveal from './StickyReveal.jsx';
import styles from './Gallery.module.css';

export default function Gallery({ slip, heading, media, layout = 'grid' }) {
  return (
    <div className={styles.wrap}>
      <SectionLabel slip={slip} heading={heading} />
      {layout === 'sticky' ? (
        <StickyReveal items={media.map((item) => ({ type: 'single', media: item }))} />
      ) : (
        <div className={styles.grid}>
          {media.map((item) => (
            <MediaPlaceholder key={item.note} kind={item.kind} note={item.note} />
          ))}
        </div>
      )}
    </div>
  );
}
