import { useEffect, useRef } from 'react';
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

// Media in rows of `columns`, every row one height: once a picture or
// video loads, its cell grows by the media's width-to-height ratio. A lone
// item left over in a two-up grid takes the whole row instead.
function Rows({ media, columns, ratio, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const fit = (el) => {
      const w = el.naturalWidth || el.videoWidth;
      const h = el.naturalHeight || el.videoHeight;
      const cell = el.closest('[data-cell]');
      if (cell && w && h) cell.style.flexGrow = String(w / h);
    };
    root.querySelectorAll('img, video').forEach(fit);
    // load does not bubble, but it does pass ancestors on the way down.
    const onLoad = (e) => fit(e.target);
    root.addEventListener('load', onLoad, true);
    root.addEventListener('loadedmetadata', onLoad, true);
    return () => {
      root.removeEventListener('load', onLoad, true);
      root.removeEventListener('loadedmetadata', onLoad, true);
    };
  }, [media]);

  const rows = [];
  for (let i = 0; i < media.length; i += columns) rows.push(media.slice(i, i + columns));

  return (
    <div className={className} ref={ref}>
      {rows.map((row, r) => (
        <div className={`${styles.row} ${row.length === 1 && columns === 2 && r > 0 ? styles.single : ''}`} key={r}>
          {row.map((item, index) => (
            <div className={styles.cell} data-cell key={index}>
              <Media item={item} ratio={ratio} />
            </div>
          ))}
        </div>
      ))}
    </div>
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
          <Rows className={styles.dense} media={rest} columns={columns} ratio={ratio} />
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
      <Rows className={styles.columns} media={media} columns={columns} ratio={ratio} />
    </section>
  );
}
