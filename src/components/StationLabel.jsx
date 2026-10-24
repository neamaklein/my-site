import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './StationLabel.module.css';

// Per Neama: at each station, the project's basics in a label beside the
// model, in the contact windows' language, with a thin line from the label
// to the model. The label opens the project; so does the model.
//
// Where each model is, read off the film (1920×1080) every half second
// while it's out of its box: [seconds, x %, y %] of the model's edge
// nearest the label. `side` is where the label sits (the side the model
// leaves free). Between keyframes the point is interpolated.
export const CALLOUTS = {
  '01': {
    side: 'right',
    keys: [
      [9, 36, 62],
      [9.5, 36.5, 50],
      [10, 40, 53],
      [10.5, 41, 57],
    ],
  },
  '02': {
    side: 'left',
    keys: [
      [14, 69, 48],
      [14.5, 68, 26],
      [15, 68, 30],
      [15.5, 65, 39],
    ],
  },
  '03': {
    side: 'right',
    keys: [
      [19, 36, 66],
      [19.5, 38, 50],
      [20, 37, 53],
      [20.5, 39, 62],
    ],
  },
  '04': {
    side: 'left',
    keys: [
      [24, 61, 73],
      [24.5, 58, 51],
      [25, 58, 54],
      [25.5, 56, 63],
    ],
  },
  '05': {
    side: 'right',
    keys: [
      [29, 28, 57],
      [29.5, 30, 43],
      [30, 29, 46],
      [30.5, 31, 52],
    ],
  },
  '06': {
    side: 'left',
    keys: [
      [34, 65, 51],
      [34.5, 64, 31],
      [35, 63, 35],
      [35.5, 61, 38],
    ],
  },
  '07': {
    side: 'right',
    keys: [
      [39, 41, 49],
      [39.5, 43, 31],
      [40, 43, 35],
      [40.5, 46, 40],
    ],
  },
};

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// How far into its station the film is: 0 → 1 → 0, a short fade either side
// of the keyframes.
export function calloutIn(time, callout) {
  const from = callout.keys[0][0] - 0.1;
  const to = callout.keys[callout.keys.length - 1][0] + 0.3;
  if (time <= from - 0.3 || time >= to + 0.3) return 0;
  return clamp((time - (from - 0.3)) / 0.3) * clamp((to + 0.3 - time) / 0.3);
}

function pointAt(time, keys) {
  if (time <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i += 1) {
    const [t1, x1, y1] = keys[i];
    if (time <= t1) {
      const [t0, x0, y0] = keys[i - 1];
      const k = (time - t0) / (t1 - t0);
      return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k];
    }
  }
  return keys[keys.length - 1].slice(1);
}

const categoryLabel = (category) => category.replace('UX_UI', 'UX/UI').replace(/_/g, ' ');

export default function StationLabel({ project, time, opacity, stageRef }) {
  const callout = CALLOUTS[project.dispatchNumber];
  const [box, setBox] = useState(null);
  const [labelRef, setLabelRef] = useState(null);

  // The stage's size, and the label's place in it, for the line.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !labelRef) return undefined;
    const measure = () => {
      const s = stage.getBoundingClientRect();
      const l = labelRef.getBoundingClientRect();
      setBox({
        w: s.width,
        h: s.height,
        left: l.left - s.left,
        right: l.right - s.left,
        top: l.top - s.top,
        bottom: l.bottom - s.top,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(labelRef);
    return () => observer.disconnect();
  }, [stageRef, labelRef]);

  // The film's frame as object-fit: cover lays it on the stage.
  let line = null;
  if (box) {
    const fw = Math.max(box.w, (box.h * 16) / 9);
    const fh = (fw * 9) / 16;
    const [px, py] = pointAt(time, callout.keys);
    const x = (box.w - fw) / 2 + (px / 100) * fw;
    const y = (box.h - fh) / 2 + (py / 100) * fh;
    const fromX = callout.side === 'left' ? box.right : box.left;
    const fromY = clamp(y, box.top + 56, box.bottom - 40);
    line = { x, y, fromX, fromY };
  }

  const to = `/work/${project.slug}`;
  const live = opacity > 0.5;

  return (
    <div className={styles.layer} style={{ opacity, visibility: opacity > 0 ? 'visible' : 'hidden' }}>
      {line && (
        <svg className={styles.lines} width={box.w} height={box.h} aria-hidden="true">
          <line x1={line.fromX} y1={line.fromY} x2={line.x} y2={line.y} />
        </svg>
      )}
      {line && (
        <Link
          to={to}
          className={styles.dot}
          style={{ left: line.x, top: line.y, pointerEvents: live ? 'auto' : 'none' }}
          tabIndex={-1}
          aria-hidden="true"
        />
      )}
      <Link
        ref={setLabelRef}
        to={to}
        className={`${styles.label} ${styles[callout.side]}`}
        style={{ pointerEvents: live ? 'auto' : 'none' }}
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
    </div>
  );
}
