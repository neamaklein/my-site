// Content transcribed verbatim from Neama's "Rocksé" Figma Slides deck,
// mapped onto the DIMENSO case-study template. The exhibition slides
// (11–12) are left out on purpose — Neama flagged that part as still in
// progress. Images are Figma exports compressed for web; swap for the
// full-resolution originals when available.
//
// Not from the deck (structural labels only — rename freely):
//   meta labels/values, gallery headings "Brand Assets" / "Dieline" / "Product".

import heroBar from '../../assets/rockse/hero-bar.jpg';
import logo from '../../assets/rockse/logo.png';
import stickers from '../../assets/rockse/stickers.jpg';
import dielineRose from '../../assets/rockse/dieline-rose.jpg';
import dielineBlack from '../../assets/rockse/dieline-black.jpg';
import productDuo from '../../assets/rockse/product-duo.jpg';
import productHand from '../../assets/rockse/product-hand.jpg';
import productPour from '../../assets/rockse/product-pour.jpg';

export const rockse = {
  slug: 'rockse',
  dispatchNumber: '06',
  category: 'PACKAGING',

  hero: {
    // Per Neama: on narrow screens the crop keeps the carton in view.
    media: { kind: 'image', note: 'Rocksé carton on a bar counter', src: heroBar, position: '31% 50%' },
    scrollLabel: 'SCROLL_TO_UNBOX',
  },

  title: {
    tag: 'TYPOGRAPHY_COURSE · NEAMA KLEIN',
    name: 'Rocksé',
    tagline: 'Rosé for men, in a milk carton.',
  },

  // TODO(Neama): Year and Role aren't in the deck — add them if you want
  // the same 4-column meta row as DIMENSO.
  meta: [
    { label: 'Origin', value: 'Advanced Typography course' },
    { label: 'Year', value: '2025' },
    { label: 'Category', value: 'Packaging' },
  ],

  strategy: {
    heading: 'Strategy',
    paragraphs: [
      'In an advanced typography course, each participant chose a beverage and adapted it to a mandatory milk carton format. I chose rosé, a wine usually marketed as delicate, feminine, and romantic.',
      {
        lead: 'Rocksé',
        text: ' goes the other way: bold, direct, and raw. It doesn’t try to please everyone. It speaks to an audience of rock, tattoos, and grunge, who prefer material authenticity over a beautified product.',
      },
    ],
  },

  brandBook: {
    heading: 'Graphic Index',
    logoSrc: logo,
    fonts: [
      { name: 'Anomalia', sample: 'Abc' },
      { name: 'עומס', sample: 'אבג' },
    ],
    primaryColors: [
      // NB: the deck labels this #201C82 (a dark blue), but the swatch itself
      // is this dusty pink — using the swatch's real color. Worth fixing in
      // the deck too.
      { name: 'Dirty Rose', hex: '#B59590' },
      { name: 'Black Ink', hex: '#010101' },
    ],
  },

  feature: { kind: 'image', note: 'both cartons at the bar', src: productDuo },

  galleries: [
    {
      heading: 'Brand Assets',
      text: ['Rough typography and two colors: Dirty Rose and Black Ink.'],
      // Edge to edge: the stickers on black are the page's dark moment.
      layout: 'bleed',
      media: [{ kind: 'image', note: 'stickers, picks and tin', src: stickers }],
    },
    {
      heading: 'Dieline',
      text: ['The milk carton, unfolded.'],
      columns: 2,
      media: [
        { kind: 'image', note: 'dieline — Dirty Rose', src: dielineRose },
        { kind: 'image', note: 'dieline — Black Ink', src: dielineBlack },
      ],
    },
    {
      heading: 'Product',
      text: ['Carton in hand: a rosé that doesn’t apologize.'],
      columns: 2,
      media: [
        { kind: 'image', note: 'carton in hand', src: productHand },
        { kind: 'image', note: 'pouring', src: productPour },
      ],
    },
  ],

  footer: {
    label: 'END_OF_DISPATCH № 06',
    returnLabel: '← Return to Terminal',
  },
};
