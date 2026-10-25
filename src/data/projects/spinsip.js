// Content transcribed verbatim from Neama's "Spin_Sip" Figma Slides deck
// (Mgrhc3iyHpGrHn7vX47SKj), mapped onto the DIMENSO case-study template.
// Images are the full-quality originals from Neama's SPIN SIP folder,
// compressed for web. Slide 2 (blank in the export) is left out, per
// Neama; only what the deck shows is here.
//
// The menu on a clipboard is Neama's own upload (Instagram post 16).
//
// Not from the deck (structural labels only — rename freely):
//   meta labels/values, gallery headings "Posters" / "In Use".

import quicksand from '../../assets/spinsip/font-quicksand.svg';
import logo from '../../assets/spinsip/logo.mp4';
import hero from '../../assets/spinsip/hero.jpg';
import useMenu from '../../assets/spinsip/use/01-menu.jpg';
import useDrink from '../../assets/spinsip/use/02-drink.jpg';
import useBoxes from '../../assets/spinsip/use/03-boxes.jpg';

const posters = import.meta.glob('../../assets/spinsip/posters/*.png', { eager: true, import: 'default' });
const icons = import.meta.glob('../../assets/spinsip/icons/*.svg', { eager: true, import: 'default' });

// Files are numbered in deck order, so sorting the paths keeps that order.
const inOrder = (files) =>
  Object.keys(files)
    .sort()
    .map((path) => files[path]);

const images = (files, notes) =>
  inOrder(files).map((src, index) => ({ kind: 'image', src, note: notes?.[index] ?? '' }));

export const spinsip = {
  slug: 'spin-sip',
  dispatchNumber: '04',
  category: 'BRANDING',

  hero: {
    // Neama's pick (her upload): Instagram post - 9.
    media: { kind: 'image', note: 'Spin Sip stand at the Tel Aviv Velodrome', src: hero },
    scrollLabel: 'SCROLL_TO_UNBOX',
  },

  title: {
    tag: 'BRANDING_COURSE · BY NEAMA KLEIN',
    name: 'Spin Sip',
    tagline: 'Branding & Spatial Food Experience for the Tel Aviv Velodrome.',
  },

  meta: [
    { label: 'Course', value: 'Branding' },
    { label: 'Category', value: 'Branding & spatial' },
  ],

  strategy: {
    heading: 'Strategy',
    paragraphs: [
      'The brief was to develop a complete visual language for a food stand located inside the Tel Aviv Velodrome, based on research of the space, its atmosphere, and the movement culture surrounding it. The challenge was to translate the feeling of speed, flow, energy, and continuous motion into a branded culinary experience.',
      {
        lead: 'Spin Sip',
        text: ' is a fast-paced pit stop for light bites and quick drinks, designed for people constantly in motion. Inspired by the endless looping movement of the velodrome track, the project transforms a short stop into a moment of recharge - quick fuel, minimal pause, and immediate return to motion.',
      },
      'The identity system combines dynamic forms, flowing lines, bold typography, and a streamlined spatial experience that reflects the rhythm and intensity of movement.',
    ],
  },

  brandBook: {
    heading: 'Graphic Index',
    // Per Neama: the logo animation (Comp 1_2), filling its card.
    logoSrc: logo,
    logoKind: 'video',
    logoFill: true,
    // Per Neama: the logo and colour cards side by side, two columns.
    pairLogoColors: true,
    // Per Neama: each icon on its own, wrapping to fit the card.
    iconSet: inOrder(icons).map((src, index) => ({
      src,
      name: ['donut', 'drink', 'stack', 'pancakes', 'burger'][index],
    })),
    primaryColors: [
      { name: 'midnight motion', hex: '#1B2352' },
      { name: 'teal energy', hex: '#31BBAC' },
      { name: 'orange boost', hex: '#F27121' },
      { name: 'pit stop beige', hex: '#FFECCC' },
    ],
    fonts: [{ name: 'Quicksand', specimen: quicksand }, { name: 'Pauza' }],
  },

  galleries: [
    {
      heading: 'Posters',
      columns: 3,
      // Per Neama: round corners.
      rounded: true,
      media: images(posters, ['Bite.Boost.Go', 'Fuel.the.Next.Lap', 'Light.Fast.Efficient.']),
    },
    {
      heading: 'In Use',
      // Per Neama: one large, two under it. The menu is her upload.
      layout: 'lead',
      columns: 2,
      media: [
        { kind: 'image', note: 'BOOST boxes on the counter', src: useBoxes },
        { kind: 'image', note: 'menu on a clipboard', src: useMenu },
        { kind: 'image', note: 'a drink at the stand', src: useDrink },
      ],
    },
  ],

  footer: {
    label: 'END_OF_DISPATCH № 04',
    returnLabel: '← Return to Terminal',
  },
};
