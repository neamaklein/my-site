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

function ColorSwatch({ name, hex, swatch }) {
  const fill = swatch || hex;
  return (
    <div className={styles.swatch} style={{ background: fill, color: readableTextColor(fill) }}>
      <div className={styles.swatchName}>{name}</div>
      <div className={styles.swatchHex}>{hex}</div>
    </div>
  );
}

function Swatches({ label, colors }) {
  return (
    <div className={styles.col}>
      <h3 className={styles.label}>{label}</h3>
      <div className={styles.swatches}>
        {colors.map((color) => (
          <ColorSwatch key={color.name} {...color} />
        ))}
      </div>
    </div>
  );
}

// Every block is optional: a project's brand book only shows what its
// source deck actually contains.
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
  return (
    <div className={styles.wrap}>
      <SectionLabel slip={slip} heading={heading} />

      {fonts?.length > 0 && (
        <div className={styles.row}>
          <div className={styles.col}>
            <h3 className={styles.label}>Fonts</h3>
            <div className={styles.fonts}>
              {fonts.map((font) => (
                <div className={styles.fontCard} key={font.name}>
                  <div className={styles.sample}>{font.sample || 'Aa'}</div>
                  <div className={styles.name}>{font.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(logoSrc || morphologySrc !== undefined) && (
        <div className={styles.row}>
          <div className={styles.col}>
            <h3 className={styles.label}>Logo</h3>
            {logoSrc ? (
              <img className={styles.logo} src={logoSrc} alt="Logo" />
            ) : (
              <MediaPlaceholder kind="image" note="logo" ratio="1 / 1" />
            )}
          </div>
          {morphologySrc !== undefined && (
            <div className={styles.col}>
              <h3 className={styles.label}>Morphology</h3>
              <MediaPlaceholder kind="image" note="logo construction / grid" src={morphologySrc} ratio="16 / 10" />
            </div>
          )}
        </div>
      )}

      {(primaryColors?.length > 0 || secondaryColors?.length > 0) && (
        <div className={styles.row}>
          {primaryColors?.length > 0 && <Swatches label={secondaryColors?.length ? 'Primary Colors' : 'Colors'} colors={primaryColors} />}
          {secondaryColors?.length > 0 && <Swatches label="Secondary Colors" colors={secondaryColors} />}
        </div>
      )}

      {(iconsSrc || icons?.length > 0) && (
        <div className={styles.row}>
          <div className={styles.col}>
            <h3 className={styles.label}>Icons</h3>
            {iconsSrc ? (
              <img className={styles.iconsImage} src={iconsSrc} alt="Icon set" />
            ) : (
              <div className={styles.iconGrid}>
                {icons.map((icon) => (
                  <div className={styles.iconTile} key={icon.name}>
                    <div className={styles.glyph}>icon</div>
                    <span className={styles.name}>{icon.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
