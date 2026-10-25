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

const images = (files, notes) =>
  inOrder(files).map((src, index) => ({ kind: 'image', src, note: notes?.[index] ?? '' }));

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
    tag: 'BRANDING_COURSE _3RD YEAR · BY NEAMA KLEIN & AMIT TAL',
    name: 'Next October',
    tagline: 'memory to legacy',
  },

  meta: [
    { label: 'Course', value: 'Branding, 3rd year' },
    { label: 'Team', value: 'Neama Klein · Amit Tal' },
    { label: 'Category', value: 'Branding' },
  ],

  strategy: {
    heading: 'Strategy',
    paragraphs: [
      { lead: 'Next October', text: ' is a national initiative and technological movement founded by Izhar Shay, a former Israeli Minister of Science and Technology, in memory of his son, Yaron, who fell in battle on October 7th. The initiative’s vision is to transform profound loss into a powerful catalyst for growth. Its mission is to establish and support 1,400 new startups, one for every individual lost, ensuring that the legacy of the fallen becomes a living part of Israel’s innovation ecosystem. By pairing tech companies with bereaved families, the initiative turns personal grief into collective creation.' },
      'Next October perceives the pain of memory as a living engine for entrepreneurship, growth, and hope for Israeli society. By bridging the legacy of the fallen with technological and social innovation, it ensures that their light continues to guide and build our tomorrow. This is a profound transition from memory to legacy—transforming loss into a constructive force that shapes our future.',
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
      heading: 'Posters In memory of',
      columns: 3,
      media: images(posters).map((item, index) => ({
        ...item,
        note: `poster in memory of ${POSTER_NAMES[index]}`,
        caption: POSTER_NAMES[index],
      })),
    },
    {
      heading: 'SAVE THE DATE/',
      text: [
        'Digital invitation for the Next October summit held at the President’s Residence in Jerusalem. Hosted by the President of Israel, this high-profile event marked the one-year anniversary of October 7th, focusing on the profound transition from mourning to active rebuilding through innovation and entrepreneurship.',
        'My design objective was to create a visual gateway that balanced the formal dignity of a state ceremony with the forward-thinking, optimistic energy of the Next October brand. By integrating the signature Active Choice Blue and Optimism Golden-Orange, I aimed to symbolize the bridge between memory and hope, ensuring the layout resonated with bereaved families and high-tech leaders alike.',
      ],
      columns: 1,
      maxRowHeight: '80vh',
      media: [{ kind: 'image', note: 'save the date story on a phone', src: saveStory }],
    },
    {
      heading: 'Merch',
      columns: 3,
      media: images(merch, ['hope pin', 'hope legacy bracelet', 'scarf on the wrist', 'scarf with its tag', 'lanyard']),
    },
    {
      heading: 'Space',
      layout: 'wide',
      ratio: '16 / 9',
      media: images(space, ['pavilion at the President’s Residence', 'seating and merch counter']),
    },
  ],

  footer: {
    label: 'END_OF_DISPATCH № 05',
    returnLabel: '← Return to Terminal',
  },
};
