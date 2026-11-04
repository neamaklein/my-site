import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// A new page opens at its top: the router keeps the window's scroll, so
// a project opened from deep in the home film would land mid-page. Going
// back (or forward) returns to where that page was left, e.g. the same
// station in the film.
export default function ScrollReset() {
  const { pathname } = useLocation();
  const type = useNavigationType();
  const saved = useRef({});
  const last = useRef(pathname);

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);

  useLayoutEffect(() => {
    if (last.current === pathname) return;
    const y = type === 'POP' ? saved.current[pathname] || 0 : 0;
    last.current = pathname;
    window.scrollTo(0, y);
  }, [pathname, type]);

  // Remember where each page was left.
  useLayoutEffect(() => {
    const onScroll = () => {
      saved.current[last.current] = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
