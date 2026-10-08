// Measures the page the viewer is looking at, for the expert scan: how
// much text each section carries, whether each image is sharp enough for
// the size it is shown at, whether it is cropped, and where type is too
// small. Every measured element gets a data-audit-id so findings can
// point back at it.

import { EXPERT_KNOWLEDGE } from './expertKnowledge.js';

const words = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);
const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

function sectionOf(el, headings) {
  let current = 'Page top';
  for (const h of headings) {
    // eslint-disable-next-line no-bitwise
    if (h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) current = h.textContent.trim();
    else break;
  }
  return current;
}

export function collectAudit() {
  const root = document.querySelector('article') || document.querySelector('main') || document.body;
  const vh = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  const headings = [...root.querySelectorAll('h1, h2')];

  const sections = headings.map((h, i) => {
    const box = h.closest('section') || h.parentElement?.parentElement || h;
    const id = `s${i + 1}`;
    box.setAttribute('data-audit-id', id);
    const paragraphs = [...box.querySelectorAll('p')].map((p) => words(p.textContent));
    return {
      id,
      heading: h.textContent.trim(),
      level: h.tagName,
      words: words(box.innerText || ''),
      longestParagraphWords: paragraphs.length ? Math.max(...paragraphs) : 0,
      heightInScreens: round(box.offsetHeight / vh, 1),
    };
  });

  const media = [...root.querySelectorAll('img, video, [class*="placeholder"]')]
    .filter((el) => el.offsetWidth > 40 && el.offsetHeight > 40)
    .map((el, i) => {
      const id = `m${i + 1}`;
      el.setAttribute('data-audit-id', id);
      const shownW = el.offsetWidth;
      const shownH = el.offsetHeight;
      const base = { id, section: sectionOf(el, headings), shownPx: `${shownW}×${shownH}` };
      if (el.tagName !== 'IMG' && el.tagName !== 'VIDEO') {
        return { ...base, kind: 'placeholder (missing media)', note: el.innerText.replace(/\s+/g, ' ').trim() };
      }
      const natW = el.naturalWidth || el.videoWidth || 0;
      const natH = el.naturalHeight || el.videoHeight || 0;
      const fit = getComputedStyle(el).objectFit;
      const boxRatio = shownW / shownH;
      const natRatio = natW && natH ? natW / natH : boxRatio;
      const cropped = fit === 'cover' ? 1 - Math.min(boxRatio / natRatio, natRatio / boxRatio) : 0;
      // With object-fit: contain the picture is drawn smaller than its box.
      const drawnW = fit === 'contain' && natW ? Math.min(shownW, (shownH * natW) / natH) : shownW;
      return {
        ...base,
        kind: el.tagName === 'VIDEO' ? 'video' : 'image',
        alt: el.getAttribute('alt') || '',
        sourcePx: natW ? `${natW}×${natH}` : 'not loaded',
        // Below 1 the image is stretched past its own pixels on this screen.
        sharpness: natW ? round(natW / (drawnW * dpr)) : null,
        croppedPercent: Math.round(cropped * 100),
        fullBleed: shownW >= window.innerWidth - 2,
      };
    });

  const smallText = [];
  for (const el of root.querySelectorAll('p, span, a, dt, dd, h3, figcaption, li')) {
    if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size < 13 && el.offsetWidth > 0) smallText.push(`${round(size, 1)}px: "${el.textContent.trim().slice(0, 40)}"`);
  }

  return {
    page: document.querySelector('h1')?.textContent.trim() || document.title,
    viewport: `${window.innerWidth}×${vh} @${dpr}x`,
    pageHeightInScreens: round(document.documentElement.scrollHeight / vh, 1),
    totalWords: words(root.innerText || ''),
    sections,
    media,
    smallText: smallText.slice(0, 25),
    smallTextCount: smallText.length,
  };
}

