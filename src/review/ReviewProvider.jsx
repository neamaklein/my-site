import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ExpertScan from './ExpertScan.jsx';
import SerifTrial from './SerifTrial.jsx';
import Inspector from './Inspector.jsx';
import { applyEdits, describe, findEl, identify, pageScope } from './editing.js';
import styles from './Review.module.css';

// Review-only page editor, active in the claude.ai review copy
// (VITE_ROUTER=hash). In Edit mode a writer can pick ANY element on the
// page (background, container, logo, text, image, video) and change any
// parameter of it in the Inspector: position (drag, arrow keys, x/y,
// rotate, scale, layer), size and spacing, layout, type, fill and border,
// media fit, any CSS property by name; media can also be swapped for an
// upload. Every edit is shared and kept in the artifact's db under
// `media/<key>`: `offset`, `font`, `size` (media width in its slot) and
// `css` (property → value), plus the asset of a replacement. Elements
// without text or a file are found again by `path` on their `page`.
// Claude reads these back to move them into the real site; the GitHub
// Pages build never runs any of this.
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
const MARGINS = { start: '0 auto 0 0', center: '0 auto', end: '0 0 0 auto' };
export function sizeStyle(size) {
  if (!size?.width || size.width >= 100) return undefined;
  return { width: `${size.width}%`, margin: MARGINS[size.align] || MARGINS.center };
}

// Props for a media element: its key (so the page editor can find it)
// and, in edit mode, the editable outline.
export function useEditableMedia(key) {
  const { editing, overrides, sizes } = useReview();
  const editProps = ENABLED ? { 'data-media-key': key, ...(editing ? { className: styles.editable } : {}) } : {};
  return { override: overrides[key], size: sizes[key], editProps };
}

const ERRORS = {
  too_large: 'The file is over 20 MB. Compress it and try again.',
  unsupported_type: 'Use JPG, PNG, WebP, GIF, MP4 or WebM.',
  quota_or_state: 'The page has run out of storage space.',
  rate_limited: 'Too many uploads at once. Wait a moment and try again.',
};

const EDIT_FIELDS = ['assetId', 'size', 'offset', 'font', 'css'];
const hasEdits = (data) => EDIT_FIELDS.some((field) => data[field]);

