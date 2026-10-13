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
function Logo({ src, scale }) {
  const { override, editProps } = useEditableMedia(useMediaKey(src, 'logo'));
  const { className: editClass = '', ...handlers } = editProps;
  const style = scale ? { scale: String(scale) } : undefined;
  const className = `${styles.logo} ${editClass}`;
  if (override?.contentType.startsWith('video/')) {
    return <video className={className} style={style} src={override.url} autoPlay muted loop playsInline {...handlers} />;
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
  iconsSrc,
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
          <Block label={labels.logo} className={morphologySrc !== undefined ? styles.narrow : styles.full}>
            <Logo src={logoSrc} scale={logoScale} />
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
            className={hasSecondary ? styles.left : styles.full}
          >
            <Swatches colors={primaryColors} />
          </Block>
        )}
        {hasSecondary && (
          <Block label={labels.secondaryColors} className={styles.right}>
            <Swatches colors={secondaryColors} />
          </Block>
        )}

        {(iconsSrc || icons?.length > 0) && (
          <Block label={labels.icons} className={styles.left}>
            {iconsSrc ? (
              <img className={styles.icons} src={iconsSrc} alt="Icon set" />
            ) : (
              <div className={styles.iconNames}>{icons.map((i) => i.name).join(' · ')}</div>
            )}
          </Block>
        )}
        {fonts?.length > 0 && (
          <Block label={labels.fonts} className={iconsSrc || icons?.length ? styles.right : styles.full}>
            <div className={styles.fonts}>
              {fonts.map((font) => (
                <div className={styles.fontCard} key={font.name}>
                  <span className={styles.sample}>{font.sample || 'Aa'}</span>
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
