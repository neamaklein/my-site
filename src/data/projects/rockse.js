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
  dispatchNumber: '02',
  category: 'PACKAGING',

  hero: {
    media: { kind: 'image', note: 'Rocksé carton on a bar counter', src: heroBar },
    scrollLabel: 'SCROLL_TO_UNBOX',
  },

  title: {
    tag: 'TYPOGRAPHY_COURSE · BY NEAMA KLEIN',
    name: 'Rocksé',
    tagline: 'men’s wine',
  },

  // TODO(Neama): Year and Role aren't in the deck — add them if you want
  // the same 4-column meta row as DIMENSO.
  meta: [
    { label: 'Course', value: 'ADVANCED TYPOGRAPHY' },
    { label: 'Category', value: 'PACKAGING' },
  ],

  strategy: {
    slip: 'PACKING_SLIP_001',
    heading: 'Strategy',
    paragraphs: [
      { lead: 'Rocksé', text: " is a bold, direct, raw, and intelligent brand. It doesn't try to please everyone, instead, it targets an audience that appreciates underground culture aesthetics - rock, tattoos, and grunge - and seeks material authenticity over a beautified product." },
      'The project was developed as part of an advanced typography course, where each participant was required to select a beverage and adapt its packaging to a mandatory milk carton format. I chose rosé wine a product traditionally marketed with a delicate, feminine, and romantic stigma.',
      "The category's rigid visual conventions inspired me to shake up the market: instead of the predictable pastel pink palettes and elegant bottles, I chose to strip the product of its automated shell. I pushed the brand to the absolute opposite end of the spectrum, reimagining rosé for men who embrace the raw, rugged aesthetics of rock, tattoos, and underground culture.",
      'The branding language is bridged by a single, powerful element: the rose. As a symbol that seamlessly coexists in both delicate floral design and bold rock-and-roll culture, it became the conceptual anchor of the identity, linking a traditionally "soft" drink to a masculine edge. The custom Hebrew lettering, built from scratch in a sharp, heavy Blackletter style, defines the brand\'s defiant tone, while the dark, grunge-textured color palette reflects the raw energy of a rock club, directly appealing to a bold, unconventional male audience.',
    ],
  },

  brandBook: {
    slip: 'PACKING_SLIP_002',
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

  galleries: [
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Brand Assets',
      layout: 'feature',
      media: [{ kind: 'image', note: 'stickers, picks and tin', src: stickers }],
    },
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Dieline',
      columns: 2,
      media: [
        { kind: 'image', note: 'dieline — Dirty Rose', src: dielineRose },
        { kind: 'image', note: 'dieline — Black Ink', src: dielineBlack },
      ],
    },
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Product',
      layout: 'stack',
      ratio: '16 / 9',
      media: [
        { kind: 'image', note: 'both cartons at the bar', src: productDuo },
        { kind: 'image', note: 'carton in hand', src: productHand },
        { kind: 'image', note: 'pouring', src: productPour },
      ],
    },
  ],

  footer: {
    label: 'END_OF_DISPATCH № 02',
    returnLabel: '← Return to Terminal',
  },
};
