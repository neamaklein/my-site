import SectionLabel from './SectionLabel.jsx';
import MediaPlaceholder from './MediaPlaceholder.jsx';
import styles from './Gallery.module.css';

// An item with a caption (a drawing's title and scale) is set as a figure,
// the caption small above the media.
function Media({ item, ratio }) {
  const media = <MediaPlaceholder kind={item.kind} note={item.note} src={item.src} ratio={item.ratio || ratio} />;
  if (!item.caption) return media;
  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>
        {item.caption}
        {item.scale && <span className={styles.scale}>Scale {item.scale}</span>}
      </figcaption>
      {media}
    </figure>
  );
}

// Layouts, each taken from a section of the DIMENSO Figma frame:
// - stack:   sticky label on the left; images right-aligned, each one
//            pinning and the next sliding over it (Space Design).
// - columns: label on top; equal columns spanning the page edge to edge
//            (Social & Invitation, Marketing Campaign).
// - feature: label on the left; one large media to the right (Walkthrough).
// - wide:    stack at full page width, label on top — for the hero images
//            of a project (PALATE renders).
// Scale-contrast layouts (per Neama, to break the even rhythm):
// - bleed:   label on top, media edge to edge with no side margin.
// - lead:    first media large across the page, the rest in a tight row.
// - asym:    three-column grid, the first media spanning two by two;
//            with `pinned`, the first media slide over one another there.
export default function Gallery({ heading, media, layout = 'columns', columns = 2, ratio, pinned = 0 }) {
  if (layout === 'stack') {
    return (
      <section className={`${styles.wrap} ${styles.side}`}>
        <SectionLabel heading={heading} sticky className={styles.stackLabel} />
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

  if (layout === 'wide') {
    return (
      <section className={styles.wrap}>
        <SectionLabel heading={heading} className={styles.topLabel} />
        <div className={styles.stack}>
          {media.map((item, index) => (
            <div className={`${styles.card} ${styles.wideCard}`} key={index}>
              <Media item={item} ratio={ratio} />
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
        <SectionLabel heading={heading} className={styles.sideLabel} />
        <div className={styles.feature}>
          {media.map((item, index) => (
            <Media key={index} item={item} ratio={ratio} />
          ))}
        </div>
      </section>
    );
  }

  if (layout === 'bleed') {
    return (
      <section className={`${styles.wrap} ${styles.bleedWrap}`}>
        <SectionLabel heading={heading} className={`${styles.topLabel} ${styles.bleedLabel}`} />
        <div className={styles.bleed}>
          {media.map((item, index) => (
            <Media key={index} item={item} ratio={ratio} />
          ))}
        </div>
      </section>
    );
  }

  if (layout === 'lead') {
    const [first, ...rest] = media;
    return (
      <section className={styles.wrap}>
        <SectionLabel heading={heading} className={styles.topLabel} />
        <div className={styles.lead}>
          <Media item={first} ratio={ratio} />
          <div className={styles.dense} style={{ '--cols': columns }}>
            {rest.map((item, index) => (
              <Media key={index} item={item} ratio={ratio} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // With `pinned`, the first media stack in the large cell: each pins
  // under the nav and the next slides over it, while the rest hold still
  // beside them; when the stack ends the page scrolls on.
  if (layout === 'asym' && pinned > 1) {
    return (
      <section className={styles.wrap}>
        <SectionLabel heading={heading} className={styles.topLabel} />
        <div className={`${styles.asym} ${styles.asymPinned}`}>
          <div className={styles.asymLead}>
            {media.slice(0, pinned).map((item, index) => (
              <div className={styles.asymCard} key={index}>
                <Media item={item} ratio={ratio} />
              </div>
            ))}
          </div>
          <div className={styles.asymSide}>
            {media.slice(pinned).map((item, index) => (
              <Media key={index} item={item} ratio={ratio} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'asym') {
    return (
      <section className={styles.wrap}>
        <SectionLabel heading={heading} className={styles.topLabel} />
        <div className={styles.asym}>
          {media.map((item, index) => (
            <Media key={index} item={item} ratio={ratio} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.wrap}>
      <SectionLabel heading={heading} className={styles.topLabel} />
      <div className={styles.columns} style={{ '--cols': columns }} data-cols={columns}>
        {media.map((item, index) => (
          <Media key={index} item={item} ratio={ratio} />
        ))}
      </div>
    </section>
  );
}
