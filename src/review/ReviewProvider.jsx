import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ExpertScan from './ExpertScan.jsx';
import SerifTrial from './SerifTrial.jsx';
import styles from './Review.module.css';

// Review-only editing, active in the claude.ai review copy
// (VITE_ROUTER=hash). Writers can pick any image, video or piece of text
// on the page and:
// - move it on x and y (drag, arrow keys, or type the numbers);
// - for text, change the font: family, size, weight, italic;
// - for media, set how wide it sits in its slot (and on which side), or
//   swap it for an upload.
// Files go to the artifact's asset store; `media/<key>` in its db records
// the replacement asset, `size: {width, align}`, `offset: {x, y}` (px) and
// `font: {family, size, weight, italic}`, so Claude can read them back and
// move them into the real site. Text records also carry `kind: 'text'`,
// the page and the text itself. The GitHub Pages build never runs any of
// this.
const ENABLED = import.meta.env.VITE_ROUTER === 'hash';

const ReviewContext = createContext({ editing: false, overrides: {}, sizes: {} });
export const useReview = () => useContext(ReviewContext);

// Scope (project slug) so identical file names in two projects stay apart.
const ScopeContext = createContext('site');
export const ReviewScope = ScopeContext.Provider;

// Stable slot key from the original file name (minus Vite's content hash)
// or, for placeholders without a file, from their note.
export function useMediaKey(src, note) {
  const scope = useContext(ScopeContext);
  const base = src
    ? src
        .split('/')
        .pop()
        .replace(/-[A-Za-z0-9_-]{8}\.[a-z0-9]+$/i, '')
    : (note || 'media')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
  return `${scope}__${base}`;
}

// Inline style for a size: width as a share of the slot, and the side
// the media sits on when it is narrower than the slot.
const ALIGN_LABELS = { start: 'left', center: 'center', end: 'right' };
const MARGINS = { start: '0 auto 0 0', center: '0 auto', end: '0 0 0 auto' };
export function sizeStyle(size) {
  if (!size?.width || size.width >= 100) return undefined;
  return { width: `${size.width}%`, margin: MARGINS[size.align] || MARGINS.center };
}

// Props for a media element: its key (so the page-wide editor can find
// it) and, in edit mode, the editable outline.
export function useEditableMedia(key) {
  const { editing, overrides, sizes } = useReview();
  const editProps = ENABLED ? { 'data-media-key': key, ...(editing ? { className: styles.editable } : {}) } : {};
  return { override: overrides[key], size: sizes[key], editProps };
}

