import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import ExpertScan from './ExpertScan.jsx';
import styles from './Review.module.css';

// Review-only media editing, active in the claude.ai review copy
// (VITE_ROUTER=hash). Writers can swap any image or video for an upload:
// files go to the artifact's asset store, and `media/<key>` in its db
// records which asset replaces which slot, so Claude can read the
// replacements back and move them into the real site. The GitHub Pages
// build never runs any of this.
const ENABLED = import.meta.env.VITE_ROUTER === 'hash';

const ReviewContext = createContext({ editing: false, overrides: {}, select: () => {}, selected: null });
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

// Props for a media element: in edit mode it becomes clickable/selectable.
export function useEditableMedia(key) {
  const { editing, overrides, select, selected } = useReview();
  const override = overrides[key];
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
  return { override, editProps };
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
  const [overrides, setOverrides] = useState({});
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
            const data = doc.data();
            if (data?.assetId) next[doc.id] = { url: `/_blob/${data.assetId}`, contentType: data.contentType || '' };
          });
          setOverrides(next);
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

  const select = useCallback((key) => {
    setSelected(key);
    setStatus('');
  }, []);

  const upload = async (file) => {
    const { db, assets } = caps.current;
    if (!file || !selected || !db || !assets) return;
    setBusy(true);
    setStatus(`Uploading ${file.name}…`);
    try {
      const result = await assets.upload(file);
      await db.collection('media').doc(selected).set({
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
      await db.collection('media').doc(selected).delete();
      setStatus('Back to the original.');
    } catch {
      setStatus('Could not restore the original. Try again.');
    }
  };

  return (
    <ReviewContext.Provider value={{ editing, overrides, select, selected }}>
      {children}
      {ENABLED && (
        <div className={styles.bar} role="region" aria-label="Review tools">
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
              {editing ? 'Done' : 'Replace media'}
            </button>
          )}
        </div>
      )}
    </ReviewContext.Provider>
  );
}
