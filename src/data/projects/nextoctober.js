// Content transcribed verbatim from the "NEXT_OCTOBER" Figma Slides deck
// (KbvWiqqfUhfcUUYF0Xtq9U, Neama Klein & Amit Tal), mapped onto the
// DIMENSO case-study template. Images are the full-quality originals from
// Neama's "next october" folder, compressed for web; only what the deck
// shows is here. Slide 2 (blank in the export) is left out. Slides 7–11
// repeat one paragraph beside five merch photos: the text goes into the
// story once, the photos into Merch.
//
// Not from the deck (structural labels only — rename freely):
//   meta labels/values, gallery headings "Merch" / "Space"; the logo in
//   the Graphic Index is the navy logo from mockups/ (the deck's own is
//   black, and isn't in the folder as an image).
// Credits: Neama's name always comes first wherever a collaborator is named.

import inter from '../../assets/nextoctober/font-inter.svg';
import hero from '../../assets/nextoctober/hero.jpg';
import logo from '../../assets/nextoctober/logo.png';
import saveStory from '../../assets/nextoctober/save/01-story.jpg';

const posters = import.meta.glob('../../assets/nextoctober/posters/*.jpg', { eager: true, import: 'default' });
const merch = import.meta.glob('../../assets/nextoctober/merch/*.jpg', { eager: true, import: 'default' });
const space = import.meta.glob('../../assets/nextoctober/space/*.jpg', { eager: true, import: 'default' });

// Files are numbered in deck order, so sorting the paths keeps that order.
const inOrder = (files) =>
  Object.keys(files)
    .sort()
    .map((path) => files[path]);

// `slot` keeps each folder's pictures apart in the review editor (posters/01,
// merch/01 and space/01 share a file number).
const images = (files, notes, slot) =>
  inOrder(files).map((src, index) => ({
    kind: 'image',
    src,
    note: notes?.[index] ?? '',
    slot: slot ? `${slot}-${String(index + 1).padStart(2, '0')}` : undefined,
  }));

// The deck names each poster under it.
const POSTER_NAMES = ['Bar Tomer', 'Alon Kleinman', 'Hadar Rosenfeld Bardicheski'];

export const nextoctober = {
  slug: 'next-october',
  dispatchNumber: '05',
  category: 'BRANDING',

  hero: {
    media: { kind: 'image', note: 'Next October pavilion at the President’s Residence', src: hero },
    scrollLabel: 'SCROLL_TO_UNBOX',
  },

  title: {
    tag: 'BRANDING_COURSE · NEAMA KLEIN & AMIT TAL',
    name: 'Next October',
    tagline: 'Branding for an initiative building 1,400 startups in memory of the fallen of October 7th.',
  },

  meta: [
    { label: 'Origin', value: 'Branding course, 3rd year' },
    { label: 'Year', value: '2026' },
    { label: 'Category', value: 'Branding' },
    { label: 'Team', value: 'Neama Klein · Amit Tal' },
  ],

  strategy: {
    heading: 'Strategy',
    paragraphs: [
      {
        lead: 'Next October',
        text: ' is a national initiative founded by Izhar Shay in memory of his son, Yaron, who fell on October 7th. Its goal: 1,400 new startups, one for every life lost, built together with bereaved families and tech companies.',
      },
      'The branding is built around one transition: from memory to legacy. Loss that becomes a force that builds.',
    ],
  },

  brandBook: {
    heading: 'Graphic Index',
    logoSrc: logo,
    primaryColors: [
      { name: 'Legacy', hex: '#201C82' },
      { name: 'Memory', hex: '#F89E23' },
      { name: 'Active Choice', hex: '#FFF8F4' },
    ],
    fonts: [{ name: 'Polin' }, { name: 'Inter', specimen: inter }],
  },

  galleries: [
    {
      heading: 'Posters: In memory of',
      text: ['Each poster carries one name.'],
      columns: 3,
      media: images(posters, undefined, 'posters').map((item, index) => ({
        ...item,
        note: `poster in memory of ${POSTER_NAMES[index]}`,
        caption: POSTER_NAMES[index],
      })),
    },
    {
      heading: 'Save the Date',
      text: [
        'I designed the invitation to the Next October summit at the President’s Residence to balance the dignity of a state ceremony with the energy of the brand. Legacy blue and Memory orange connect remembrance and hope.',
      ],
      columns: 1,
      maxRowHeight: '80vh',
      media: [{ kind: 'image', note: 'save the date story on a phone', src: saveStory }],
    },
    {
      heading: 'Merch',
      text: ['A pin, a bracelet, a scarf, and a lanyard: memory carried every day.'],
      columns: 3,
      media: images(merch, ['hope pin', 'hope legacy bracelet', 'scarf on the wrist', 'scarf with its tag', 'lanyard'], 'merch'),
    },
    {
      heading: 'Space',
      text: ['The pavilion.'],
      layout: 'wide',
      ratio: '16 / 9',
      media: images(space, ['pavilion at the President’s Residence', 'seating and merch counter'], 'space'),
    },
  ],

  footer: {
    label: 'END_OF_DISPATCH № 05',
    returnLabel: '← Return to Terminal',
  },
};
