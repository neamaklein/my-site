import SectionLabel from './SectionLabel.jsx';
import MediaPlaceholder from './MediaPlaceholder.jsx';
import { useEditableMedia, useMediaKey } from '../review/ReviewProvider.jsx';
import styles from './BrandBook.module.css';

function readableTextColor(hex) {
  const value = hex.replace('#', '');
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1a1a1a' : '#ffffff';
}

function Block({ label, className = '', children }) {
  return (
    <div className={`${styles.block} ${className}`}>
      <h3 className={styles.label}>{label}</h3>
      {children}
    </div>
  );
}

function Swatches({ colors }) {
  return (
    <div className={styles.swatches}>
      {colors.map(({ name, hex }) => (
        <div key={hex} className={styles.swatch} style={{ '--swatch-ink': readableTextColor(hex) }}>
          <span
            className={`${styles.chip} ${hex.toUpperCase() === '#FFFFFF' ? styles.swatchLight : ''}`}
            style={{ background: hex }}
          />
          <span className={styles.swatchText}>
            {name && <span>{name}</span>}
            <span>{hex}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

// The logo, as a media slot: in the review copy it can be swapped for an
// upload (an image or a video) like any other media.
function Logo({ src, kind = 'image', scale, fill = false }) {
  const { override, editProps } = useEditableMedia(useMediaKey(src, 'logo'));
  const { className: editClass = '', ...handlers } = editProps;
  const style = scale ? { scale: String(scale) } : undefined;
  const className = `${styles.logo} ${fill ? styles.logoFill : ''} ${editClass}`;
  const isVideo = override ? override.contentType.startsWith('video/') : kind === 'video';
  if (isVideo) {
    return <video className={className} style={style} src={override?.url || src} autoPlay muted loop playsInline {...handlers} />;
  }
  return <img className={className} style={style} src={override?.url || src} alt="Logo" {...handlers} />;
}

const DEFAULT_LABELS = {
  logo: 'Logo',
  morphology: 'Morphology',
  element: 'Element',
  primaryColors: 'Primary Colors',
  secondaryColors: 'Secondary Colors',
  colors: 'Colors',
  icons: 'Icons',
  fonts: 'Fonts',
};

// Mirrors the Figma "Graphic Index": label in the left 3 columns, a
// two-up grid of blocks in the remaining 9. Every block is optional so a
// project only shows what its source deck actually contains; `labels`
// overrides block titles to match a deck's own wording.
export default function BrandBook({
  heading,
  fonts,
  logoSrc,
  morphologySrc,
  morphologyKind = 'image',
  logoScale,
  logoKind,
  logoFill,
  pairLogoColors = false,
  iconsSrc,
  iconSet,
  iconNatural = false,
  stackOnPhone = false,
  primaryColors,
  secondaryColors,
  icons,
  elementSrc,
  labels: labelOverrides,
}) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const hasSecondary = secondaryColors?.length > 0;
  return (
    <section className={styles.wrap}>
      <SectionLabel heading={heading} />
      <div className={styles.content}>
        {logoSrc && (
          <Block
            label={labels.logo}
            className={morphologySrc !== undefined ? styles.narrow : pairLogoColors ? styles.half : styles.full}
          >
            <Logo src={logoSrc} kind={logoKind} scale={logoScale} fill={logoFill} />
          </Block>
        )}
        {morphologySrc !== undefined && (
          <Block label={labels.morphology} className={styles.wide}>
            <MediaPlaceholder
              kind={morphologyKind}
              note="logo construction / grid"
              src={morphologySrc}
              ratio="478 / 306"
              loop={morphologyKind === 'video'}
            />
          </Block>
        )}

        {elementSrc && (
          <Block label={labels.element} className={styles.full}>
            <img className={styles.element} src={elementSrc} alt={labels.element} />
          </Block>
        )}

        {primaryColors?.length > 0 && (
          <Block
            label={hasSecondary ? labels.primaryColors : labels.colors}
            className={hasSecondary ? styles.left : pairLogoColors ? styles.half : styles.full}
          >
            <Swatches colors={primaryColors} />
          </Block>
        )}
        {hasSecondary && (
          <Block label={labels.secondaryColors} className={styles.right}>
            <Swatches colors={secondaryColors} />
          </Block>
        )}

        {(iconSet?.length > 0 || iconsSrc || icons?.length > 0) && (
          <Block label={labels.icons} className={`${styles.left} ${stackOnPhone ? styles.belowOnPhone : ''}`}>
            {iconSet?.length > 0 ? (
              // One cell per icon (per Neama), wrapping to fit any width.
              <div className={iconNatural ? `${styles.iconGrid} ${styles.iconNatural}` : styles.iconGrid}>
                {iconSet.map((icon) => (
                  <img key={icon.src} className={styles.iconCell} src={icon.src} alt={icon.name} />
                ))}
              </div>
            ) : iconsSrc ? (
              <img className={styles.icons} src={iconsSrc} alt="Icon set" />
            ) : (
              <div className={styles.iconNames}>{icons.map((i) => i.name).join(' · ')}</div>
            )}
          </Block>
        )}
        {fonts?.length > 0 && (
          <Block
            label={labels.fonts}
            className={`${iconSet?.length || iconsSrc || icons?.length ? styles.right : styles.full} ${stackOnPhone ? styles.fullOnPhone : ''}`}
          >
            <div className={styles.fonts}>
              {fonts.map((font) => (
                <div className={styles.fontCard} key={font.name}>
                  {/* `specimen`: the sample drawn in the font itself (outlines from
                      Neama's file, or the free font), so it shows without the
                      font installed (per Neama). */}
                  {font.specimen ? (
                    <img className={styles.specimen} src={font.specimen} alt={font.sample || 'Aa'} />
                  ) : (
                    <span className={styles.sample}>{font.sample || 'Aa'}</span>
                  )}
                  <span className={styles.fontName}>{font.name}</span>
                </div>
              ))}
            </div>
          </Block>
        )}
      </div>
    </section>
  );
}
