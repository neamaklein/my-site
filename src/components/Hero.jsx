import MediaPlaceholder from './MediaPlaceholder.jsx';
import HeroIntro from './HeroIntro.jsx';
import { useEditableMedia, useMediaKey } from '../review/ReviewProvider.jsx';
import styles from './Hero.module.css';

// `heading` and `subtitle` show only when written; without them the hero
// is clean, full bleed.
export default function Hero({ heading, subtitle, scrollLabel, intro, media }) {
  const hasCopySlot = Boolean(heading || subtitle);
  const { override, editProps } = useEditableMedia(useMediaKey(media?.src, media?.note || 'hero background'));
  const { className: editClass = '', ...handlers } = editProps;
  const bgSrc = override?.url || media?.src;
  // `media.position`: the point of the image kept in view when the screen
  // crops it (a phone, say), as CSS object-position.
  const bgStyle = media?.position ? { objectPosition: media.position } : undefined;
  const bgIsVideo = override ? override.contentType.startsWith('video/') : media?.kind === 'video';

  return (
    <section className={styles.hero}>
      {intro && <HeroIntro />}
      <div className={styles.bg}>
        {bgSrc && bgIsVideo ? (
          <video className={`${styles.bgImage} ${editClass}`} style={bgStyle} src={bgSrc} autoPlay muted loop playsInline {...handlers} />
        ) : bgSrc ? (
          <img className={`${styles.bgImage} ${editClass}`} style={bgStyle} src={bgSrc} alt={media?.note || ''} {...handlers} />
        ) : (
          <MediaPlaceholder kind={media?.kind || 'image'} note={media?.note || 'hero background'} ratio="16 / 9" />
        )}
      </div>
      {hasCopySlot && (
        <div className={styles.content}>
          {heading && <h1 className={styles.heading}>{heading}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
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
