// Content transcribed verbatim from the "PALATE" Figma Slides deck
// (Amit Tal & Neama Klein), mapped onto the DIMENSO case-study template.
// The deck's opening Pantone research (slides 1–15) is left out on purpose,
// per Neama; the page starts from the new brand ("Golden Slide").
// Section headings are the deck's own navigation labels.
// Images are crops of the deck's slides, compressed for web — swap for
// the full-resolution originals when available. The deck's videos (hero,
// app screen recordings) can't be exported from Slides, so stills stand in.
//
// Not from the deck (structural labels only — rename freely):
//   meta labels/values, the title tag wording.

import hero from '../../assets/palate/hero.jpg';
import logo from '../../assets/palate/logo.png';
import element from '../../assets/palate/element.png';

const values = import.meta.glob('../../assets/palate/values/*.jpg', { eager: true, import: 'default' });
const target = import.meta.glob('../../assets/palate/target/*.jpg', { eager: true, import: 'default' });
const merch = import.meta.glob('../../assets/palate/merch/*.jpg', { eager: true, import: 'default' });
const coming = import.meta.glob('../../assets/palate/coming/*.jpg', { eager: true, import: 'default' });
const guerrilla = import.meta.glob('../../assets/palate/guerrilla/*.jpg', { eager: true, import: 'default' });
const plans = import.meta.glob('../../assets/palate/plans/*.jpg', { eager: true, import: 'default' });
const renders = import.meta.glob('../../assets/palate/renders/*.jpg', { eager: true, import: 'default' });

// Files are numbered in deck order, so sorting the paths keeps that order.
const inOrder = (files) => Object.keys(files).sort().map((path) => files[path]);

const images = (files, notes) =>
  inOrder(files).map((src, index) => ({ kind: 'image', src, note: notes?.[index] ?? '' }));

export const palate = {
  slug: 'palate',
  dispatchNumber: '03',
  category: 'SPATIAL_BRANDING',

  hero: {
    media: { kind: 'image', note: 'PALATE pavilion — still from the final video', src: hero },
    scrollLabel: 'SCROLL_TO_UNBOX',
  },

  title: {
    tag: 'NEW_BRAND · L2T_AMIT TAL_NEAMA KLEIN',
    name: 'PALATE',
    tagline: 'saturate your senses',
  },

  meta: [
    { label: 'Brand', value: 'PANTONE' },
    { label: 'Concept', value: 'NEW BRAND' },
    { label: 'Team', value: 'AMIT TAL · NEAMA KLEIN' },
    { label: 'Category', value: 'SPATIAL_BRANDING' },
  ],

  strategy: {
    slip: 'PACKING_SLIP_001',
    heading: 'Golden Slide',
    dir: 'rtl',
    lang: 'he',
    paragraphs: ['חוויה קולינרית-טכנולוגית המתרגמת את הדיוק המדעי של שפת הצבע העולמית למבנה פיזי אכיל'],
  },

  brandBook: {
    slip: 'PACKING_SLIP_002',
    heading: 'Graphic Index',
    labels: { colors: 'Color Palette', fonts: 'Font' },
    logoSrc: logo,
    elementSrc: element,
    primaryColors: [
      { hex: '#000000' },
      { hex: '#FF007F' },
      { hex: '#FF8C00' },
      { hex: '#8EE53F' },
      { hex: '#FFFFFF' },
    ],
    fonts: [{ name: 'Helvetica Neue' }],
  },

  galleries: [
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Values',
      columns: 5,
      media: images(values, ['Precision', 'Innovation', 'Personalization', 'Sensory', 'Essence']),
    },
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Target',
      columns: 4,
      media: images(target, ['Maya', 'Michael', 'Lian', 'Ido']),
    },
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Merch',
      columns: 3,
      ratio: '1 / 1',
      media: images(merch, ['Df cube', 'Or cube', 'Kw cube', 'Take your Palate carrier', 'cups', 'jars']),
    },
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Coming Soon',
      layout: 'stack',
      ratio: '1845 / 923',
      media: images(coming, ['fruit posters', 'billboard', 'Personalize your taste poster', 'posters in situ', 'posters on wall']),
    },
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Guerrilla',
      layout: 'stack',
      ratio: '1845 / 923',
      media: images(guerrilla, ['color-block seating', 'frame installation', 'Instagram']),
    },
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Plans',
      layout: 'stack',
      ratio: '1920 / 985',
      media: images(plans, ['ground floor', 'gallery floor', 'section 1-1', 'section 2-2', 'isometric view']),
    },
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Renders',
      layout: 'stack',
      ratio: '1845 / 929',
      media: images(renders).map((item, index) => (index === 0 ? { ...item, note: 'app screens', ratio: '1845 / 923' } : { ...item, note: `render ${index}` })),
    },
  ],

  footer: {
    label: 'END_OF_DISPATCH № 03',
    returnLabel: '← Return to Terminal',
  },
};
