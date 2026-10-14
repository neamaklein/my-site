import logoIcon from '../assets/dimenso/logo-icon.png';
import styles from './HeroIntro.module.css';

// The logo-reveal moment from the Figma prototype: icon fades in, the
// wordmark types itself out, the mark cycles through the three brand
// colors, then the whole thing fades to reveal the hero underneath.
// Plays once on mount — not scroll-linked.
export default function HeroIntro() {
  return (
    <div className={styles.intro} aria-hidden="true">
      <div className={styles.icon} style={{ '--icon-mask': `url(${logoIcon})` }} />
      <span className={styles.wordmark}>Dimensō</span>
    </div>
  );
}
