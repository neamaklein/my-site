import { useState } from 'react';
import { describe, FAMILIES, findEl, identify, toHex } from './editing.js';
import styles from './Review.module.css';

// The edit panel: every parameter of the picked element, grouped. Values
// typed here are CSS values ("24px", "50%", "auto", "#ff007f"); an empty
// field goes back to the design. Each field shows the current value in
// grey until it is set.

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const SHADOWS = {
  soft: '0 8px 24px rgba(0, 0, 0, 0.08)',
  medium: '0 16px 40px rgba(0, 0, 0, 0.16)',
  deep: '0 32px 64px rgba(0, 0, 0, 0.28)',
};
const ALIGN_LABELS = { start: 'Left', center: 'Center', end: 'Right' };

function Field({ label, children }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Group({ title, children, open = false }) {
  return (
    <details className={styles.group} open={open}>
      <summary>{title}</summary>
      <div className={styles.groupBody}>{children}</div>
    </details>
  );
}

export default function Inspector({
  selected,
  record,
  computed,
  isMedia,
  hasText,
  canReplace,
  replaced,
  busy,
  edits,
  setCss,
  setOffset,
  restyle,
  resize,
  resetAll,
  select,
  onUpload,
  onRevert,
}) {
  const [collapsed, setCollapsed] = useState(false);
  // The panel sits on the right; it swaps sides when it covers the work.
  const [side, setSide] = useState('right');
  const sideClass = side === 'left' ? styles.inspectorLeft : '';
  const [custom, setCustom] = useState({ prop: '', value: '' });
  const css = record.css || {};
  const font = record.font || {};
  const offset = record.offset || { x: 0, y: 0 };
  const cs = computed || {};

  // A text box for one CSS property.
  const text = (prop, label, placeholder) => (
    <Field label={label}>
      <input
        type="text"
        value={css[prop] ?? ''}
        placeholder={placeholder ?? cs[prop] ?? ''}
        onChange={(event) => setCss(prop, event.target.value)}
      />
    </Field>
  );
  const choice = (prop, label, options) => (
    <Field label={label}>
      <select value={css[prop] ?? ''} onChange={(event) => setCss(prop, event.target.value)}>
        <option value="">As designed ({cs[prop] || '—'})</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  );
  const color = (prop, label) => (
    <Field label={label}>
      <span className={styles.colorRow}>
        <input
          type="color"
          value={css[prop]?.startsWith('#') ? css[prop].slice(0, 7) : toHex(cs[prop])}
          onChange={(event) => setCss(prop, event.target.value)}
        />
        <input
          type="text"
          value={css[prop] ?? ''}
          placeholder={cs[prop] || ''}
          onChange={(event) => setCss(prop, event.target.value)}
        />
      </span>
    </Field>
  );
  const number = (label, value, onChange, unit, placeholder) => (
    <Field label={`${label}${unit ? ` (${unit})` : ''}`}>
      <input
        type="number"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}
      />
    </Field>
  );

  if (collapsed) {
    return (
      <aside className={`${styles.inspector} ${styles.inspectorCollapsed} ${sideClass}`} data-review-ui>
        <button type="button" onClick={() => setCollapsed(false)}>
          Inspector ▸
        </button>
      </aside>
    );
  }

  return (
    <aside className={`${styles.inspector} ${sideClass}`} data-review-ui aria-label="Inspector">
      <header className={styles.inspectorHead}>
        <strong>{selected ? selected.label || selected.key : 'Inspector'}</strong>
        <span className={styles.segmented}>
          <button
            type="button"
            onClick={() => setSide((s) => (s === 'left' ? 'right' : 'left'))}
            aria-label="Move the panel to the other side"
          >
            ⇄
          </button>
          <button type="button" onClick={() => setCollapsed(true)} aria-label="Collapse">
            –
          </button>
        </span>
      </header>

      {!selected && (
        <div className={styles.groupBody}>
          <p className={styles.hint}>
            Click anything on the page: background, container, logo, text, image. Drag it or use the arrow keys (Shift:
            10px) to move it. Esc deselects; the breadcrumb picks the element around it.
          </p>
          {edits.length > 0 && (
            <>
              <p className={styles.hint}>Edited on this page:</p>
              <ul className={styles.editList}>
                {edits.map((e) => (
                  <li key={e.key}>
                    <button type="button" onClick={() => select(e)} disabled={!e.found}>
                      {e.label}
                    </button>
                    <button type="button" onClick={() => resetAll(e)} aria-label={`Reset ${e.label}`}>
                      Reset
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {selected && (
        <>
          <nav className={styles.crumbs} aria-label="Pick the element around it">
            {(() => {
              const el = findEl(selected);
              const chain = [];
              let node = el?.parentElement;
              while (node && node.id !== 'root' && chain.length < 5) {
                chain.unshift(node);
                node = node.parentElement;
              }
              return chain.map((n, i) => (
                <button type="button" key={i} onClick={() => select(identify(n))}>
                  {describe(n).split(' ')[0]}
                </button>
              ));
            })()}
          </nav>

          <Group title="Position" open>
            <div className={styles.pair}>
              {number('X', offset.x, (v) => setOffset(Number(v) || 0, offset.y), 'px')}
              {number('Y', offset.y, (v) => setOffset(offset.x, Number(v) || 0), 'px')}
            </div>
            <div className={styles.pair}>
              {number(
                'Rotate',
                css.rotate ? parseFloat(css.rotate) : '',
                (v) => setCss('rotate', v === '' ? '' : `${v}deg`),
                '°',
                '0',
              )}
              {number(
                'Scale',
                css.scale ? Math.round(parseFloat(css.scale) * 100) : '',
                (v) => setCss('scale', v === '' ? '' : String(v / 100)),
                '%',
                '100',
              )}
            </div>
            <div className={styles.pair}>
              {number(
                'Layer',
                css['z-index'] ?? '',
                (v) => setCss('z-index', v === '' ? '' : String(v)),
                '',
                cs['z-index'],
              )}
              {number(
                'Opacity',
                css.opacity !== undefined ? Math.round(parseFloat(css.opacity) * 100) : '',
                (v) => setCss('opacity', v === '' ? '' : String(v / 100)),
                '%',
                '100',
              )}
            </div>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={css.display === 'none'}
                onChange={(event) => setCss('display', event.target.checked ? 'none' : '')}
              />
              Hide
            </label>
          </Group>

          <Group title="Size & spacing">
            <div className={styles.pair}>
              {text('width', 'Width')}
              {text('height', 'Height')}
            </div>
            <div className={styles.pair}>
              {text('max-width', 'Max width')}
              {text('min-height', 'Min height')}
            </div>
            {text('padding', 'Padding')}
            {text('margin', 'Margin')}
            {text('gap', 'Gap')}
          </Group>

          <Group title="Layout">
            {choice('display', 'Display', ['block', 'inline-block', 'flex', 'inline-flex', 'grid', 'none'])}
            {choice('flex-direction', 'Direction', ['row', 'column', 'row-reverse', 'column-reverse'])}
            {choice('justify-content', 'Justify', ['start', 'center', 'end', 'space-between', 'space-around'])}
            {choice('align-items', 'Align', ['start', 'center', 'end', 'stretch', 'baseline'])}
            {text('grid-template-columns', 'Grid columns', cs['grid-template-columns'] || 'e.g. repeat(2, 1fr)')}
            {choice('position', 'Position', ['static', 'relative', 'absolute', 'sticky'])}
            {choice('overflow', 'Overflow', ['visible', 'hidden', 'auto'])}
          </Group>

          {hasText && (
            <Group title="Text" open={selected.kind === 'text'}>
              <Field label="Font">
                <select value={font.family || ''} onChange={(event) => restyle({ family: event.target.value })}>
                  <option value="">As designed</option>
                  {Object.entries(FAMILIES).map(([id, f]) => (
                    <option key={id} value={id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </Field>
              <div className={styles.pair}>
                {number(
                  'Size',
                  font.size ?? '',
                  (v) => restyle({ size: v || undefined }),
                  'px',
                  String(Math.round(parseFloat(cs['font-size']) || 0)),
                )}
                <Field label="Weight">
                  <select
                    value={font.weight || ''}
                    onChange={(event) => restyle({ weight: Number(event.target.value) || undefined })}
                  >
                    <option value="">As designed ({cs['font-weight']})</option>
                    {WEIGHTS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className={styles.pair}>
                {text('line-height', 'Line height')}
                {text('letter-spacing', 'Letter spacing')}
              </div>
              {color('color', 'Color')}
              {choice('text-align', 'Align', ['left', 'center', 'right', 'justify'])}
              {choice('text-transform', 'Case', ['none', 'uppercase', 'lowercase', 'capitalize'])}
              {choice('text-decoration-line', 'Decoration', ['none', 'underline', 'line-through'])}
              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={Boolean(font.italic)}
                  onChange={(event) => restyle({ italic: event.target.checked })}
                />
                Italic
              </label>
            </Group>
          )}

          <Group title="Fill & border">
            {color('background-color', 'Background')}
            {text('background', 'Background (any CSS)', 'e.g. linear-gradient(…)')}
            {text('border-radius', 'Radius')}
            {text('border', 'Border', 'e.g. 1px solid #1d1d1f')}
            <Field label="Shadow">
              <select
                value={
                  Object.entries(SHADOWS).find(([, v]) => v === css['box-shadow'])?.[0] ||
                  (css['box-shadow'] ? 'custom' : '')
                }
                onChange={(event) =>
                  setCss('box-shadow', event.target.value === 'none' ? 'none' : SHADOWS[event.target.value] || '')
                }
              >
                <option value="">As designed</option>
                <option value="none">none</option>
                {Object.keys(SHADOWS).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
                {css['box-shadow'] && !Object.values(SHADOWS).includes(css['box-shadow']) && (
                  <option value="custom">custom</option>
                )}
              </select>
            </Field>
            {choice('mix-blend-mode', 'Blend', ['normal', 'multiply', 'screen', 'overlay', 'difference'])}
            {text('filter', 'Filter', 'e.g. blur(4px) grayscale(1)')}
          </Group>

          {isMedia && (
            <Group title="Media" open={selected.kind === 'media'}>
              {selected.kind === 'media' && (
                <>
                  <Field label={`Size in its slot (${record.size?.width || 100}%)`}>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={record.size?.width || 100}
                      onChange={(event) => resize({ width: Number(event.target.value) })}
                    />
                  </Field>
                  <div className={styles.segmented}>
                    {Object.entries(ALIGN_LABELS).map(([align, label]) => (
                      <button
                        type="button"
                        key={align}
                        aria-pressed={(record.size?.align || 'center') === align}
                        disabled={(record.size?.width || 100) >= 100}
                        onClick={() => resize({ align })}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {choice('object-fit', 'Fit', ['contain', 'cover', 'fill', 'none'])}
              {text('object-position', 'Focus', 'e.g. 50% 30%')}
              {canReplace && (
                <div className={styles.segmented}>
                  <button type="button" disabled={busy} onClick={onUpload}>
                    Upload replacement
                  </button>
                  {replaced && (
                    <button type="button" disabled={busy} onClick={onRevert}>
                      Restore original
                    </button>
                  )}
                </div>
              )}
            </Group>
          )}

          <Group title="Any CSS property">
            <ul className={styles.editList}>
              {Object.entries(css).map(([prop, value]) => (
                <li key={prop}>
                  <code>
                    {prop}: {value}
                  </code>
                  <button type="button" onClick={() => setCss(prop, '')} aria-label={`Remove ${prop}`}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <form
              className={styles.pair}
              onSubmit={(event) => {
                event.preventDefault();
                const prop = custom.prop.trim().replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
                if (prop) setCss(prop, custom.value.trim());
                setCustom({ prop: '', value: '' });
              }}
            >
              <input
                type="text"
                placeholder="property"
                value={custom.prop}
                onChange={(event) => setCustom((c) => ({ ...c, prop: event.target.value }))}
              />
              <input
                type="text"
                placeholder="value ↵"
                value={custom.value}
                onChange={(event) => setCustom((c) => ({ ...c, value: event.target.value }))}
              />
              <button type="submit" hidden>
                Add
              </button>
            </form>
          </Group>

          <div className={styles.inspectorFoot}>
            <button type="button" onClick={() => resetAll(selected)}>
              Reset element
            </button>
            <button type="button" onClick={() => select(null)}>
              Deselect
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
