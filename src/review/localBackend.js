// Local stand-in for the claude.ai runtime, so the review copy's page
// editor also works on Neama's own machine (`npm run edit`). It gives the
// editor the same `db` and `assets` it gets on claude.ai, backed by the
// dev server (see `localEdits` in vite.config.js): records go to
// review-local/media.json, uploads to review-local/blobs/. Records use
// the same keys as the artifact's db, so Claude bakes them the same way.
const ENABLED = import.meta.env.VITE_LOCAL_EDIT === '1';

function createDb() {
  const listeners = new Set();
  let docs = {};

  const refresh = async () => {
    const response = await fetch('/__edit/media');
    if (!response.ok) throw new Error('read failed');
    docs = await response.json();
    const snap = { docs: Object.entries(docs).map(([id, data]) => ({ id, data: () => data })) };
    listeners.forEach(({ next }) => next(snap));
  };

  const write = async (id, method, data) => {
    const response = await fetch(`/__edit/media/${encodeURIComponent(id)}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) throw new Error('write failed');
    await refresh();
  };

  return {
    collection: () => ({
      onSnapshot(next, error) {
        const listener = { next, error };
        listeners.add(listener);
        refresh().catch(() => error?.());
        return () => listeners.delete(listener);
      },
      doc: (id) => ({
        set: (data) => write(id, 'PUT', data),
        delete: () => write(id, 'DELETE'),
      }),
    }),
  };
}

const assets = {
  async upload(file) {
    const response = await fetch(`/__edit/upload?name=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });
    if (!response.ok) throw Object.assign(new Error('upload failed'), { code: 'unsupported_type' });
    return response.json();
  },
};

if (ENABLED && !window.claude) {
  const db = createDb();
  window.claude = { use: async (name) => ({ db, assets })[name] ?? null };
}
