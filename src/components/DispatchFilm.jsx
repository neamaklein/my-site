import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import film1080 from '../assets/home/film-1080.mp4';
import film720 from '../assets/home/film-720.mp4';
import poster from '../assets/home/film-poster.jpg';
import styles from './DispatchFilm.module.css';

// Home page: Neama's Creative Dispatch film (Blender render), played by
// scrolling — forward as you scroll down, back as you scroll up. When the
// camera reaches a station, a card names its project and opens it. The
// film carries its own words (label, wall signs, LET'S TALK); the cards
// are the only HTML on top. Encoded with a keyframe every 6 frames so
// seeking stays smooth; phones get the 720p copy.

// Seconds in the film where each station's box is open, by dispatch number.
const STATIONS = {
  '01': [8.5, 12],
  '02': [13.5, 17.5],
  '03': [18.5, 21.5],
  '04': [23, 26.5],
  '05': [28.5, 32],
  '06': [33, 36.5],
  '07': [37.5, 40.5],
};

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// 0 → 1 → 0 across [from, to] seconds, with half-second fades.
function windowed(t, [from, to], fade = 0.5) {
  if (t <= from || t >= to) return 0;
  return clamp((t - from) / fade) * clamp((to - t) / fade);
}

export default function DispatchFilm({ projects }) {
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const [time, setTime] = useState(0);
  const [src] = useState(() => (window.matchMedia?.('(max-width: 900px)').matches ? film720 : film1080));

  useEffect(() => {
    const video = videoRef.current;
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let target = 0;
    let frame = 0;

    // Scroll sets a target time; each frame the film eases toward it, so
    // a flick of the wheel glides instead of jumping.
    const tick = () => {
      frame = 0;
      if (!video?.duration) return;
      const current = video.currentTime;
      const next = still ? target : current + (target - current) * 0.25;
      if (Math.abs(next - current) > 0.01) video.currentTime = next;
      setTime(next);
      if (Math.abs(target - next) > 0.01) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      const el = trackRef.current;
      if (!el || !video?.duration) return;
      const range = el.offsetHeight - window.innerHeight;
      const p = range > 0 ? clamp(-el.getBoundingClientRect().top / range) : 0;
      target = p * (video.duration - 0.05);
      if (!frame) frame = requestAnimationFrame(tick);
    };

    video?.addEventListener('loadedmetadata', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      cancelAnimationFrame(frame);
      video?.removeEventListener('loadedmetadata', onScroll);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section ref={trackRef} className={styles.track} aria-label="Creative Dispatch — scroll to walk through">
      <div className={styles.stage}>
        <video
          ref={videoRef}
          className={styles.video}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        {projects.map((project) => {
          const window_ = STATIONS[project.dispatchNumber];
          if (!window_) return null;
          const on = windowed(time, window_);
          return (
            <div
              key={project.slug}
              className={styles.station}
              style={{ opacity: on, pointerEvents: on > 0.5 ? 'auto' : 'none' }}
            >
              <span className={styles.stationNo}>
                DISPATCH № {project.dispatchNumber} // {project.category}
              </span>
              <span className={styles.stationName}>{project.title.name}</span>
              <Link to={`/work/${project.slug}`} className={styles.open} tabIndex={on > 0.5 ? 0 : -1}>
                Open the box →
              </Link>
            </div>
          );
        })}

        <p className={styles.hint} style={{ opacity: 1 - clamp(time / 1.5) }} aria-hidden="true">
          SCROLL ↓
        </p>
      </div>
    </section>
  );
}
