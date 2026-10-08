// Content transcribed verbatim from the "PALATE" Figma Slides deck
// (Neama Klein & Amit Tal), mapped onto the DIMENSO case-study template.
// The deck's opening Pantone research (slides 1–15) and the brand's Values
// and Target slides are left out on purpose, per Neama: the target audience
// goes into the project description instead.
// Section headings are the deck's own navigation labels.
// Images are crops of the deck's slides, compressed for web — swap for
// the full-resolution originals when available. The deck's videos (hero,
// app screen recordings) can't be exported from Slides, so stills stand in.
//
// Not from the deck (structural labels only — rename freely):
//   meta labels/values, the title tag wording.
// Credits: Neama's name always comes first wherever a collaborator is named.

import hero from '../../assets/palate/hero.jpg';
import logo from '../../assets/palate/logo.png';
import element from '../../assets/palate/element.png';
import feature from '../../assets/palate/feature.jpg';

const merch = import.meta.glob('../../assets/palate/merch/*.jpg', { eager: true, import: 'default' });
const coming = import.meta.glob('../../assets/palate/coming/*.jpg', { eager: true, import: 'default' });
const guerrilla = import.meta.glob('../../assets/palate/guerrilla/*.jpg', { eager: true, import: 'default' });
const plans = import.meta.glob('../../assets/palate/plans/*.jpg', { eager: true, import: 'default' });
const renders = import.meta.glob('../../assets/palate/renders/*.jpg', { eager: true, import: 'default' });
const strip = import.meta.glob('../../assets/palate/strip/*.jpg', { eager: true, import: 'default' });

// Files are numbered in deck order, so sorting the paths keeps that order.
const inOrder = (files) => Object.keys(files).sort().map((path) => files[path]);

const images = (files, notes) =>
  inOrder(files).map((src, index) => ({ kind: 'image', src, note: notes?.[index] ?? '' }));

export const palate = {
  slug: 'palate',
  dispatchNumber: '03',
  // Station-sign stripes beside the dispatch number: the project's colors.
  stripes: ['#FF007F', '#FF8C00'],
  category: 'SPATIAL_BRANDING',

  hero: {
    media: { kind: 'image', note: 'PALATE pavilion — still from the final video', src: hero },
    scrollLabel: 'SCROLL_TO_UNBOX',
  },

  title: {
    tag: 'NEW_BRAND · L2T_NEAMA KLEIN_AMIT TAL',
    name: 'PALATE',
    tagline: 'saturate your senses',
  },

  meta: [
    { label: 'Brand', value: 'Pantone' },
    { label: 'Concept', value: 'New brand' },
    { label: 'Team', value: 'Neama Klein · Amit Tal' },
    { label: 'Category', value: 'Spatial branding' },
  ],

  strategy: {
    heading: 'Golden Slide',
    dir: 'rtl',
    lang: 'he',
    paragraphs: ['חוויה קולינרית-טכנולוגית המתרגמת את הדיוק המדעי של שפת הצבע העולמית למבנה פיזי אכיל'],
  },

  brandBook: {
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

  feature: { kind: 'image', note: 'stairway — Saturate your senses', src: feature },

  galleries: [
    {
      heading: 'Merch',
      // The carrier leads, large; the cubes, cups and jars around it.
      layout: 'asym',
      ratio: '1 / 1',
      media: (([df, or, kw, carrier, cups, jars]) => [carrier, df, or, kw, cups, jars])(
        images(merch, ['Df cube', 'Or cube', 'Kw cube', 'Take your Palate carrier', 'cups', 'jars']),
      ),
    },
    {
      heading: 'Coming Soon',
      // The billboard leads, large; the four poster frames tight beneath.
      layout: 'lead',
      columns: 2,
      ratio: '1845 / 923',
      media: (([posters, billboard, ...rest]) => [billboard, posters, ...rest])(
        images(coming, ['fruit posters', 'billboard', 'Personalize your taste poster', 'posters in situ', 'posters on wall']),
      ),
    },
    {
      heading: 'Guerrilla',
      // Renders are PALATE's one sticky moment; this scrolls normally.
      layout: 'lead',
      columns: 2,
      ratio: '1845 / 923',
      media: images(guerrilla, ['color-block seating', 'frame installation', 'Instagram']),
    },
    {
      heading: 'Plans',
      // Per Neama: two columns, drawings side by side.
      columns: 2,
      ratio: '1920 / 985',
      media: images(plans, ['ground floor', 'gallery floor', 'section 1-1', 'section 2-2', 'isometric view']),
    },
    {
      heading: 'Renders',
      // Per Neama: four renders, as large as the page allows.
      layout: 'wide',
      ratio: '1845 / 929',
      media: images(renders, ['entrance', 'Personalize your taste wall', 'pod wall', 'Pick your cup']),
    },
  ],

  // The remaining renders, as DIMENSO's moving strip (per Neama).
  spatialRenders: {
    note: 'More PALATE interior and exterior renders',
    images: inOrder(strip),
  },

  footer: {
    label: 'END_OF_DISPATCH № 03',
    returnLabel: '← Return to Terminal',
  },
};
