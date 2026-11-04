// Content transcribed verbatim from the "PALATE" Figma Slides deck
// (Neama Klein & Amit Tal), mapped onto the DIMENSO case-study template.
// The deck's opening Pantone research (slides 1–15), the brand's Values
// and Target slides and the Golden Slide are left out on purpose, per
// Neama: the target audience goes into the project description instead.
// Section headings are the deck's own navigation labels.
// Images are crops of the deck's slides, compressed for web — swap for
// the full-resolution originals when available. The deck's videos (hero,
// app screen recordings) can't be exported from Slides, so stills stand in.
//
// Not from the deck (structural labels only — rename freely):
//   meta labels/values, the title tag wording.
// Credits: Neama's name always comes first wherever a collaborator is named.

import hero from '../../assets/palate/hero.mp4';
import logo from '../../assets/palate/logo.png';
import element from '../../assets/palate/element.png';
import capsules from '../../assets/palate/capsules.webp';
import cubeDf from '../../assets/palate/cube-df.webp';

const merch = import.meta.glob('../../assets/palate/merch/*.jpg', { eager: true, import: 'default' });
const coming = import.meta.glob('../../assets/palate/coming/*.jpg', { eager: true, import: 'default' });
const guerrilla = import.meta.glob('../../assets/palate/guerrilla/*.jpg', { eager: true, import: 'default' });
const plans = import.meta.glob('../../assets/palate/plans/*.jpg', { eager: true, import: 'default' });
const renders = import.meta.glob('../../assets/palate/renders/*.jpg', { eager: true, import: 'default' });
const strip = import.meta.glob('../../assets/palate/strip/*.jpg', { eager: true, import: 'default' });

// Files are numbered in deck order, so sorting the paths keeps that order.
const inOrder = (files) =>
  Object.keys(files)
    .sort()
    .map((path) => files[path]);

const images = (files, notes) =>
  inOrder(files).map((src, index) => ({ kind: 'image', src, note: notes?.[index] ?? '' }));

const PLAN_CAPTIONS = [
  { caption: 'Ground Floor Plan', scale: '1:50' },
  { caption: 'Gallery Floor Plan', scale: '1:50' },
  { caption: 'Perspective Section 1-1' },
  { caption: 'Perspective Section 2-2' },
  { caption: 'Isometric View' },
];

const [merchCarrier, merchCups, merchJars] = images(merch, ['Take your Palate carrier', 'cups', 'jars']);

export const palate = {
  slug: 'palate',
  dispatchNumber: '03',
  category: 'SPATIAL_BRANDING',

  hero: {
    // Her upload: the final video (L2T_T2), on a loop.
    media: { kind: 'video', note: 'PALATE pavilion — the final video', src: hero },
    scrollLabel: 'SCROLL_TO_UNBOX',
  },

  title: {
    tag: 'L2T_COURSE · NEAMA KLEIN & AMIT TAL',
    name: 'PALATE',
    tagline: 'A juice brand where every flavor is a color code.',
  },

  meta: [
    { label: 'Origin', value: 'L2T course' },
    { label: 'Year', value: '2026' },
    { label: 'Category', value: 'Spatial branding' },
    { label: 'Team', value: 'Neama Klein · Amit Tal' },
  ],

  strategy: {
    heading: 'Strategy',
    paragraphs: [
      {
        lead: 'PALATE',
        text: ' is a Pantone sub-brand of juices and smoothies where every flavor is a shade with its own Pantone code. Dragon Fruit is 18-2043.',
      },
      'Each bottle is built like a lab sample, with a periodic-table symbol (Df, Or, Kw), a hex code, and a foil seal. Saturate your senses: in color and in flavor.',
    ],
  },
  // Per Neama: the meta labels in the mono.
  metaMonoLabels: true,

  brandBook: {
    heading: 'Graphic Index',
    labels: { colors: 'Color Palette', fonts: 'Font' },
    logoSrc: logo,
    elementSrc: element,
    primaryColors: [{ hex: '#000000' }, { hex: '#FF007F' }, { hex: '#FF8C00' }, { hex: '#8EE53F' }, { hex: '#FFFFFF' }],
    fonts: [{ name: 'Helvetica Neue' }],
  },

  // Per Neama: the cups open the page, and the capsules (a transparent
  // cut-out) slide up over them as you scroll; the band takes the cups
  // photo's backdrop color so the square reads edge to edge.
  feature: {
    ...merchCups,
    // Per Neama: the capsules at 62% of the band's width, centred.
    over: { kind: 'image', src: capsules, note: 'capsules', size: { width: 62, align: 'center' } },
    background: '#f4f3f1',
  },

  // Depth trial (review copy only, per Neama — not on the live site until
  // she approves): one capsule (cut out of the capsules image) breaking
  // out over the edge between the Graphic Index and Merch sheets.
  depth: { breakout: { src: cubeDf, before: 'Merch' } },

  galleries: [
    {
      heading: 'Merch',
      text: ['Every bottle is a color sample, and the Take Your Palate pack is the lab kit.'],
      // The cups and capsules moved up to open the page (per Neama).
      columns: 2,
      ratio: '1 / 1',
      // Per Neama: the carrier set 5px lower.
      media: [{ ...merchCarrier, offset: { x: 0, y: 5 } }, merchJars],
    },
    {
      heading: 'Coming Soon',
      text: ['The fruit becomes the symbol, and the percentages are the recipe. Launching at Habima Square.'],
      // The billboard leads, large; the two poster frames tight beneath.
      layout: 'lead',
      columns: 2,
      ratio: '1845 / 923',
      media: (([posters, billboard, poster]) => [billboard, posters, poster])(
        images(coming, ['fruit posters', 'billboard', 'Personalize your taste poster']),
      ),
    },
    {
      heading: 'Guerrilla',
      text: ['One more teaser on the street, before the pop-up opens.'],
      // Renders are PALATE's one sticky moment; this scrolls normally.
      layout: 'lead',
      columns: 2,
      ratio: '1845 / 923',
      media: images(guerrilla, ['color-block seating', 'frame installation', 'Instagram']),
    },
    {
      heading: 'Plans',
      text: ['The launch pavilion, planned as an open lab.'],
      // Per Neama: two columns, drawings side by side.
      columns: 2,
      ratio: '1920 / 985',
      // Per Neama: a small English title above each drawing, with its scale.
      media: images(plans, ['ground floor', 'gallery floor', 'section 1-1', 'section 2-2', 'isometric view']).map(
        (item, index) => ({
          ...item,
          ...PLAN_CAPTIONS[index],
          // Per Neama: the isometric view nudged right.
          ...(index === 4 ? { offset: { x: 144, y: 4 } } : {}),
        }),
      ),
    },
    {
      heading: 'Renders',
      text: ['The pavilion in the square.'],
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
