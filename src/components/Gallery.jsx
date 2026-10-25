import { useEffect, useMemo, useRef, useState } from 'react';
import SectionLabel from './SectionLabel.jsx';
import MediaPlaceholder from './MediaPlaceholder.jsx';
import { REVIEW } from '../review/flags.js';
import styles from './Gallery.module.css';

// True on a phone-width screen, following resizes.
const PHONE = '(max-width: 760px)';
function usePhone() {
  const [phone, setPhone] = useState(() => window.matchMedia?.(PHONE).matches ?? false);
  useEffect(() => {
    const query = window.matchMedia?.(PHONE);
    if (!query) return undefined;
    const update = () => setPhone(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return phone;
}

// An item with a caption (a drawing's title and scale) is set as a figure,
// the caption small above the media.
function Media({ item, ratio }) {
  const media = (
    <MediaPlaceholder
      kind={item.kind}
      note={item.note}
      src={item.src}
      ratio={item.ratio || ratio}
      size={item.size}
      loop={item.loop}
      offset={item.offset}
      css={item.css}
    />
  );
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
// With `onPick`, each item is a button that reports its index. With
// `maxRowHeight` (a CSS length), a row narrows and centres so it is never
// taller than that.
function Rows({ media, columns, ratio, className, onPick, maxRowHeight, fillLast = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const fit = (el) => {
      const w = el.naturalWidth || el.videoWidth;
      const h = el.naturalHeight || el.videoHeight;
      const cell = el.closest('[data-cell]');
      const row = cell?.parentElement;
      const cells = row ? [...row.children] : [];
      if (cell && w && h) {
        cell.dataset.ratio = String(w / h);
        // Blank cells finishing a short last row take a media's ratio, so
        // its media stay the size of the rows above.
        root.querySelectorAll('[data-filler]').forEach((filler) => {
          if (!filler.style.flexGrow) {
            filler.style.flexGrow = String(w / h);
            filler.dataset.ratio = String(w / h);
          }
        });
        // A lone cell in a height-capped row or a one-column set fills the
        // row: a grow under 1 (a tall media) would leave it only that share.
        cell.style.flexGrow = (maxRowHeight || columns === 1) && cells.length === 1 ? '1' : String(w / h);
      }
      // Once every media in the row has its ratio, cap the row's width.
      if (maxRowHeight && cells.length && cells.every((c) => c.dataset.ratio)) {
        const sum = cells.reduce((total, c) => total + parseFloat(c.dataset.ratio), 0);
        const gaps = (cells.length - 1) * (parseFloat(getComputedStyle(row).columnGap) || 0);
        row.style.width = '100%';
        row.style.maxWidth = `calc(${maxRowHeight} * ${sum} + ${gaps}px)`;
        row.style.marginInline = 'auto';
      }
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
  }, [media, maxRowHeight, columns]);

  const rows = [];
  for (let i = 0; i < media.length; i += columns) rows.push(media.slice(i, i + columns));

  return (
    <div className={`${className} ${maxRowHeight ? styles.keepRow : ''} ${fillLast ? styles.fillRows : ''}`} ref={ref}>
      {rows.map((row, r) => (
        <div className={`${styles.row} ${row.length === 1 && columns === 2 && r > 0 ? styles.single : ''}`} key={r}>
          {row.map((item, index) =>
            onPick ? (
              <button
                type="button"
                className={`${styles.cell} ${styles.pick}`}
                data-cell
                key={index}
                onClick={() => onPick(r * columns + index)}
                aria-label={`Show ${item.note || 'this image'} large`}
              >
                <Media item={item} ratio={ratio} />
              </button>
            ) : (
              <div className={styles.cell} data-cell key={index}>
                <Media item={item} ratio={ratio} />
              </div>
            ),
          )}
          {fillLast &&
            Array.from({ length: columns - row.length }, (_, k) => (
              <div className={styles.cell} data-filler aria-hidden="true" key={`f${k}`} />
            ))}
        </div>
      ))}
    </div>
  );
}

// A video playing on a device (a laptop frame image): it loads only when
// it comes near the view, plays while visible and pauses when not; with
// reduced motion it waits, with controls, for the viewer to press play.
function DeviceVideo({ item, device }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  const [still] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          if (!still) video.play?.().catch(() => {});
        } else {
          video.pause?.();
        }
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [still]);

  // `scale` enlarges the screen a touch, from its centre, over the bezel.
  // A frame with a see-through screen (`overlay`, e.g. a phone) sits over
  // the video, so its camera island and rounded corners stay on top;
  // `radius` rounds the video to the screen, `width` sizes the device.
  const { left, top, width, height, scale, radius } = device.screen;
  const frame = (
    <img className={`${styles.deviceFrame} ${device.overlay ? styles.deviceOver : ''}`} src={device.frame} alt="" />
  );
  return (
    <figure className={styles.device} style={device.width ? { width: device.width } : undefined}>
      {!device.overlay && frame}
      <video
        ref={ref}
        className={styles.deviceScreen}
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${width}%`,
          height: `${height}%`,
          ...(scale ? { scale: String(scale) } : {}),
          ...(radius ? { borderRadius: radius } : {}),
          ...(device.overlay ? { objectFit: 'cover' } : {}),
        }}
        src={near ? item.src : undefined}
        poster={item.poster}
        aria-label={item.note}
        muted
        loop
        playsInline
        preload="none"
        autoPlay={!still}
        controls={still}
      />
      {device.overlay && frame}
    </figure>
  );
}

// One large media and the rest in tight rows beneath. Clicking a small one
// swaps it with the large one (per Neama), so any of them can be seen big.
function Lead({ heading, eyebrow, media, columns, ratio, leadBleed, fillLast, gap }) {
  const [order, setOrder] = useState(() => media.map((_, i) => i));
  useEffect(() => setOrder(media.map((_, i) => i)), [media]);
  const [first, ...rest] = order.map((i) => media[i]).filter(Boolean);
  const pick = (index) =>
    setOrder((o) => {
      const next = [...o];
      [next[0], next[index + 1]] = [next[index + 1], next[0]];
      return next;
    });

  return (
    <section className={styles.wrap}>
      <SectionLabel heading={heading} eyebrow={eyebrow} className={styles.topLabel} />
      <div
        className={`${styles.lead} ${leadBleed ? styles.leadFull : ''}`}
        style={gap !== undefined ? { '--lead-gap': `${gap}px` } : undefined}
      >
        {leadBleed ? (
          <div className={styles.leadBleed}>
            <Media item={first} ratio={ratio} />
          </div>
        ) : (
          <Media item={first} ratio={ratio} />
        )}
        <Rows className={styles.dense} media={rest} columns={columns} ratio={ratio} onPick={pick} fillLast={fillLast} />
      </div>
    </section>
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
// - device:  a video playing on a device frame (the DIMENSO walkthrough).
// - lead:    first media large across the page, the rest in a tight row;
//            with `leadBleed`, all of it runs edge to edge: the first a
//            full screen, the rest two by two across the whole window.
// - asym:    three-column grid, the first media spanning two by two;
//            with `pinned`, the first media slide over one another there.
export default function Gallery({
  heading,
  media: allMedia,
  layout = 'columns',
  columns = 2,
  ratio,
  pinned = 0,
  leadBleed = false,
  maxRowHeight,
  device,
  after = [],
  text = [],
  eyebrow,
  textDir,
  textLang,
  rounded = false,
  fillLast = false,
  gap,
  phoneColumns,
}) {
  // Slots still waiting for their media show only in the review copy.
  const media = useMemo(() => allMedia.filter((item) => REVIEW || !item.reviewOnly), [allMedia]);
  // `phoneColumns`: a different row length on a phone (the rows layout).
  const phone = usePhone();
  // A section whose every slot is still waiting shows only in the review copy.
  if (media.length === 0) return null;
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
        <SectionLabel heading={heading} eyebrow={eyebrow} className={styles.topLabel} />
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

  if (layout === 'device') {
    return (
      <section className={styles.wrap}>
        <SectionLabel heading={heading} eyebrow={eyebrow} className={styles.topLabel} />
        {text.length > 0 && (
          <div className={styles.text} dir={textDir} lang={textLang}>
            {text.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        )}
        {media.map((item, index) => (
          <DeviceVideo key={index} item={item} device={device} />
        ))}
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
    return (
      <Lead
        heading={heading}
        eyebrow={eyebrow}
        media={media}
        columns={columns}
        ratio={ratio}
        leadBleed={leadBleed}
        fillLast={fillLast}
        gap={gap}
      />
    );
  }

  // With `pinned`, the first media stack in the large cell: each pins
  // under the nav and the next slides over it, while the rest hold still
  // beside them; when the stack ends the page scrolls on.
  if (layout === 'asym' && pinned > 1) {
    return (
      <section className={styles.wrap}>
        <SectionLabel heading={heading} eyebrow={eyebrow} className={styles.topLabel} />
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
        <SectionLabel heading={heading} eyebrow={eyebrow} className={styles.topLabel} />
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
      <SectionLabel heading={heading} eyebrow={eyebrow} className={styles.topLabel} />
      {/* `text`: the section's own copy from the deck, above its media. */}
      {text.length > 0 && (
        <div className={styles.text} dir={textDir} lang={textLang}>
          {text.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      )}
      <Rows
        className={`${styles.columns} ${rounded ? styles.rounded : ''}`}
        media={media}
        columns={phone && phoneColumns ? phoneColumns : columns}
        ratio={ratio}
        maxRowHeight={maxRowHeight}
      />
      {/* `after`: media below the rows, edge to edge. */}
      {after.map((item, index) => (
        <div className={styles.after} key={index}>
          <Media item={item} ratio={ratio} />
        </div>
      ))}
    </section>
  );
}
