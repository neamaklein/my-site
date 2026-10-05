import SectionLabel from './SectionLabel.jsx';
import MediaPlaceholder from './MediaPlaceholder.jsx';
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
        <div
          key={name}
          className={`${styles.swatch} ${hex.toUpperCase() === '#FFFFFF' ? styles.swatchLight : ''}`}
          style={{ background: hex, color: readableTextColor(hex) }}
        >
          <span>{name}</span>
          <span>{hex}</span>
        </div>
      ))}
    </div>
  );
}

// Mirrors the Figma "Graphic Index": label in the left 3 columns, a
// two-up grid of blocks in the remaining 9. Every block is optional so a
// project only shows what its source deck actually contains.
export default function BrandBook({
  slip,
  heading,
  fonts,
  logoSrc,
  morphologySrc,
  iconsSrc,
  primaryColors,
  secondaryColors,
  icons,
}) {
  const hasSecondary = secondaryColors?.length > 0;
  return (
    <section className={styles.wrap}>
      <SectionLabel slip={slip} heading={heading} className={styles.sectionLabel} />
      <div className={styles.content}>
        {logoSrc && (
          <Block label="Logo" className={morphologySrc !== undefined ? styles.narrow : styles.full}>
            <img className={styles.logo} src={logoSrc} alt="Logo" />
          </Block>
        )}
        {morphologySrc !== undefined && (
          <Block label="Morphology" className={styles.wide}>
            <MediaPlaceholder kind="image" note="logo construction / grid" src={morphologySrc} ratio="478 / 306" />
          </Block>
        )}

        {primaryColors?.length > 0 && (
          <Block label={hasSecondary ? 'Primary Colors' : 'Colors'} className={hasSecondary ? styles.left : styles.full}>
            <Swatches colors={primaryColors} />
          </Block>
        )}
        {hasSecondary && (
          <Block label="Secondary Colors" className={styles.right}>
            <Swatches colors={secondaryColors} />
          </Block>
        )}

        {(iconsSrc || icons?.length > 0) && (
          <Block label="Icons" className={styles.left}>
            {iconsSrc ? (
              <img className={styles.icons} src={iconsSrc} alt="Icon set" />
            ) : (
              <div className={styles.iconNames}>{icons.map((i) => i.name).join(' · ')}</div>
            )}
          </Block>
        )}
        {fonts?.length > 0 && (
          <Block label="Fonts" className={iconsSrc || icons?.length ? styles.right : styles.full}>
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
