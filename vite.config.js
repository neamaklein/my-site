import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, createReadStream } from 'node:fs';
import { extname, join } from 'node:path';

// `npm run edit`: the review copy's page editor on Neama's machine. Its
// records and uploads are kept in review-local/ (not committed) — see
// src/review/localBackend.js.
const LOCAL = 'review-local';
const TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

function localEdits() {
  const file = join(LOCAL, 'media.json');
  const blobs = join(LOCAL, 'blobs');
  const read = () => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {});
  const save = (docs) => {
    mkdirSync(LOCAL, { recursive: true });
    writeFileSync(file, `${JSON.stringify(docs, null, 2)}\n`);
  };
  const body = (req) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });

  return {
    name: 'local-edits',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://local');
        const send = (status, data) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };
        try {
          if (url.pathname === '/__edit/media' && req.method === 'GET') return send(200, read());

          const docMatch = url.pathname.match(/^\/__edit\/media\/([^/]+)$/);
          if (docMatch) {
            const id = decodeURIComponent(docMatch[1]);
            const docs = read();
            if (req.method === 'PUT') docs[id] = JSON.parse((await body(req)).toString('utf8'));
            else if (req.method === 'DELETE') delete docs[id];
            else return next();
            save(docs);
            return send(200, { ok: true });
          }

          if (url.pathname === '/__edit/upload' && req.method === 'POST') {
            const ext = extname(url.searchParams.get('name') || '').toLowerCase();
            if (!TYPES[ext]) return send(415, { error: 'unsupported_type' });
            const id = randomBytes(16).toString('hex');
            mkdirSync(blobs, { recursive: true });
            writeFileSync(join(blobs, `${id}${ext}`), await body(req));
            return send(200, { id, contentType: TYPES[ext] });
          }

          const blobMatch = url.pathname.match(/^\/_blob\/([0-9a-f]{32})$/);
          if (blobMatch && existsSync(blobs)) {
            const name = readdirSync(blobs).find((f) => f.startsWith(blobMatch[1]));
            if (!name) return next();
            res.setHeader('Content-Type', TYPES[extname(name)] || 'application/octet-stream');
            return createReadStream(join(blobs, name)).pipe(res);
          }
        } catch {
          return send(500, { error: 'failed' });
        }
        return next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), ...(process.env.VITE_LOCAL_EDIT === '1' ? [localEdits()] : [])],
  // GitHub Pages serves this repo from /my-site/, not the domain root.
  base: '/my-site/',
});
