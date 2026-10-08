import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import hall from '../assets/home/hall.jpg';
import station01 from '../assets/home/station-01.jpg';
import styles from './Conveyor.module.css';

// Home-page conveyor, scroll-driven. Stand-in for Neama's rendered film:
// her two concept frames are "filmed" with a scroll-linked camera (zoom
// toward each station), and every text is live HTML on top, so the final
// film can be rendered without text and dropped in later.

// Camera path over the hall frame: [progress, originX%, originY%, scale].
const CAMERA = [
  [0, 50, 50, 1],
  [0.14, 50, 50, 1],
  [0.27, 76, 38, 2.2],
  [0.4, 76, 38, 2.2],
  [0.47, 50, 48, 1.1],
  [0.57, 24, 34, 2.4],
  [0.67, 24, 34, 2.4],
  [0.73, 50, 46, 1.2],
  [0.83, 55.5, 37, 3.2],
  [0.9, 55.5, 37, 3.2],
  [1, 50, 50, 1],
];

// Wall signs, in story order, with the scroll window each one holds.
const SIGNS = [
  { text: 'DESIGN IS PLANNING.', from: 0.07, to: 0.17 },
  { text: '2D. 3D. DIGITAL. PHYSICAL.', from: 0.42, to: 0.5 },
  { text: 'FIRST THE WHY. THEN THE HOW.', from: 0.67, to: 0.75 },
];

const ending = { text: 'WHAT SHOULD WE PLAN NEXT?', from: 0.92, to: 1.01 };

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = (t) => t * t * (3 - 2 * t);

// 0 → 1 → 0 across [from, to], with short fades at each end.
function windowed(p, from, to, fade = 0.025) {
  if (p <= from || p >= to) return 0;
  return ease(clamp((p - from) / fade)) * ease(clamp((to - p) / fade));
}

function cameraAt(p) {
  for (let i = 1; i < CAMERA.length; i += 1) {
    const [p1, x1, y1, s1] = CAMERA[i];
    const [p0, x0, y0, s0] = CAMERA[i - 1];
    if (p <= p1) {
      const t = ease(clamp((p - p0) / (p1 - p0)));
      return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, s: s0 + (s1 - s0) * t };
    }
  }
  return { x: 50, y: 50, s: 1 };
}

export default function Conveyor({ projects }) {
  const trackRef = useRef(null);
  const [p, setP] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setStill(media.matches);
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      setP(range > 0 ? clamp(-rect.top / range) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const cam = still ? { x: 50, y: 50, s: 1 } : cameraAt(p);
  const label = ease(clamp(p / 0.06));
  const boxOpen = windowed(p, 0.255, 0.425, 0.03);
  const stations = [
    { from: 0.3, to: 0.41 },
    { from: 0.585, to: 0.68 },
    { from: 0.835, to: 0.92 },
  ];

  return (
    <section ref={trackRef} className={styles.track} aria-label="Portfolio conveyor">
      <div className={styles.stage}>
        <div
          className={styles.camera}
          style={{ transformOrigin: `${cam.x}% ${cam.y}%`, transform: `scale(${cam.s})` }}
        >
          <img className={styles.frame} src={hall} alt="" />
          {/* Live label over the printer slot; slides out as if printed. */}
          <div
            className={styles.label}
            style={{ transform: `rotate(-19deg) translateY(${(1 - label) * 18}%)` }}
          >
            <p className={styles.labelHello}>Hello, I'm Neama :)</p>
            <p className={styles.labelBody}>
              I'm a visual designer who loves bringing ideas to life with color, typography, and space.
            </p>
            <span className={styles.barcode} aria-hidden="true" />
          </div>
        </div>
        <img className={styles.boxFrame} src={station01} alt="" style={{ opacity: boxOpen }} />

        {SIGNS.map((sign) => (
          <p key={sign.text} className={styles.sign} style={{ opacity: windowed(p, sign.from, sign.to) }}>
            <span className="serif-voice">{sign.text}</span>
          </p>
        ))}

        {projects.slice(0, 3).map((project, index) => {
          const on = windowed(p, stations[index].from, stations[index].to);
          return (
            <div
              key={project.slug}
              className={styles.station}
              style={{ opacity: on, pointerEvents: on > 0.5 ? 'auto' : 'none' }}
            >
              <span className={styles.stationNo}>
                <span className={styles.stripes} aria-hidden="true">
                  {project.stripes?.map((color) => (
                    <i key={color} style={{ background: color }} />
                  ))}
                </span>
                STATION {project.dispatchNumber} // {project.category}
              </span>
              <span className={styles.stationName}>{project.title.name}</span>
              <Link to={`/work/${project.slug}`} className={styles.open} tabIndex={on > 0.5 ? 0 : -1}>
                Open the box →
              </Link>
            </div>
          );
        })}

        <div
          className={styles.end}
          style={{
            opacity: windowed(p, ending.from, ending.to),
            pointerEvents: windowed(p, ending.from, ending.to) > 0.5 ? 'auto' : 'none',
          }}
        >
          <p className={styles.endSign}>
            <span className="serif-voice">{ending.text}</span>
          </p>
          <p className={styles.contact}>EMAIL · INSTAGRAM · BEHANCE — links to come</p>
        </div>

        <div className={styles.progress} aria-hidden="true">
          <span style={{ transform: `scaleX(${p})` }} />
        </div>
      </div>
    </section>
  );
}
