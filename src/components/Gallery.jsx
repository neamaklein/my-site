import SectionLabel from './SectionLabel.jsx';
import MediaPlaceholder from './MediaPlaceholder.jsx';
import styles from './Gallery.module.css';

function Media({ item, ratio }) {
  return <MediaPlaceholder kind={item.kind} note={item.note} src={item.src} ratio={item.ratio || ratio} />;
}

// Layouts, each taken from a section of the DIMENSO Figma frame:
// - stack:   sticky label on the left; images right-aligned, each one
//            pinning and the next sliding over it (Space Design).
// - columns: label on top; equal columns spanning the page edge to edge
//            (Social & Invitation, Marketing Campaign).
// - feature: label on the left; one large media to the right (Walkthrough).
export default function Gallery({ slip, heading, media, layout = 'columns', columns = 2, ratio }) {
  if (layout === 'stack') {
    return (
      <section className={`${styles.wrap} ${styles.side}`}>
        <SectionLabel slip={slip} heading={heading} sticky className={styles.stackLabel} />
        <div className={styles.stack}>
          {media.map((item, index) => (
            <div className={styles.card} key={index}>
              <div className={styles.cardMedia}>
                <Media item={item} ratio={ratio || '700 / 394'} />
              </div>
            </div>
          ))}
          <div className={styles.hold} aria-hidden="true" />
        </div>
      </section>
    );
  }

  if (layout === 'feature') {
    return (
      <section className={`${styles.wrap} ${styles.side}`}>
        <SectionLabel slip={slip} heading={heading} className={styles.sideLabel} />
        <div className={styles.feature}>
          {media.map((item, index) => (
            <Media key={index} item={item} ratio={ratio} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.wrap}>
      <SectionLabel slip={slip} heading={heading} className={styles.topLabel} />
      <div className={styles.columns} style={{ '--cols': columns }}>
        {media.map((item, index) => (
          <Media key={index} item={item} ratio={ratio} />
        ))}
      </div>
    </section>
  );
}
