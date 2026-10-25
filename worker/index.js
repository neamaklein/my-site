// Cloudflare Worker for the site's "Send a message" form: POST /api/contact.
// Only /api/* reaches this code (cloudflare.config.ts runWorkerFirst); every
// other path is served from the built site. Each message is checked
// (Turnstile, field limits) and emailed to Neama through the EMAIL binding,
// which can only send to her verified address.

const LIMITS = { name: 200, email: 254, type: 100, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// One line, no control characters: these values go into the subject and headers.
const oneLine = (value) => String(value ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim();

export function validate(body) {
  const name = oneLine(body?.name);
  const email = oneLine(body?.email);
  const type = oneLine(body?.type);
  const message = String(body?.message ?? '').trim();
  if (!name || !email || !message) return { error: 'missing_fields' };
  if (!EMAIL_RE.test(email)) return { error: 'bad_email' };
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    type.length > LIMITS.type ||
    message.length > LIMITS.message
  ) {
    return { error: 'too_long' };
  }
  return { name, email, type, message };
}

async function humanCheck(token, ip, secret) {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const outcome = await res.json();
  return outcome.success === true;
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname !== '/api/contact') return json(404, { error: 'not_found' });
    if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' });

    let body;
    try {
      body = await request.json();
    } catch {
      return json(400, { error: 'bad_json' });
    }

    const fields = validate(body);
    if (fields.error) return json(400, fields);

    const token = typeof body.token === 'string' ? body.token : '';
    if (!token || !(await humanCheck(token, request.headers.get('CF-Connecting-IP'), env.TURNSTILE_SECRET))) {
      return json(403, { error: 'failed_check' });
    }

    const { name, email, type, message } = fields;
    try {
      await env.EMAIL.send({
        to: env.CONTACT_TO,
        from: { email: 'contact@neama.design', name: 'neama.design' },
        replyTo: { email, name },
        subject: `Website message from ${name}${type ? ` (${type})` : ''}`,
        text: `${message}\n\n—\nFrom: ${name} <${email}>\nProject type: ${type || 'not chosen'}\nSent from the contact form on neama.design`,
      });
    } catch (e) {
      console.log('send failed', e?.code, e?.message);
      return json(502, { error: 'send_failed' });
    }
    return json(200, { ok: true });
  },
};
