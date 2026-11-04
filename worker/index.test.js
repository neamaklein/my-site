// Contact form checks (run with `npm test`, also in CI before every deploy).
import assert from 'node:assert/strict';
import test from 'node:test';
import worker, { validate } from './index.js';

const ok = { name: 'Dana', email: 'dana@example.com', type: 'Branding', message: 'Hello' };

test('accepts a complete message', () => {
  assert.deepEqual(validate(ok), ok);
  assert.equal(validate({ ...ok, type: '' }).type, '');
});

test('rejects missing, malformed or oversized fields', () => {
  assert.equal(validate(null).error, 'missing_fields');
  assert.equal(validate({ ...ok, name: '' }).error, 'missing_fields');
  assert.equal(validate({ ...ok, message: '   ' }).error, 'missing_fields');
  assert.equal(validate({ ...ok, email: 'not-an-email' }).error, 'bad_email');
  assert.equal(validate({ ...ok, message: 'x'.repeat(5001) }).error, 'too_long');
});

test('flattens line breaks so nothing can be added to the email headers', () => {
  assert.equal(validate({ ...ok, name: 'Eve\r\nBcc: spam@x.com' }).name, 'Eve Bcc: spam@x.com');
});

test('only POST /api/contact is handled, and only with a passing spam check', async () => {
  const env = { TURNSTILE_SECRET: 'unused', EMAIL: { send: () => assert.fail('must not send') } };
  const call = (path, init) => worker.fetch(new Request(`https://neama.design${path}`, init), env);
  const post = (body) => ({ method: 'POST', body: JSON.stringify(body) });

  assert.equal((await call('/api/other')).status, 404);
  assert.equal((await call('/api/contact')).status, 405);
  assert.equal((await call('/api/contact', { method: 'POST', body: 'nope' })).status, 400);
  assert.equal((await call('/api/contact', post({ ...ok, email: 'x' }))).status, 400);
  // No token: refused before Cloudflare is ever asked.
  assert.equal((await call('/api/contact', post(ok))).status, 403);
});
