import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigationType } from 'react-router-dom';
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

// The film's length, for before the browser has read it (iOS reads
// nothing until the page is touched).
const DURATION = 46.4;

// Per Neama: the departures board shows only once the camera has passed
// the printer at the start (it leaves the frame at about 4.7s).
const BOARD_FROM = 4.7;

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// 0 → 1 → 0 across [from, to] seconds, with half-second fades.
function windowed(t, [from, to], fade = 0.5) {
  if (t <= from || t >= to) return 0;
  return clamp((t - from) / fade) * clamp((to - t) / fade);
}

export default function DispatchFilm({ projects }) {
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const boardRef = useRef(null);
  const [time, setTime] = useState(0);
  const [src] = useState(() => (window.matchMedia?.('(max-width: 900px)').matches ? film720 : film1080));
  const { state } = useLocation();
  const navigation = useNavigationType();

  // Per Neama: coming back from a project (its top bar or footer link), the
  // walk resumes at that project's station, not at the start.
  useLayoutEffect(() => {
    // Back/Forward keep the spot that page was left at (ScrollReset).
    const station = navigation === 'PUSH' && STATIONS[state?.station];
    const el = trackRef.current;
    if (!station || !el) return;
    const t = (station[0] + station[1]) / 2;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo(0, el.offsetTop + (range * t) / (DURATION - 0.05));
  }, [state, navigation]);

  useEffect(() => {
    const video = videoRef.current;
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let target = 0;
    let frame = 0;
    // The first position (a return to a station, or Back) is jumped to,
    // not glided through from the start of the film.
    let first = true;

    // Scroll sets a target time; each frame the film eases toward it, so
    // a flick of the wheel glides instead of jumping.
    const tick = () => {
      frame = 0;
      if (!video) return;
      const current = video.currentTime;
      const next = still || first ? target : current + (target - current) * 0.25;
      first = false;
      if (Math.abs(next - current) > 0.01) video.currentTime = next;
      setTime(next);
      if (Math.abs(target - next) > 0.01) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      const el = trackRef.current;
      if (!el || !video) return;
      const range = el.offsetHeight - window.innerHeight;
      const p = range > 0 ? clamp(-el.getBoundingClientRect().top / range) : 0;
      target = p * ((video.duration || DURATION) - 0.05);
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // iPhones load and draw a video only after it has been played once from
    // a touch: start it on the first touch, pause it at once, and from then
    // on the scroll can move it.
    if (video) {
      video.muted = true; // React sets no muted attribute; iOS needs it to play
      video.setAttribute('muted', '');
    }
    let unlocked = false;
    const unlock = () => {
      if (unlocked || !video) return;
      unlocked = true;
      video
        .play?.()
        .then(() => {
          video.pause();
          onScroll();
        })
        .catch(() => {
          unlocked = false;
        });
    };
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('pointerdown', unlock);
    video?.addEventListener('loadedmetadata', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      cancelAnimationFrame(frame);
      video?.removeEventListener('loadedmetadata', onScroll);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Board order follows the film: by dispatch number.
  const stations = projects
    .filter((project) => STATIONS[project.dispatchNumber])
    .sort((a, b) => a.dispatchNumber.localeCompare(b.dispatchNumber))
    .map((project) => ({ project, on: windowed(time, STATIONS[project.dispatchNumber]) > 0 }));
  const here = stations.find((station) => station.on)?.project.slug;
  const boardIn = clamp((time - BOARD_FROM) / 0.6);

  // On a narrow screen the board scrolls sideways: keep the marked slot in
  // view (moving the board only, never the page).
  useEffect(() => {
    const board = boardRef.current;
    const slot = board?.querySelector('[data-here]');
    if (!board || !slot || board.scrollWidth <= board.clientWidth) return;
    board.scrollTo({ left: slot.offsetLeft - (board.clientWidth - slot.offsetWidth) / 2, behavior: 'smooth' });
  }, [here]);

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

        {/* Per Neama: a departures board along the bottom, as a printed
            sign: every dispatch by number and name, the one the camera is
            at marked; each opens its project. */}
        <nav
          className={styles.board}
          aria-label="Dispatches"
          ref={boardRef}
          style={{
            opacity: boardIn,
            visibility: boardIn > 0 ? 'visible' : 'hidden',
            pointerEvents: boardIn > 0.5 ? 'auto' : 'none',
          }}
        >
          {stations.map(({ project, on }) => (
            <Link
              key={project.slug}
              to={`/work/${project.slug}`}
              className={`${styles.slot} ${on ? styles.here : ''}`}
              aria-current={on ? 'location' : undefined}
              data-here={on ? '' : undefined}
            >
              <span className={styles.slotNo}>{project.dispatchNumber}</span>
              <span className={styles.slotName} data-name={project.title.name}>
                {project.title.name}
              </span>
            </Link>
          ))}
        </nav>

        <p className={styles.hint} style={{ opacity: 1 - clamp(time / 1.5) }} aria-hidden="true">
          SCROLL ↓
        </p>
      </div>
    </section>
  );
}
