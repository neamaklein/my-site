import { Link } from 'react-router-dom';
import styles from './StationLabel.module.css';

// Per Neama: at each station, the project's basics in a label beside the
// model, in the contact windows' language, low in the frame so it doesn't
// cover the station. The label opens the project.
//
// When each model is out of its box (seconds in the film), and the side
// of the frame it leaves free for the label.
export const CALLOUTS = {
  '01': { side: 'right', from: 9, to: 10.5 },
  '02': { side: 'left', from: 14, to: 15.5 },
  '03': { side: 'right', from: 19, to: 20.5 },
  '04': { side: 'left', from: 24, to: 25.5 },
  '05': { side: 'right', from: 29, to: 30.5 },
  '06': { side: 'left', from: 34, to: 35.5 },
  '07': { side: 'right', from: 39, to: 40.5 },
};

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// 0 → 1 → 0 across the station, with short fades either side.
export function calloutIn(time, { from, to }) {
  const start = from - 0.4;
  const end = to + 0.6;
  if (time <= start || time >= end) return 0;
  return clamp((time - start) / 0.3) * clamp((end - time) / 0.3);
}

const categoryLabel = (category) => category.replace('UX_UI', 'UX/UI').replace(/_/g, ' ');

export default function StationLabel({ project, opacity }) {
  const callout = CALLOUTS[project.dispatchNumber];
  const live = opacity > 0.5;

  return (
    <Link
      to={`/work/${project.slug}`}
      className={`${styles.label} ${styles[callout.side]}`}
      style={{ opacity, visibility: opacity > 0 ? 'visible' : 'hidden', pointerEvents: live ? 'auto' : 'none' }}
      tabIndex={live ? 0 : -1}
    >
      <span className={styles.bar}>Dispatch № {project.dispatchNumber}</span>
      <span className={styles.body}>
        <span className={styles.category}>{categoryLabel(project.category)}</span>
        <span className={styles.name}>{project.title.name}</span>
        {project.title.tagline && <span className={styles.tagline}>{project.title.tagline}</span>}
        <span className={styles.open}>
          <span>Open the box</span>
          <span aria-hidden="true">↗</span>
        </span>
      </span>
    </Link>
  );
}
