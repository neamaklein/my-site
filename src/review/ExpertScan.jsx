import { useEffect, useRef, useState } from 'react';
import { collectAudit, deepScanRequest, expertPrompt, largestImages } from './audit.js';
import styles from './Review.module.css';

// Review-copy only: "Expert scan" asks Claude, as a web designer with 30
// years' experience, for a tough critique of the page being viewed, from
// real measurements (text per section, image sharpness and crop, small
// type) plus the largest images. Each finding can be shown on the page
// and sent on as a comment thread, where Claude picks it up to fix.

const SEVERITY = { critical: 'קריטי', high: 'גבוה', medium: 'בינוני', low: 'נמוך' };
const AREA = {
  text: 'טקסט',
  images: 'תמונות',
  sizes: 'גדלים',
  layout: 'פריסה',
  typography: 'טיפוגרפיה',
  missing: 'חסר',
  flow: 'פלואו',
};

const ERRORS = {
  not_granted: 'הסריקה לא אושרה בעמוד הזה.',
  sampling_disabled: 'Claude לא זמין בחשבון הזה.',
  rate_limited: 'יותר מדי בקשות כרגע. נסי שוב בעוד דקה.',
  session_expired: 'צריך להתחבר מחדש ל-claude.ai.',
  invalid_json: 'התשובה הגיעה בפורמט לא תקין. נסי שוב.',
  refused: 'הבקשה נדחתה. נסי שוב.',
};

function targetEl(target) {
  if (!target || target === 'page') return document.querySelector('h1');
  return document.querySelector(`[data-audit-id="${target}"]`) || document.querySelector('h1');
}

