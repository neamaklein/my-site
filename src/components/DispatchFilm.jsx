import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigationType } from 'react-router-dom';
import film1080 from '../assets/home/film-1080.mp4';
import film720 from '../assets/home/film-720.mp4';
import filmMobileHevc from '../assets/home/film-mobile-hevc.mp4';
import poster from '../assets/home/film-poster.jpg';
import posterMobile from '../assets/home/film-poster-mobile.jpg';
import ContactWindows from './ContactWindows.jsx';
import NameCardZoom, { preloadNameCardZoom } from './NameCardZoom.jsx';
import StationLabel, { CALLOUTS, calloutIn } from './StationLabel.jsx';
import styles from './DispatchFilm.module.css';

// Home page: Neama's Creative Dispatch film (Blender render), played by
// scrolling — forward as you scroll down, back as you scroll up. When the
// camera reaches a station, a card names its project and opens it. The
// film carries its own words (label, wall signs, LET'S TALK); the cards
// are the only HTML on top. Encoded with frequent keyframes so seeking
// stays smooth (the wide 1080p one every 12 frames at CRF 20, per Neama's
// ask for a sharper picture; the others every 6). Phones held upright get
// Neama's vertical cut (720×1280), other small screens the 720p copy.

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

// The film's last frame (the camera settles at about 45.9s): where its
// Instagram, LinkedIn and "Contact" sit, in % of the frame (1920×1080, or
// 1080×1920 for the vertical cut). Each opens the contact windows (per
// Neama). Contact follows the
// button's own pill, tilt included (per Neama), so its halo follows it.
// The name card on the desk plays her zoom onto it instead (per Neama);
// it stands at an angle, so its halo traces the card's outline, measured
// off the last frame: corners (and each corner's radius) in frame pixels
// within the spot, clockwise from top left.
const CONTACT_FROM = 45.9;
const SPOTS = {
  wide: [
    { label: 'Instagram', left: 70.6, top: 25.9, width: 10.2, height: 4.6 },
    { label: 'LinkedIn', left: 82.8, top: 25.9, width: 8.6, height: 4.6 },
    { label: 'Contact', left: 40.15, top: 60.96, width: 10.2, height: 5.89, rotate: 5.56 },
    {
      label: 'Neama Klein',
      left: 72.22,
      top: 53.13,
      width: 13.36,
      height: 28.6,
      card: {
        w: 256.6,
        h: 308.9,
        r: [26, 17, 18, 27],
        blur: [7, 16],
        points: [[29.4, 0], [256.6, 14.8], [182.9, 308.9], [0, 288.6]],
      },
    },
  ],
  tall: [
    { label: 'Instagram', left: 63.2, top: 40.5, width: 11.8, height: 2.2 },
    { label: 'LinkedIn', left: 77.4, top: 40.5, width: 10.1, height: 2.2 },
    { label: 'Contact', left: 27.46, top: 54.18, width: 12.21, height: 2.18, rotate: 4.11 },
    {
      label: 'Neama Klein',
      left: 64.92,
      top: 50.98,
      width: 14.47,
      height: 10.06,
      card: {
        w: 156.3,
        h: 193.2,
        r: [17, 12, 10, 17],
        blur: [12, 28],
        points: [[16.5, 0], [156.3, 7.1], [111.7, 193.2], [0, 184.5]],
      },
    },
  ],
};

// A polygon with rounded corners (a radius per corner), as an SVG path.
function roundedPath(points, radii) {
  const n = points.length;
  const toward = ([x, y], [tx, ty], r) => {
    const d = Math.hypot(tx - x, ty - y);
    return [x + ((tx - x) * r) / d, y + ((ty - y) * r) / d];
  };
  return (
    points
      .map((p, i) => {
        const a = toward(p, points[(i + n - 1) % n], radii[i]);
        const b = toward(p, points[(i + 1) % n], radii[i]);
        return `${i ? 'L' : 'M'}${a} Q${p} ${b}`;
      })
      .join(' ') + ' Z'
  );
}

// The name card's halo: its outline, blurred, kept outside the card so the
// card itself stays clear (as the other spots' glow is).
function CardHalo({ w, h, r, blur, points }) {
  const d = roundedPath(points, r);
  const pad = blur[1] * 3;
  const area = { x: -pad, y: -pad, width: w + pad * 2, height: h + pad * 2 };
  return (
    <svg className={styles.halo} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="card-halo" filterUnits="userSpaceOnUse" {...area}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur[0]} result="near" />
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur[1]} result="far" />
          <feComponentTransfer in="far" result="farSoft">
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="farSoft" />
            <feMergeNode in="near" />
          </feMerge>
        </filter>
        <mask id="card-outside" maskUnits="userSpaceOnUse" {...area}>
          <rect {...area} fill="#fff" />
          <path d={d} fill="#000" />
        </mask>
      </defs>
      <g mask="url(#card-outside)">
        <path d={d} fill="rgba(255, 255, 255, 0.85)" filter="url(#card-halo)" />
      </g>
    </svg>
  );
}

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
  const [cut] = useState(() =>
    window.matchMedia?.('(max-width: 900px) and (orientation: portrait)').matches
      ? 'tall'
      : window.matchMedia?.('(max-width: 900px)').matches
        ? 'small'
        : 'wide',
  );
  const tall = cut === 'tall';
  const src = { small: film720, wide: film1080 }[cut];
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
  const [contact, setContact] = useState(false);
  const atEnd = time >= CONTACT_FROM;
  const closeContact = useCallback(() => setContact(false), []);
  const [nameCard, setNameCard] = useState(false);
  const closeNameCard = useCallback(() => setNameCard(false), []);
  const zoomAhead = useRef(null);
  useEffect(() => {
    if (atEnd && !zoomAhead.current) zoomAhead.current = preloadNameCardZoom(tall);
  }, [atEnd, tall]);

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
          // Upright phones: Neama's 1080×1920 HEVC only (per Neama: the few
          // devices that can't play HEVC are accepted).
          src={tall ? undefined : src}
          poster={tall ? posterMobile : poster}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          {tall && <source src={filmMobileHevc} type='video/mp4; codecs="hvc1"' />}
        </video>

        {projects.map((project) => {
          const callout = CALLOUTS[project.dispatchNumber];
          const opacity = callout ? calloutIn(time, callout) : 0;
          return opacity > 0 ? <StationLabel key={project.slug} project={project} opacity={opacity} /> : null;
        })}

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
          SCROLL TO EXPLORE ↓
        </p>

        {/* The film's frame as the video covers the stage, so each spot
            sits on its word at any screen size. */}
        {atEnd && (
          <div className={`${styles.frame} ${tall ? styles.frameTall : ''}`}>
            {SPOTS[tall ? 'tall' : 'wide'].map((spot) => (
              <button
                key={spot.label}
                type="button"
                className={`${styles.spot} ${spot.card ? styles.card : ''}`}
                style={{
                  left: `${spot.left}%`,
                  top: `${spot.top}%`,
                  width: `${spot.width}%`,
                  height: `${spot.height}%`,
                  rotate: spot.rotate ? `${spot.rotate}deg` : undefined,
                }}
                onClick={() => (spot.card ? setNameCard(true) : setContact(true))}
                aria-label={spot.label}
              >
                {spot.card && <CardHalo {...spot.card} />}
              </button>
            ))}
          </div>
        )}
        {contact && <ContactWindows onClose={closeContact} />}
        {nameCard && <NameCardZoom tall={tall} onClose={closeNameCard} />}
      </div>
    </section>
  );
}
