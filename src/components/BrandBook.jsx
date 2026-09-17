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

function ColorSwatch({ name, hex }) {
  return (
    <div className={styles.swatch} style={{ background: hex, color: readableTextColor(hex) }}>
      <div className={styles.swatchName}>{name}</div>
      <div className={styles.swatchHex}>{hex}</div>
    </div>
  );
}

export default function BrandBook({ slip, heading, fonts, primaryColors, secondaryColors, icons }) {
  return (
    <div className={styles.wrap}>
      <SectionLabel slip={slip} heading={heading} />

      <div className={styles.row}>
        <div className={styles.col}>
          <h3 className={styles.label}>Fonts</h3>
          <div className={styles.fonts}>
            {fonts.map((font) => (
              <div className={styles.fontCard} key={font.name}>
                <div className={styles.sample}>Aa</div>
                <div className={styles.name}>{font.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <h3 className={styles.label}>Logo</h3>
          <MediaPlaceholder kind="image" note="Dimenso wordmark + icon" ratio="1 / 1" />
        </div>
        <div className={styles.col}>
          <h3 className={styles.label}>Morphology</h3>
          <MediaPlaceholder kind="image" note="logo construction / grid" ratio="16 / 10" />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <h3 className={styles.label}>Primary Colors</h3>
          <div className={styles.swatches}>
            {primaryColors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </div>
        <div className={styles.col}>
          <h3 className={styles.label}>Secondary Colors</h3>
          <div className={styles.swatches}>
            {secondaryColors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <h3 className={styles.label}>Icons</h3>
          <div className={styles.iconGrid}>
            {icons.map((icon) => (
              <div className={styles.iconTile} key={icon.name}>
                <div className={styles.glyph}>icon</div>
                <span className={styles.name}>{icon.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
