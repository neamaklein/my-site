// Neama's personal project: new covers for the 15 books of Robert
// Jordan's "Wheel of Time" series. There is no deck: the structure was
// agreed with Neama, and the images are her full-quality mockups from the
// "WOT BOOKS" folder, compressed for web. The only words on the page are
// the series' own titles; the project text waits for Neama. The
// characters sheet and the annotated Great Hunt cover & back are her
// uploads.
//
// Not from Neama (structural labels only — rename freely):
//   the title tag, meta labels/values, gallery headings "The Series" /
//   "Cover & Back" / "Pattern".

import hero from '../../assets/wot/hero.mp4';
import characters from '../../assets/wot/characters/characters.jpg';

const series = import.meta.glob('../../assets/wot/series/*.jpg', { eager: true, import: 'default' });
const flat = import.meta.glob('../../assets/wot/flat/*.jpg', { eager: true, import: 'default' });
const repeat = import.meta.glob('../../assets/wot/repeat/*.jpg', { eager: true, import: 'default' });

// Files are numbered in reading order, so sorting the paths keeps that order.
const inOrder = (files) =>
  Object.keys(files)
    .sort()
    .map((path) => files[path]);

const images = (files, notes) =>
  inOrder(files).map((src, index) => ({ kind: 'image', src, note: notes?.[index] ?? '' }));

// The titles as printed on the covers, book 0.5 (the prequel) to 14.
const TITLES = [
  'New Spring',
  'The Eye of the World',
  'The Great Hunt',
  'The Dragon Reborn',
  'The Shadow Rising',
  'The Fires of Heaven',
  'Lord of Chaos',
  'A Crown of Swords',
  'The Path of Daggers',
  "Winter's Heart",
  'Crossroads of Twilight',
  'Knife of Dreams',
  'The Gathering Storm',
  'Towers of Midnight',
  'A Memory of Light',
];

export const wot = {
  slug: 'wheel-of-time',
  dispatchNumber: '07',
  category: 'BOOK_COVERS',

  hero: {
    media: { kind: 'video', note: 'the covers, one after another', src: hero },
    scrollLabel: 'SCROLL_TO_UNBOX',
  },

  title: {
    tag: 'PERSONAL_PROJECT · BY NEAMA KLEIN',
    name: 'Wheel of Time',
    // TODO(Neama): a line of your own goes here.
    tagline: '',
  },

  meta: [
    { label: 'Project', value: 'Personal' },
    { label: 'Category', value: 'Book covers' },
    { label: 'Books', value: '15' },
  ],

  galleries: [
    {
      heading: 'The Series',
      // Per Neama: one large, the rest small in rows of three, close
      // together; a small one clicked swaps into the large place.
      layout: 'lead',
      columns: 3,
      fillLast: true,
      gap: 6,
      // Per Neama: The Eye of the World isn't needed here.
      media: images(series, TITLES).filter((item) => item.note !== 'The Eye of the World'),
    },
    {
      // Per Neama: the characters sheet (her upload) as its own section,
      // above Cover & Back, under her heading, across the full width.
      heading: 'דמויות',
      columns: 1,
      media: [{ kind: 'image', note: 'the characters', src: characters }],
    },
    {
      heading: 'Cover & Back',
      // Per Neama: one large, the rest small under it, like The Series.
      // The Great Hunt (her annotated cover & back) leads; a small one
      // clicked swaps into the large place.
      layout: 'lead',
      columns: 3,
      fillLast: true,
      gap: 6,
      media: (() => {
        const [eye, hunt, crown, storm] = images(flat, [
          'The Eye of the World',
          'The Great Hunt',
          'A Crown of Swords',
          'The Gathering Storm',
        ]);
        return [hunt, eye, crown, storm];
      })(),
    },
    {
      heading: 'Pattern',
      // Per Neama: no sticky scrolling, and only The Eye of the World
      // (The Shadow Rising and Winter's Heart aren't needed); no taller
      // than most of the screen.
      columns: 1,
      maxRowHeight: '85svh',
      media: images(repeat, ['The Eye of the World']),
    },
  ],

  footer: {
    label: 'END_OF_DISPATCH № 07',
    returnLabel: '← Return to Terminal',
  },
};