export default function ExpertScan() {
  const [sample, setSample] = useState(null);
  const [comments, setComments] = useState(null);
  const [canSend, setCanSend] = useState('off');
  const [open, setOpen] = useState(false);
  const [state, setState] = useState('idle'); // idle | measuring | thinking | done | error
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState({});
  const [deep, setDeep] = useState('idle'); // idle | sending | sent | failed | consent
  const ctl = useRef(null);

  useEffect(() => {
    if (!window.claude?.use) return;
    let live = true;
    window.claude.use('sample').then((s) => live && setSample(() => s));
    window.claude.use('comments').then(async (c) => {
      if (!live || !c) return;
      setComments(c);
      try {
        setCanSend(await c.canSendToClaude());
      } catch {
        setCanSend('off');
      }
    });
    return () => {
      live = false;
    };
  }, []);

  if (!sample) return null;

  const scan = async () => {
    setOpen(true);
    setReport(null);
    setSent({});
    setMessage('');
    setState('measuring');
    ctl.current = new AbortController();
    try {
      const audit = collectAudit();
      const limits = await sample.limits().catch(() => null);
      const max = Math.min(limits?.images?.maxCount || 0, 5);
      const pics = max ? await largestImages(max) : [];
      setState('thinking');
      const result = await sample.json(
        expertPrompt(
          audit,
          pics.map((p) => p.id),
        ),
        {
          signal: ctl.current.signal,
          cache: false,
          ...(pics.length ? { images: pics.map((p) => p.blob) } : {}),
        },
      );
      if (!result || !Array.isArray(result.findings)) throw { code: 'invalid_json' };
      setReport(result);
      setState('done');
    } catch (e) {
      if (e?.code === 'cancelled') {
        setState('idle');
        return;
      }
      setMessage(ERRORS[e?.code] || 'הסריקה נכשלה. נסי שוב.');
      setState('error');
    }
  };

  const show = (target) => {
    const el = targetEl(target);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add(styles.flash);
    setTimeout(() => el.classList.remove(styles.flash), 2400);
  };

  const send = async (finding, index) => {
    if (!comments) return;
    const el = targetEl(finding.target);
    const text =
      `סריקת מומחה · ${SEVERITY[finding.severity] || finding.severity} · ${AREA[finding.area] || finding.area}\n${finding.issue}\nתיקון: ${finding.fix}${finding.basis ? `\nמקור: ${finding.basis}` : ''}`.slice(
        0,
        4000,
      );
    setSent((s) => ({ ...s, [index]: 'sending' }));
    try {
      const anchor = await comments.anchorFor(el);
      if (canSend === 'available') await comments.sendToClaude({ anchor, text });
      else await comments.create({ anchor, text });
      setSent((s) => ({ ...s, [index]: 'sent' }));
    } catch (e) {
      setSent((s) => ({ ...s, [index]: e?.code === 'consent_required' ? 'consent' : 'failed' }));
    }
  };

  // Deep scan: the measurements go to the Claude Code session as a
  // comment, where the review runs with every design skill and live web
  // research, and the answer comes back in that comment thread.
  const deepScan = async () => {
    if (!comments) return;
    setDeep('sending');
    try {
      const text = deepScanRequest(collectAudit());
      const anchor = await comments.anchorFor(document.querySelector('h1') || document.body);
      await comments.sendToClaude({ anchor, text });
      setDeep('sent');
    } catch (e) {
      setDeep(e?.code === 'consent_required' ? 'consent' : 'failed');
    }
  };

  const sendLabel = canSend === 'available' ? 'שלחי ל-Claude' : 'הוסיפי כתגובה';

  return (
    <>
      <button type="button" onClick={scan} disabled={state === 'measuring' || state === 'thinking'}>
        Expert scan
      </button>
      {comments && canSend === 'available' && (
        <button
          type="button"
          onClick={deepScan}
          disabled={deep === 'sending' || deep === 'sent'}
          title="נשלח ל-Claude Code, עם כל סקילי העיצוב וחיפוש באינטרנט. התשובה מגיעה בשרשור התגובה."
        >
          {deep === 'sent' ? 'Deep scan sent ✓' : deep === 'sending' ? 'Sending…' : 'Deep scan'}
        </button>
      )}
      {deep === 'consent' && <span className={styles.status}>אשרי תגובות מהעמוד ולחצי שוב</span>}
      {deep === 'failed' && <span className={styles.status}>השליחה לא הצליחה, נסי שוב</span>}
      {open && (
        <aside className={styles.panel} dir="rtl" lang="he" aria-label="סריקת מומחה">
          <header className={styles.panelHead}>
            <strong>סריקת מומחה</strong>
            <div className={styles.panelActions}>
              {state === 'thinking' && (
                <button type="button" onClick={() => ctl.current?.abort()}>
                  עצירה
                </button>
              )}
              {(state === 'done' || state === 'error') && (
                <button type="button" onClick={scan}>
                  סריקה חוזרת
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} aria-label="סגירה">
                ✕
              </button>
            </div>
          </header>

          {state === 'measuring' && <p className={styles.panelNote}>מודד את העמוד: טקסט, תמונות, חדות וחיתוך…</p>}
          {state === 'thinking' && (
            <p className={styles.panelNote}>המומחה עובר על העמוד. זה לוקח בדרך כלל חצי דקה עד שתי דקות.</p>
          )}
          {state === 'error' && <p className={styles.panelNote}>{message}</p>}

          {report && (
            <div className={styles.report}>
              <p className={styles.score}>
                <span>{report.score}</span>/10
              </p>
              <p>{report.verdict}</p>
              {report.works?.length > 0 && (
                <>
                  <h3>מה עובד</h3>
                  <ul>
                    {report.works.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </>
              )}
              <h3>ממצאים</h3>
              <ol className={styles.findings}>
                {report.findings.map((f, i) => (
                  <li key={i} className={styles.finding} data-severity={f.severity}>
                    <span className={styles.chip}>
                      {SEVERITY[f.severity] || f.severity} · {AREA[f.area] || f.area}
                    </span>
                    <p>{f.issue}</p>
                    <p className={styles.fix}>תיקון: {f.fix}</p>
                    {f.basis && <p className={styles.basis}>מקור: {f.basis}</p>}
                    <div className={styles.findingActions}>
                      <button type="button" onClick={() => show(f.target)}>
                        הראי בעמוד
                      </button>
                      {comments && (
                        <button
                          type="button"
                          onClick={() => send(f, i)}
                          disabled={sent[i] === 'sending' || sent[i] === 'sent'}
                        >
                          {sent[i] === 'sent' ? 'נשלח ✓' : sent[i] === 'sending' ? 'שולח…' : sendLabel}
                        </button>
                      )}
                    </div>
                    {sent[i] === 'consent' && (
                      <p className={styles.panelNote}>צריך לאשר תגובות מהעמוד, ואז ללחוץ שוב.</p>
                    )}
                    {sent[i] === 'failed' && <p className={styles.panelNote}>השליחה לא הצליחה. נסי שוב.</p>}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </aside>
      )}
    </>
  );
}
