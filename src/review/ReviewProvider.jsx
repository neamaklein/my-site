import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import ExpertScan from './ExpertScan.jsx';
import SerifTrial from './SerifTrial.jsx';
import styles from './Review.module.css';

// Review-only media editing, active in the claude.ai review copy
// (VITE_ROUTER=hash). Writers can swap any image or video for an upload,
// and set how wide it sits in its slot (and on which side). Files go to
// the artifact's asset store; `media/<key>` in its db records the
// replacement asset and/or `size: {width, align}`, so Claude can read
// them back and move them into the real site. The GitHub Pages build
// never runs any of this.
const ENABLED = import.meta.env.VITE_ROUTER === 'hash';

const ReviewContext = createContext({ editing: false, overrides: {}, sizes: {}, select: () => {}, selected: null });
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

// Props for a media element: in edit mode it becomes clickable/selectable.
export function useEditableMedia(key) {
  const { editing, overrides, sizes, select, selected } = useReview();
  const override = overrides[key];
  const size = sizes[key];
  const editProps = editing
    ? {
        'data-media-key': key,
        className: `${styles.editable} ${selected === key ? styles.selected : ''}`,
        onClick: (event) => {
          event.preventDefault();
          event.stopPropagation();
          select(key);
        },
      }
    : {};
  return { override, size, editProps };
}

const ERRORS = {
  too_large: 'The file is over 20 MB. Compress it and try again.',
  unsupported_type: 'Use JPG, PNG, WebP, GIF, MP4 or WebM.',
  quota_or_state: 'The page has run out of storage space.',
  rate_limited: 'Too many uploads at once. Wait a moment and try again.',
};

export function ReviewProvider({ children }) {
  const [canEdit, setCanEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [docs, setDocs] = useState({});
  const [draft, setDraft] = useState(null); // size being dragged, before it saves
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const caps = useRef({ db: null, assets: null });
  const fileInput = useRef(null);

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
        () => setStatus('Lost the connection to saved media. Reload the page.'),
      );
      setCanEdit(Boolean(assets));
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const overrides = {};
  const sizes = {};
  Object.entries(docs).forEach(([key, data]) => {
    if (data.assetId) overrides[key] = { url: `/_blob/${data.assetId}`, contentType: data.contentType || '' };
    if (data.size?.width) sizes[key] = data.size;
  });
  if (draft) sizes[draft.key] = draft.size;

  const select = useCallback((key) => {
    setSelected(key);
    setStatus('');
  }, []);

  // Writes the slot's whole record (set, not update: the doc may not
  // exist yet); an empty record is deleted.
  const writeDoc = async (key, data) => {
    const { db } = caps.current;
    const doc = db.collection('media').doc(key);
    if (Object.keys(data).length) await doc.set(data);
    else await doc.delete();
  };

  // Dragging the slider previews at once; the save waits for a pause.
  const saveTimer = useRef(null);
  const resize = (patch) => {
    if (!selected) return;
    const current = (draft?.key === selected && draft.size) || sizes[selected] || { width: 100, align: 'center' };
    const size = { ...current, ...patch };
    setDraft({ key: selected, size });
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      // eslint-disable-next-line no-unused-vars
      const { size: _size, sizeUpdatedAt: _at, ...rest } = docs[selected] || {};
      try {
        await writeDoc(selected, size.width >= 100 ? rest : { ...rest, size, sizeUpdatedAt: new Date().toISOString() });
        setStatus(size.width >= 100 ? 'Full size.' : `Saved: ${size.width}%, ${ALIGN_LABELS[size.align]}.`);
      } catch {
        setStatus('Could not save the size. Try again.');
      } finally {
        setDraft(null);
      }
    }, 450);
  };

  const upload = async (file) => {
    const { db, assets } = caps.current;
    if (!file || !selected || !db || !assets) return;
    setBusy(true);
    setStatus(`Uploading ${file.name}…`);
    try {
      const result = await assets.upload(file);
      await db
        .collection('media')
        .doc(selected)
        .set({
          ...(docs[selected]?.size ? { size: docs[selected].size } : {}),
          assetId: result.id,
          contentType: result.contentType,
          fileName: file.name,
          updatedAt: new Date().toISOString(),
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
    const { db } = caps.current;
    if (!db || !selected) return;
    try {
      const { size } = docs[selected] || {};
      await writeDoc(selected, size ? { size } : {});
      setStatus('Back to the original.');
    } catch {
      setStatus('Could not restore the original. Try again.');
    }
  };

  return (
    <ReviewContext.Provider value={{ editing, overrides, sizes, select, selected }}>
      {children}
      {ENABLED && (
        <div className={styles.bar} role="region" aria-label="Review tools">
          <SerifTrial />
          <ExpertScan />
          {editing && (
            <>
              <span className={styles.status} aria-live="polite">
                {status || (selected ? `Selected: ${selected.split('__')[1]}` : 'Click an image or video to select it')}
              </span>
              <input
                id="review-media-file"
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                hidden
                onChange={(event) => upload(event.target.files?.[0])}
              />
              {selected && (
                <span className={styles.sizer}>
                  <label htmlFor="review-media-size">Size</label>
                  <input
                    id="review-media-size"
                    type="range"
                    min="20"
                    max="100"
                    step="1"
                    value={sizes[selected]?.width || 100}
                    onChange={(event) => resize({ width: Number(event.target.value) })}
                  />
                  <output htmlFor="review-media-size">{sizes[selected]?.width || 100}%</output>
                  {[
                    ['start', 'Left'],
                    ['center', 'Center'],
                    ['end', 'Right'],
                  ].map(([align, label]) => (
                    <button
                      type="button"
                      key={align}
                      aria-pressed={(sizes[selected]?.align || 'center') === align}
                      disabled={(sizes[selected]?.width || 100) >= 100}
                      onClick={() => resize({ align })}
                    >
                      {label}
                    </button>
                  ))}
                </span>
              )}
              <button type="button" disabled={!selected || busy} onClick={() => fileInput.current?.click()}>
                Upload replacement
              </button>
              {selected && overrides[selected] && (
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
                setEditing((value) => !value);
                setSelected(null);
                setStatus('');
              }}
            >
              {editing ? 'Done' : 'Edit media'}
            </button>
          )}
        </div>
      )}
    </ReviewContext.Provider>
  );
}
