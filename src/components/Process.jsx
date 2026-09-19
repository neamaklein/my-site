import StickyReveal from './StickyReveal.jsx';

// The AI-render process visuals between the brand book and the Space
// Design gallery — unlabeled in Figma (no PACKING_SLIP tag), just a
// full-width sticky cover image followed by a pinned row of 3 clips.
export default function Process({ items }) {
  return <StickyReveal items={items} />;
}
