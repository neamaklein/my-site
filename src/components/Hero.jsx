import MediaPlaceholder from './MediaPlaceholder.jsx';
import HeroIntro from './HeroIntro.jsx';
import { useEditableMedia, useMediaKey } from '../review/ReviewProvider.jsx';
import styles from './Hero.module.css';

// `heading`/`subtitle` left as '' render a visible "not written yet" hint;
// omitting them entirely renders a clean full-bleed hero.
export default function Hero({ heading, subtitle, scrollLabel, intro, media }) {
  const hasCopySlot = heading !== undefined || subtitle !== undefined;
  const { override, editProps } = useEditableMedia(useMediaKey(media?.src, media?.note || 'hero background'));
  const { className: editClass = '', ...handlers } = editProps;
  const bgSrc = override?.url || media?.src;
  const bgIsVideo = override ? override.contentType.startsWith('video/') : false;

  return (
    <section className={styles.hero}>
      {intro && <HeroIntro />}
      <div className={styles.bg}>
        {bgSrc && bgIsVideo ? (
          <video className={`${styles.bgImage} ${editClass}`} src={bgSrc} autoPlay muted loop playsInline {...handlers} />
        ) : bgSrc ? (
          <img className={`${styles.bgImage} ${editClass}`} src={bgSrc} alt={media?.note || ''} {...handlers} />
        ) : (
          <MediaPlaceholder kind={media?.kind || 'image'} note={media?.note || 'hero background'} ratio="16 / 9" />
        )}
      </div>
      {hasCopySlot && (
        <div className={styles.content}>
          {heading ? (
            <h1 className={styles.heading}>{heading}</h1>
          ) : (
            <p className={styles.empty}>[ hero heading — not written yet ]</p>
          )}
          {subtitle ? (
            <p className={styles.subtitle}>{subtitle}</p>
          ) : (
            <p className={styles.empty}>[ hero subtitle — not written yet ]</p>
          )}
        </div>
      )}
      {scrollLabel && (
        <div className={`mono-tag ${styles.scroll}`}>
          <span>{scrollLabel}</span>
          <span aria-hidden="true">↓</span>
        </div>
      )}
    </section>
  );
}
