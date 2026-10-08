// Shared pieces of the review copy's page editor: how any element on the
// page gets a stable key, how saved edits are written back onto the DOM,
// and small helpers for the inspector.

// Text gets keys from the words themselves (the copy is final, so they
// stay put), numbered when the same words repeat; media from their file
// (see useMediaKey); every other element from its place in the page.
const TEXT = 'h1,h2,h3,h4,h5,h6,p,li,dt,dd,figcaption,blockquote,a,span,label,small,strong,em,b,i';

export const ownText = (el) =>
  [...el.childNodes]
    .filter((n) => n.nodeType === 3)
    .map((n) => n.textContent)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

const hash = (text) => {
  let h = 5381;
  for (let i = 0; i < text.length; i += 1) h = (h * 33 + text.charCodeAt(i)) % 2147483647;
  return h.toString(36);
};

export const pageScope = () => window.location.hash.match(/^#\/work\/([^/?]+)/)?.[1] || 'home';

export function tagText(root) {
  const scope = pageScope();
  const seen = {};
  root.querySelectorAll(TEXT).forEach((el) => {
    if (el.closest('[data-review-ui]')) return;
    const text = ownText(el);
    if (!text) {
      delete el.dataset.textKey;
      return;
    }
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
    const base = `${scope}__t-${el.tagName.toLowerCase()}-${words || hash(text)}`;
    seen[base] = (seen[base] || 0) + 1;
    el.dataset.textKey = seen[base] > 1 ? `${base}-${seen[base]}` : base;
  });
}

// "#root > article:nth-of-type(1) > div:nth-of-type(2) > …"
export function pathOf(el) {
  const parts = [];
  let node = el;
  while (node && node.id !== 'root' && node.parentElement) {
    let index = 1;
    let sibling = node;
    while ((sibling = sibling.previousElementSibling)) if (sibling.tagName === node.tagName) index += 1;
    parts.unshift(`${node.tagName.toLowerCase()}:nth-of-type(${index})`);
    node = node.parentElement;
  }
  return `#root > ${parts.join(' > ')}`;
}

// What a picked element is, and the key its edits are saved under.
export function identify(el) {
  if (el.dataset.mediaKey) {
    return {
      key: el.dataset.mediaKey,
      kind: 'media',
      label: el.getAttribute('alt') || el.dataset.mediaKey.split('__')[1],
    };
  }
  if (el.dataset.textKey) return { key: el.dataset.textKey, kind: 'text', label: ownText(el).slice(0, 80) };
  const path = pathOf(el);
  return { key: `${pageScope()}__e-${hash(path)}`, kind: 'element', path, label: describe(el) };
}

// A readable name: tag, the CSS-module class's own name, a few words.
export function describe(el) {
  const cls = [...el.classList].map((c) => c.match(/^_?([A-Za-z]+)_/)?.[1] || c).find(Boolean);
  const words = (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 28);
  return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}${words ? ` “${words}”` : ''}`;
}

export function findEl(sel) {
  if (!sel) return null;
  if (sel.kind === 'media') return document.querySelector(`[data-media-key="${sel.key}"]`);
  if (sel.kind === 'text') return document.querySelector(`[data-text-key="${sel.key}"]`);
  try {
    return document.querySelector(sel.path);
  } catch {
    return null;
  }
}

// The site's own type: its sans, the serif on trial, and the mono.
export const FAMILIES = {
  sans: { label: 'Sans (site)', css: 'var(--font-system)' },
  serif: { label: 'Instrument Serif', css: 'var(--font-serif)' },
  mono: { label: 'JetBrains Mono', css: 'var(--font-mono)' },
};

// Inline styles a record asks for: offset (CSS `translate`, which leaves
// the scroll animations' `transform` alone), the font fields, and any
// CSS properties set by hand (kebab-case).
function stylesFor(el, rec) {
  const out = {};
  if (rec.offset) out.translate = `${rec.offset.x}px ${rec.offset.y}px`;
  if (rec.font) {
    if (rec.font.family) out['font-family'] = FAMILIES[rec.font.family]?.css;
    if (rec.font.size) out['font-size'] = `${rec.font.size}px`;
    if (rec.font.weight) out['font-weight'] = String(rec.font.weight);
    if (rec.font.italic) out['font-style'] = 'italic';
  }
  Object.assign(out, rec.css || {});
  if (out['z-index'] && !out.position && getComputedStyle(el).position === 'static') out.position = 'relative';
  return out;
}

let touched = new Set();

// Writes every record onto the page: sets what each asks for, and clears
// what an earlier pass set but is no longer asked for.
export function applyEdits(root, records) {
  tagText(root);
  const scope = pageScope();
  const targets = new Map();
  root.querySelectorAll('[data-media-key], [data-text-key]').forEach((el) => {
    const rec = records[el.dataset.mediaKey || el.dataset.textKey];
    if (rec) targets.set(el, rec);
  });
  Object.values(records).forEach((rec) => {
    if (rec.kind !== 'element' || rec.page !== scope || !rec.path) return;
    let el = null;
    try {
      el = root.ownerDocument.querySelector(rec.path);
    } catch {
      el = null;
    }
    if (el) targets.set(el, { ...(targets.get(el) || {}), ...rec });
  });

  const next = new Set();
  targets.forEach((rec, el) => {
    const want = stylesFor(el, rec);
    (el.reviewProps || []).forEach((prop) => {
      if (!(prop in want)) el.style.removeProperty(prop);
    });
    Object.entries(want).forEach(([prop, value]) => {
      if (value === undefined || value === '') el.style.removeProperty(prop);
      else if (el.style.getPropertyValue(prop) !== value) el.style.setProperty(prop, value);
    });
    el.reviewProps = Object.keys(want);
    next.add(el);
  });
  touched.forEach((el) => {
    if (next.has(el)) return;
    (el.reviewProps || []).forEach((prop) => el.style.removeProperty(prop));
    el.reviewProps = [];
  });
  touched = next;
}

// rgb(a) → #rrggbb for colour inputs.
export function toHex(color) {
  const m = color?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return '#000000';
  return `#${m
    .slice(1, 4)
    .map((n) => Number(n).toString(16).padStart(2, '0'))
    .join('')}`;
}