// The largest images on the page, drawn small, so the expert can judge
// them by eye as well as by numbers.
export async function largestImages(max) {
  const imgs = [...document.querySelectorAll('img[data-audit-id]')]
    .filter((img) => img.complete && img.naturalWidth)
    .sort((a, b) => b.offsetWidth * b.offsetHeight - a.offsetWidth * a.offsetHeight)
    .slice(0, max);
  const blobs = [];
  for (const img of imgs) {
    const scale = Math.min(1, 1200 / img.naturalWidth);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    // eslint-disable-next-line no-await-in-loop
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    if (blob) blobs.push({ id: img.getAttribute('data-audit-id'), blob });
  }
  return blobs;
}

export function expertPrompt(audit, imageIds) {
  return `You are a senior web designer with 30 years of experience building portfolio and studio websites. You are reviewing one page of the design portfolio of Neama Klein, a third-year multidisciplinary design student (branding, graphic, UX/UI, spatial) who wants to be hired by a branding studio. Be critical and demanding — the goal is the best possible result, so do not soften problems — but stay specific and fair, and say what genuinely works.

The site's direction, already decided by Neama: an Apple-like system (one type family, large tight headlines, quiet grey bands, scroll reveals), with her purple and the "shipping/dispatch" language used only in a few moments. Judge execution against that direction; do not ask her to change the direction itself. The written copy comes from her Figma and is final in wording: you may say a section has too much text or should be shortened or moved, but do not rewrite her copy.

Judge by this reference library (design skills and web research). Ground every finding in it and name the source in "basis" — e.g. "Taste", "Apple HIG › typography", "WCAG 1.4.3", "web.dev images", "Creative Boom 2026", "The Brand Identity", "Neama's standards":
${EXPERT_KNOWLEDGE}

Measurements of the page as the viewer sees it now (sharpness = source pixels ÷ shown pixels on this screen; below 1.0 means visibly soft, below 0.75 clearly blurry; croppedPercent = share of the image cut off by the frame; placeholder = media not supplied yet):
${JSON.stringify(audit)}
${imageIds.length ? `\nAttached, in order, are the page's largest images: ${imageIds.join(', ')}. Judge their quality by eye too (blur, compression, watermarks, framing).` : ''}

Check: too much or too little text and where; images that are cropped, blurry or low quality; sizes that should change (too big, too small, inconsistent); hierarchy, rhythm and spacing; what is missing for a recruiter at a branding studio (context, role, process, results, credits, contact, next project). Point every finding at the most specific target id you can (a section id like "s3", a media id like "m7", or "page").

Write all text in Hebrew. Reply with only a JSON object of this shape:
{"score": <1-10>, "verdict": "<2-3 sentences>", "works": ["<what works>", ...], "findings": [{"target": "<id or page>", "severity": "critical|high|medium|low", "area": "text|images|sizes|layout|typography|missing|flow", "issue": "<what is wrong, with numbers when you have them>", "fix": "<the concrete change>", "basis": "<source from the library>"}]}
Order findings from most to least severe; at most 12.`;
}

// A compact version of the measurements (under the 4 KB comment limit)
// for the deep scan, which is sent as a comment to the Claude Code
// session where the full design skills and web research are available.
export function deepScanRequest(audit) {
  const issues = audit.media
    .filter(
      (m) => m.kind.startsWith('placeholder') || (m.sharpness !== null && m.sharpness < 1) || m.croppedPercent > 5,
    )
    .map(
      (m) =>
        `${m.id} ${m.section}: ${m.kind}${m.sharpness !== undefined && m.sharpness !== null ? ` sharp ${m.sharpness}` : ''}${m.croppedPercent ? ` crop ${m.croppedPercent}%` : ''}`,
    );
  const lines = [
    'Deep expert scan request (סריקת עומק)',
    `Page: ${audit.page} · ${audit.viewport} · ${audit.pageHeightInScreens} screens · ${audit.totalWords} words`,
    `Sections: ${audit.sections.map((s) => `${s.id} ${s.heading} (${s.words}w, ${s.heightInScreens} screens)`).join(' | ')}`,
    `Media issues: ${issues.length ? issues.join(' | ') : 'none measured'}`,
    `Text under 13px: ${audit.smallTextCount}`,
  ];
  let text = lines.join('\n');
  while (new TextEncoder().encode(text).length > 3900) text = text.slice(0, -200);
  return text;
}
