import { useEffect, useState } from 'react';
import styles from './Review.module.css';

// Review-copy only: try Instrument Serif in three roles on the real
// pages. Sets <html data-serif>; the CSS in global.css does the rest.
// The choice is remembered in this browser only.
const KEY = 'review-serif';
const OPTIONS = [
  ['', 'Headings: sans (now)'],
  ['voice', 'Serif: voice only'],
  ['sections', 'Serif: + section headings'],
  ['all', 'Serif: all headings'],
];

function read() {
  try {
    return localStorage.getItem(KEY) || '';
  } catch {
    return '';
  }
}

export default function SerifTrial() {
  const [mode, setMode] = useState(read);

  useEffect(() => {
    const root = document.documentElement;
    if (mode) root.dataset.serif = mode;
    else delete root.dataset.serif;
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      // Storage blocked: the choice simply isn't remembered.
    }
  }, [mode]);

  return (
    <label className={styles.serifTrial}>
      <span className={styles.visuallyHidden}>Heading font</span>
      <select id="review-serif" value={mode} onChange={(event) => setMode(event.target.value)}>
        {OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