export function ReviewProvider({ children }) {
  const [canEdit, setCanEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [docs, setDocs] = useState({});
  // Changes not saved yet: {key, fields, meta}; a null field means "remove".
  const [draft, setDraft] = useState(null);
  const [selected, setSelected] = useState(null); // {key, kind: media|text|element, label, path?}
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [, setTick] = useState(0); // re-render after the DOM settles
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

  // Every record with the unsaved changes on top.
  const records = useMemo(() => {
    if (!draft) return docs;
    const data = { ...(docs[draft.key] || {}), ...draft.meta };
    Object.entries(draft.fields).forEach(([field, value]) => {
      if (value === null) delete data[field];
      else data[field] = value;
    });
    return { ...docs, [draft.key]: data };
  }, [docs, draft]);
  const recordsRef = useRef(records);
  recordsRef.current = records;

  const { overrides, sizes } = useMemo(() => {
    const o = {};
    const s = {};
    Object.entries(records).forEach(([key, data]) => {
      if (data.assetId) o[key] = { url: `/_blob/${data.assetId}`, contentType: data.contentType || '' };
      if (data.size?.width) s[key] = data.size;
    });
    return { overrides: o, sizes: s };
    // Only media fields matter to the media components.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docs, draft?.key, draft?.fields.size]);

  const contextValue = useMemo(() => ({ editing, overrides, sizes }), [editing, overrides, sizes]);

  // Writes a record whole (set, not update: it may not exist yet); a
  // record left with no edits is deleted.
  const writeDoc = async (key, data) => {
    const doc = caps.current.db.collection('media').doc(key);
    if (hasEdits(data)) await doc.set({ ...data, updatedAt: new Date().toISOString() });
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
  const change = (fields, target = selected) => {
    if (!target) return;
    const prev = draftRef.current?.key === target.key ? draftRef.current.fields : {};
    if (draftRef.current && draftRef.current.key !== target.key) commit();
    const meta = Object.fromEntries(
      Object.entries(
        target.kind === 'media'
          ? {}
          : {
              kind: target.kind,
              page: pageScope(),
              ...(target.kind === 'text' ? { text: target.label } : { path: target.path, label: target.label }),
            },
      ).filter(([, value]) => value !== undefined),
    );
    const next = { key: target.key, fields: { ...prev, ...fields }, meta };
    draftRef.current = next;
    setDraft(next);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(commit, 450);
  };

  const record = selected ? records[selected.key] || {} : {};
  const offsetOf = (key) => recordsRef.current[key]?.offset || { x: 0, y: 0 };
  const setOffset = (x, y) => change({ offset: x || y ? { x: Math.round(x), y: Math.round(y) } : null });
  const setCss = (prop, value) => {
    const css = { ...(record.css || {}) };
    if (value === '' || value === undefined || value === null) delete css[prop];
    else css[prop] = String(value);
    change({ css: Object.keys(css).length ? css : null });
  };
  const restyle = (patch) => {
    const font = { ...(record.font || {}), ...patch };
    Object.keys(font).forEach((field) => {
      if (font[field] === undefined || font[field] === '' || font[field] === false) delete font[field];
    });
    change({ font: Object.keys(font).length ? font : null });
  };
  const resize = (patch) => {
    const size = { ...(record.size || { width: 100, align: 'center' }), ...patch };
    change({ size: size.width >= 100 ? null : size });
  };
  const resetAll = (target) => change({ offset: null, font: null, size: null, css: null }, target);

  // Edits go straight onto the DOM, again whenever the page re-renders.
  const apply = useCallback(() => {
    const root = document.getElementById('root');
    if (root) applyEdits(root, recordsRef.current);
  }, []);

  useEffect(() => {
    if (ENABLED) apply();
  }, [apply, records]);

  useEffect(() => {
    if (!ENABLED) return undefined;
    const root = document.getElementById('root');
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        apply();
        setTick((t) => t + 1);
      });
    };
    // Ignore the editor's own panels changing.
    const observer = new MutationObserver((list) => {
      if (
        list.some(
          (m) => !m.target.parentElement?.closest?.('[data-review-ui]') && !m.target.closest?.('[data-review-ui]'),
        )
      )
        schedule();
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    window.addEventListener('hashchange', schedule);
    schedule();
    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', schedule);
      cancelAnimationFrame(frame);
    };
  }, [apply]);

  const select = (target) => {
    if (draftRef.current) commit();
    setSelected(target || null);
    setStatus('');
  };

  // Edit mode: a click picks the element under the pointer (links don't
  // navigate); dragging the picked element moves it; arrow keys nudge it
  // (Shift: 10px); Esc lets go.
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const handlers = useRef({});
  handlers.current = { select, setOffset, offsetOf };

  useEffect(() => {
    if (!editing) return undefined;
    document.documentElement.dataset.reviewEditing = '';
    const onPage = (target) => target.closest?.('#root') && !target.closest('[data-review-ui]');
    const onClick = (event) => {
      if (!onPage(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.target.id === 'root') return;
      handlers.current.select(identify(event.target));
    };
    let drag = null;
    const onDown = (event) => {
      if (!onPage(event.target) || event.button !== 0) return;
      // Only a press on the picked element itself drags it; a press on
      // something inside it is a click that picks that instead.
      if (!selectedRef.current || identify(event.target).key !== selectedRef.current.key) return;
      event.preventDefault();
      if (document.activeElement?.closest?.('[data-review-ui]')) document.activeElement.blur();
      drag = { x: event.clientX, y: event.clientY, start: handlers.current.offsetOf(selectedRef.current.key) };
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
      if (event.target.closest?.('input, select, textarea')) return;
      if (event.key === 'Escape') {
        handlers.current.select(null);
        return;
      }
      const steps = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (!sel || !steps[event.key]) return;
      event.preventDefault();
      const step = event.shiftKey ? 10 : 1;
      const { x, y } = handlers.current.offsetOf(sel.key);
      handlers.current.setOffset(x + steps[event.key][0] * step, y + steps[event.key][1] * step);
    };
    const noDrag = (event) => onPage(event.target) && event.preventDefault();
    let hovered = null;
    const onOver = (event) => {
      hovered?.removeAttribute('data-review-hover');
      hovered = onPage(event.target) && event.target.id !== 'root' ? event.target : null;
      hovered?.setAttribute('data-review-hover', '');
    };
    document.addEventListener('pointerover', onOver, true);
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
      document.removeEventListener('pointerover', onOver, true);
      hovered?.removeAttribute('data-review-hover');
    };
  }, [editing]);

  // Outline the selection (it may re-render, so re-mark on every render).
  useEffect(() => {
    document.querySelectorAll('[data-review-selected]').forEach((el) => el.removeAttribute('data-review-selected'));
    if (editing && selected) findEl(selected)?.setAttribute('data-review-selected', '');
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

  // What the inspector shows about the picked element.
  const el = editing && selected ? findEl(selected) : null;
  const scope = pageScope();
  const edits = editing
    ? Object.entries(records)
        .filter(([key, data]) => (data.css || data.offset || data.font || data.size) && key.startsWith(`${scope}__`))
        .map(([key, data]) => {
          const target =
            data.kind === 'element' || data.kind === 'text'
              ? { key, kind: data.kind, path: data.path, label: data.label || data.text || key }
              : { key, kind: 'media', label: data.fileName || key.split('__')[1] };
          const found = findEl(target);
          return { ...target, label: target.label || (found ? describe(found) : key), found: Boolean(found) };
        })
    : [];

  return (
    <ReviewContext.Provider value={contextValue}>
      {children}
      {ENABLED && editing && (
        <Inspector
          selected={selected}
          record={record}
          computed={el ? getComputedStyle(el) : null}
          isMedia={Boolean(el && /^(IMG|VIDEO)$/.test(el.tagName))}
          hasText={Boolean(el && (el.innerText || '').trim())}
          canReplace={selected?.kind === 'media'}
          replaced={Boolean(selected && overrides[selected.key])}
          busy={busy}
          edits={edits}
          setCss={setCss}
          setOffset={setOffset}
          restyle={restyle}
          resize={resize}
          resetAll={resetAll}
          select={select}
          onUpload={() => fileInput.current?.click()}
          onRevert={revert}
        />
      )}
      {ENABLED && (
        <div className={styles.bar} role="region" aria-label="Review tools" data-review-ui>
          <SerifTrial />
          <ExpertScan />
          {editing && (
            <>
              <span className={styles.status} aria-live="polite">
                {status || (selected ? `Selected: ${selected.label}` : 'Click anything on the page to edit it')}
              </span>
              <input
                id="review-media-file"
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                hidden
                onChange={(event) => upload(event.target.files?.[0])}
              />
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