// Text gets keys from the DOM: page, tag and the words themselves (the
// copy is final, so they stay put), numbered when the same words repeat.
const TEXT = 'h1,h2,h3,h4,h5,h6,p,li,dt,dd,figcaption,blockquote,a,span,label,small,strong,em,b,i';
const ownText = (el) =>
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
const pageScope = () => window.location.hash.match(/^#\/work\/([^/?]+)/)?.[1] || 'home';

function tagText(root) {
  const scope = pageScope();
  const seen = {};
  root.querySelectorAll(TEXT).forEach((el) => {
    if (el.closest('[data-review-ui]')) return;
    const text = ownText(el);
    if (!text) return;
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

// The site's own type: its sans, the serif on trial, and the mono.
const FAMILIES = {
  sans: { label: 'Sans (site)', css: 'var(--font-system)' },
  serif: { label: 'Instrument Serif', css: 'var(--font-serif)' },
  mono: { label: 'JetBrains Mono', css: 'var(--font-mono)' },
};
const WEIGHTS = [300, 400, 500, 600, 700, 800];

const ERRORS = {
  too_large: 'The file is over 20 MB. Compress it and try again.',
  unsupported_type: 'Use JPG, PNG, WebP, GIF, MP4 or WebM.',
  quota_or_state: 'The page has run out of storage space.',
  rate_limited: 'Too many uploads at once. Wait a moment and try again.',
};

const findEl = (key) =>
  key && (document.querySelector(`[data-media-key="${key}"]`) || document.querySelector(`[data-text-key="${key}"]`));

export function ReviewProvider({ children }) {
  const [canEdit, setCanEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [docs, setDocs] = useState({});
  // Changes not saved yet: {key, fields}; a null field means "remove".
  const [draft, setDraft] = useState(null);
  const [selected, setSelected] = useState(null); // {key, kind: 'media' | 'text', label}
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const caps = useRef({ db: null, assets: null });
  const fileInput = useRef(null);
  const docsRef = useRef(docs);
  const draftRef = useRef(null);
  const saveTimer = useRef(null);
  docsRef.current = docs;

  useEffect(() => {
    if (!ENABLED || !window.claude?.use) return undefined;
    let unsubscribe;
    let cancelled = false;
    Promise.all([window.claude.use('db'), window.claude.use('assets')]).then(([db, assets]) => {
      if (cancelled || !db) return;
      caps.current = { db, assets };
      unsubscribe = db.collection('media').onSnapshot(
        (snap) => {
          const next = {};
          snap.docs.forEach((doc) => {
            next[doc.id] = doc.data() || {};
          });
          setDocs(next);
        },
        () => setStatus('Lost the connection to saved edits. Reload the page.'),
      );
      setCanEdit(Boolean(assets));
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  // A slot's record with the unsaved changes on top.
  const current = useCallback(
    (key) => {
      const data = { ...(docs[key] || {}) };
      if (draft?.key === key) {
        Object.entries(draft.fields).forEach(([field, value]) => {
          if (value === null) delete data[field];
          else data[field] = value;
        });
      }
      return data;
    },
    [docs, draft],
  );

  const draftSize = draft?.fields.size;
  const { overrides, sizes } = useMemo(() => {
    const o = {};
    const s = {};
    Object.entries(docs).forEach(([key, data]) => {
      if (data.assetId) o[key] = { url: `/_blob/${data.assetId}`, contentType: data.contentType || '' };
      if (data.size?.width) s[key] = data.size;
    });
    if (draft && draftSize !== undefined) {
      if (draftSize) s[draft.key] = draftSize;
      else delete s[draft.key];
    }
    return { overrides: o, sizes: s };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docs, draft?.key, draftSize]);

  const contextValue = useMemo(() => ({ editing, overrides, sizes }), [editing, overrides, sizes]);

  // Writes the slot's whole record (set, not update: the doc may not
  // exist yet); a record left with nothing in it is deleted.
  const writeDoc = async (key, data) => {
    const doc = caps.current.db.collection('media').doc(key);
    if (data.assetId || data.size || data.offset || data.font)
      await doc.set({ ...data, updatedAt: new Date().toISOString() });
    else await doc.delete();
  };

  const commit = async () => {
    clearTimeout(saveTimer.current);
    const pending = draftRef.current;
    if (!pending || !caps.current.db) return;
    const data = { ...(docsRef.current[pending.key] || {}), ...pending.meta };
    Object.entries(pending.fields).forEach(([field, value]) => {
      if (value === null) delete data[field];
      else data[field] = value;
    });
    try {
      await writeDoc(pending.key, data);
      setStatus('Saved.');
    } catch {
      setStatus('Could not save. Try again.');
    } finally {
      if (draftRef.current === pending) {
        draftRef.current = null;
        setDraft(null);
      }
    }
  };

  // Every change shows at once; the save waits for a pause.
  const change = (fields) => {
    if (!selected) return;
    const prev = draftRef.current?.key === selected.key ? draftRef.current.fields : {};
    const meta = selected.kind === 'text' ? { kind: 'text', page: pageScope(), text: selected.label } : {};
    const next = { key: selected.key, fields: { ...prev, ...fields }, meta };
    draftRef.current = next;
    setDraft(next);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(commit, 450);
  };

  const offsetOf = (key) => current(key).offset || { x: 0, y: 0 };
  const setOffset = (x, y) => change({ offset: x || y ? { x: Math.round(x), y: Math.round(y) } : null });
  const restyle = (patch) => {
    const font = { ...(current(selected.key).font || {}), ...patch };
    Object.keys(font).forEach((field) => {
      if (font[field] === undefined || font[field] === '' || font[field] === false) delete font[field];
    });
    change({ font: Object.keys(font).length ? font : null });
  };
  const resize = (patch) => {
    const size = { ...(current(selected.key).size || { width: 100, align: 'center' }), ...patch };
    change({ size: size.width >= 100 ? null : size });
  };

  // Offsets and fonts apply straight to the DOM. Offsets use CSS
  // `translate`, which leaves the scroll animations' `transform` alone.
  const layoutRef = useRef({});
  layoutRef.current = useMemo(() => {
    const map = {};
    const keys = new Set([...Object.keys(docs), ...(draft ? [draft.key] : [])]);
    keys.forEach((key) => {
      const { offset, font } = current(key);
      if (offset || font) map[key] = { offset, font };
    });
    return map;
  }, [docs, draft, current]);

  const apply = useCallback(() => {
    const root = document.getElementById('root');
    if (!root) return;
    tagText(root);
    root.querySelectorAll('[data-media-key], [data-text-key]').forEach((el) => {
      const { offset, font } = layoutRef.current[el.dataset.mediaKey || el.dataset.textKey] || {};
      if (offset) {
        el.style.translate = `${offset.x}px ${offset.y}px`;
        el.dataset.moved = '';
      } else if ('moved' in el.dataset) {
        el.style.translate = '';
        delete el.dataset.moved;
      }
      if (font) {
        el.style.fontFamily = FAMILIES[font.family]?.css || '';
        el.style.fontSize = font.size ? `${font.size}px` : '';
        el.style.fontWeight = font.weight || '';
        el.style.fontStyle = font.italic ? 'italic' : '';
        el.dataset.restyled = '';
      } else if ('restyled' in el.dataset) {
        el.style.fontFamily = '';
        el.style.fontSize = '';
        el.style.fontWeight = '';
        el.style.fontStyle = '';
        delete el.dataset.restyled;
      }
    });
  }, []);

  useEffect(() => {
    if (ENABLED) apply();
  }, [apply, docs, draft]);

  useEffect(() => {
    if (!ENABLED) return undefined;
    const root = document.getElementById('root');
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    window.addEventListener('hashchange', schedule);
    schedule();
    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', schedule);
      cancelAnimationFrame(frame);
    };
  }, [apply]);

  const select = (el) => {
    if (draftRef.current) commit();
    if (!el) {
      setSelected(null);
      return;
    }
    const media = el.dataset.mediaKey;
    setSelected(
      media
        ? { key: media, kind: 'media', label: el.getAttribute('alt') || media.split('__')[1] }
        : { key: el.dataset.textKey, kind: 'text', label: ownText(el).slice(0, 80) },
    );
    setStatus('');
  };

  // Edit mode: clicks select instead of following links; drag moves the
  // selection; arrow keys nudge it (Shift: 10px).
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const handlers = useRef({});
  handlers.current = { select, setOffset, offsetOf };

  useEffect(() => {
    if (!editing) return undefined;
    document.documentElement.dataset.reviewEditing = '';
    const pick = (target) => {
      if (!target.closest('#root') || target.closest('[data-review-ui]')) return null;
      return target.closest('[data-media-key]') || target.closest('[data-text-key]');
    };
    const onClick = (event) => {
      if (event.target.closest('[data-review-ui]') || !event.target.closest('#root')) return;
      event.preventDefault();
      event.stopPropagation();
      handlers.current.select(pick(event.target));
    };
    let drag = null;
    const onDown = (event) => {
      const el = pick(event.target);
      if (!el || event.button !== 0) return;
      const key = el.dataset.mediaKey || el.dataset.textKey;
      if (key !== selectedRef.current?.key) return;
      event.preventDefault();
      const start = handlers.current.offsetOf(key);
      drag = { x: event.clientX, y: event.clientY, start };
    };
    const onMove = (event) => {
      if (!drag) return;
      handlers.current.setOffset(drag.start.x + event.clientX - drag.x, drag.start.y + event.clientY - drag.y);
    };
    const onUp = () => {
      drag = null;
    };
    const onKey = (event) => {
      const sel = selectedRef.current;
      const steps = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (!sel || !steps[event.key] || event.target.closest?.('input, select, textarea')) return;
      event.preventDefault();
      const step = event.shiftKey ? 10 : 1;
      const { x, y } = handlers.current.offsetOf(sel.key);
      handlers.current.setOffset(x + steps[event.key][0] * step, y + steps[event.key][1] * step);
    };
    const noDrag = (event) => pick(event.target) && event.preventDefault();
    document.addEventListener('click', onClick, true);
    document.addEventListener('pointerdown', onDown, true);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('keydown', onKey);
    document.addEventListener('dragstart', noDrag, true);
    return () => {
      delete document.documentElement.dataset.reviewEditing;
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('dragstart', noDrag, true);
    };
  }, [editing]);

  // Outline the selection (it may re-render, so re-mark on every change).
  useEffect(() => {
    document.querySelectorAll('[data-review-selected]').forEach((el) => el.removeAttribute('data-review-selected'));
    if (editing && selected) findEl(selected.key)?.setAttribute('data-review-selected', '');
  });

  const upload = async (file) => {
    const { assets } = caps.current;
    if (!file || selected?.kind !== 'media' || !assets) return;
    setBusy(true);
    setStatus(`Uploading ${file.name}…`);
    try {
      await commit();
      const result = await assets.upload(file);
      await writeDoc(selected.key, {
        ...(docsRef.current[selected.key] || {}),
        assetId: result.id,
        contentType: result.contentType,
        fileName: file.name,
      });
      setStatus(`Replaced with ${file.name}.`);
    } catch (error) {
      setStatus(ERRORS[error?.code] || 'Upload failed. Try again.');
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const revert = async () => {
    if (!selected) return;
    try {
      await commit();
      // eslint-disable-next-line no-unused-vars
      const { assetId, contentType, fileName, ...rest } = docsRef.current[selected.key] || {};
      await writeDoc(selected.key, rest);
      setStatus('Back to the original.');
    } catch {
      setStatus('Could not restore the original. Try again.');
    }
  };

  const record = selected ? current(selected.key) : {};
  const offset = record.offset || { x: 0, y: 0 };
  const width = record.size?.width || 100;
  const font = record.font || {};
  const shown = selected?.kind === 'text' ? findEl(selected.key) : null;
  const shownStyle = shown ? getComputedStyle(shown) : null;

  return (
    <ReviewContext.Provider value={contextValue}>
      {children}
      {ENABLED && (
        <div className={styles.bar} role="region" aria-label="Review tools" data-review-ui>
          <SerifTrial />
          <ExpertScan />
          {editing && (
            <>
              <span className={styles.status} aria-live="polite">
                {status ||
                  (selected
                    ? `Selected: ${selected.label}`
                    : 'Click any image, video or text. Drag it, or use the arrow keys, to move it')}
              </span>
              {selected && (
                <span className={styles.sizer}>
                  <label htmlFor="review-x">X</label>
                  <input
                    id="review-x"
                    className={styles.number}
                    type="number"
                    step="1"
                    value={offset.x}
                    onChange={(event) => setOffset(Number(event.target.value) || 0, offset.y)}
                  />
                  <label htmlFor="review-y">Y</label>
                  <input
                    id="review-y"
                    className={styles.number}
                    type="number"
                    step="1"
                    value={offset.y}
                    onChange={(event) => setOffset(offset.x, Number(event.target.value) || 0)}
                  />
                  <button type="button" disabled={!record.offset} onClick={() => setOffset(0, 0)}>
                    Reset position
                  </button>
                </span>
              )}
              {selected?.kind === 'text' && (
                <span className={styles.sizer}>
                  <label htmlFor="review-font">Font</label>
                  <select
                    id="review-font"
                    value={font.family || ''}
                    onChange={(event) => restyle({ family: event.target.value })}
                  >
                    <option value="">As designed</option>
                    {Object.entries(FAMILIES).map(([id, f]) => (
                      <option key={id} value={id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="review-font-size">Size</label>
                  <input
                    id="review-font-size"
                    className={styles.number}
                    type="number"
                    min="8"
                    max="400"
                    step="1"
                    value={font.size || Math.round(parseFloat(shownStyle?.fontSize) || 0) || ''}
                    onChange={(event) => restyle({ size: Number(event.target.value) || undefined })}
                  />
                  <label htmlFor="review-font-weight">Weight</label>
                  <select
                    id="review-font-weight"
                    value={font.weight || ''}
                    onChange={(event) => restyle({ weight: Number(event.target.value) || undefined })}
                  >
                    <option value="">As designed ({shownStyle?.fontWeight})</option>
                    {WEIGHTS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    aria-pressed={Boolean(font.italic)}
                    onClick={() => restyle({ italic: !font.italic })}
                  >
                    Italic
                  </button>
                  <button type="button" disabled={!record.font} onClick={() => change({ font: null })}>
                    Reset font
                  </button>
                </span>
              )}
              {selected?.kind === 'media' && (
                <span className={styles.sizer}>
                  <label htmlFor="review-media-size">Size</label>
                  <input
                    id="review-media-size"
                    type="range"
                    min="20"
                    max="100"
                    step="1"
                    value={width}
                    onChange={(event) => resize({ width: Number(event.target.value) })}
                  />
                  <output htmlFor="review-media-size">{width}%</output>
                  {Object.entries(ALIGN_LABELS).map(([align, label]) => (
                    <button
                      type="button"
                      key={align}
                      aria-pressed={(record.size?.align || 'center') === align}
                      disabled={width >= 100}
                      onClick={() => resize({ align })}
                    >
                      {label}
                    </button>
                  ))}
                </span>
              )}
              <input
                id="review-media-file"
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                hidden
                onChange={(event) => upload(event.target.files?.[0])}
              />
              {selected?.kind === 'media' && (
                <button type="button" disabled={busy} onClick={() => fileInput.current?.click()}>
                  Upload replacement
                </button>
              )}
              {selected?.kind === 'media' && overrides[selected.key] && (
                <button type="button" disabled={busy} onClick={revert}>
                  Restore original
                </button>
              )}
            </>
          )}
          {canEdit && (
            <button
              type="button"
              className={styles.toggle}
              aria-pressed={editing}
              onClick={() => {
                if (draftRef.current) commit();
                setEditing((value) => !value);
                setSelected(null);
                setStatus('');
              }}
            >
              {editing ? 'Done' : 'Edit'}
            </button>
          )}
        </div>
      )}
    </ReviewContext.Provider>
  );
}
