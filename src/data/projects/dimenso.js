// Content transcribed verbatim from Figma (Portfolio file, "DIMENSO" case study),
// except the "Invitation" spelling, corrected per Neama — Figma still has
// "Invtation", worth fixing there too.
// Images below are temporary Figma-exported stills, downloaded and
// compressed for web use, standing in until Neama hands over the
// full-resolution originals from her local source folder.
// Do not rewrite/shorten copy here — edit the source in Figma, then re-sync.

import pavilionExterior from '../../assets/dimenso/process/pavilion-exterior.jpg';
import posterMagenta from '../../assets/dimenso/process/poster-magenta.jpg';
import posterOrange from '../../assets/dimenso/process/poster-orange.jpg';
import posterCyan from '../../assets/dimenso/process/poster-cyan.jpg';

import morphology from '../../assets/dimenso/brandbook/morphology.png';
import logoIcon from '../../assets/dimenso/logo-icon.png';
import iconsRow from '../../assets/dimenso/brandbook/icons-row.png';

import space01 from '../../assets/dimenso/spacedesign/space-01.jpg';
import space02 from '../../assets/dimenso/spacedesign/space-02.jpg';
import space03 from '../../assets/dimenso/spacedesign/space-03.jpg';
import space04 from '../../assets/dimenso/spacedesign/space-04.jpg';
import space05 from '../../assets/dimenso/spacedesign/space-05.jpg';

import phoneSplash from '../../assets/dimenso/social/phone-splash.jpg';

import campaign01 from '../../assets/dimenso/marketing/campaign-01.jpg';
import campaign02 from '../../assets/dimenso/marketing/campaign-02.jpg';
import campaign03 from '../../assets/dimenso/marketing/campaign-03.jpg';
import campaign04 from '../../assets/dimenso/marketing/campaign-04.jpg';

import macbookStill from '../../assets/dimenso/walkthrough/macbook-still.jpg';

import spatial01 from '../../assets/dimenso/spatial/spatial-01.jpg';
import spatial02 from '../../assets/dimenso/spatial/spatial-02.jpg';
import spatial03 from '../../assets/dimenso/spatial/spatial-03.jpg';
import spatial04 from '../../assets/dimenso/spatial/spatial-04.jpg';
import spatial05 from '../../assets/dimenso/spatial/spatial-05.jpg';
import spatial06 from '../../assets/dimenso/spatial/spatial-06.jpg';
import spatial07 from '../../assets/dimenso/spatial/spatial-07.jpg';
import spatial08 from '../../assets/dimenso/spatial/spatial-08.jpg';
import spatial09 from '../../assets/dimenso/spatial/spatial-09.jpg';
import spatial10 from '../../assets/dimenso/spatial/spatial-10.jpg';
import spatial11 from '../../assets/dimenso/spatial/spatial-11.jpg';
import spatial12 from '../../assets/dimenso/spatial/spatial-12.jpg';
import spatial13 from '../../assets/dimenso/spatial/spatial-13.jpg';
import spatial14 from '../../assets/dimenso/spatial/spatial-14.jpg';

export const dimenso = {
  slug: 'dimenso',
  dispatchNumber: '01',
  // Station-sign stripes beside the dispatch number: the project's colors.
  stripes: ['#E541A6', '#F1A528'],
  category: 'BRAND_ID',

  hero: {
    intro: true,
    // TODO(Neama): these two text layers are empty in Figma — fill in the
    // hero headline + subtitle there and they'll flow through here.
    heading: '',
    subtitle: '',
    media: { kind: 'video', note: 'hero background (looping video, not a still image)' },
    scrollLabel: 'SCROLL_TO_UNBOX',
  },

  title: {
    tag: 'DISPATCHED_2026 · ROLE: BRAND_in_a_ box',
    name: 'DIMENSO',
    tagline: 'A spatial identity for a measurement-obsessed architecture studio — every line drawn to scale.',
  },

  meta: [
    { label: 'Course', value: 'Brand in a Box' },
    { label: 'Year', value: '2026' },
    { label: 'Category', value: 'Brand ID' },
    { label: 'Role', value: 'Brand Designer' },
  ],

  strategy: {
    heading: 'Strategy',
    paragraphs: [
      {
        lead: 'Dimensō',
        text: " is a hybrid Creative Lab platform designed to bridge the gap between the flexibility of Open Source technology and a premium, high-end user experience. It functions as a centralized creative hub, unifying the world’s most advanced AI engines into a single, intuitive interface.",
      },
      "Dimenso — Creative LabBridging 2D Concept and 3D Reality through AI Integration. Dimenso is a visionary creative workspace by Adobe, designed to streamline the creative workflow. The platform seamlessly integrates Adobe’s powerful suite with advanced AI tools into a single, unified interface tailored for designers, developers, and creative professionals. Created as part of the 'Brand in a Box' course, Dimenso redefines how cross-disciplinary teams collaborate, transforming flat 2D concepts into immersive 3D realities.",
    ],
  },

  // Unlabeled sticky-scroll section between the brand book and the Space
  // Design gallery: a full-bleed exterior photo of the physical pavilion,
  // then 3 illustrated brand posters slide up over it in a fanned stack.
  // Both pin to the viewport top while scrolling, same as Space Design.
  // The pavilion with its posters sliding over it is DIMENSO's strongest
  // moment, so it opens the page right after the title.
  feature: 'process',

  process: {
    cover: { kind: 'image', note: 'pavilion exterior photo', src: pavilionExterior },
    row: [
      { kind: 'image', note: 'brand poster — magenta', src: posterMagenta },
      { kind: 'image', note: 'brand poster — orange', src: posterOrange },
      { kind: 'image', note: 'brand poster — cyan', src: posterCyan },
    ],
  },

  brandBook: {
    heading: 'Graphic Index',
    fonts: [
      { name: 'Brandon Grotesque' },
      { name: 'Adobe Clean' },
    ],
    logoSrc: logoIcon,
    morphologySrc: morphology,
    iconsSrc: iconsRow,
    primaryColors: [
      { name: 'Magenta', hex: '#E541A6' },
      { name: 'Yellow', hex: '#F1A528' },
      { name: 'Cyan', hex: '#47E1E3' },
    ],
    secondaryColors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    icons: [
      { name: '360 Room' },
      { name: 'Creative Hub' },
      { name: 'Creative Lab' },
      { name: 'Interactive' },
      { name: 'Cafe Bar' },
    ],
  },

  // Result galleries, in the order they appear on the Figma canvas.
  galleries: [
    {
      heading: 'Space Design',
      // Sticky in Figma; now one sticky moment per project (the pavilion
      // above), so this scrolls normally: one large, four tight beneath.
      layout: 'lead',
      columns: 2,
      media: [
        { kind: 'image', note: 'enhanced_Image27', src: space01 },
        { kind: 'image', note: 'enhanced_Image24', src: space02 },
        { kind: 'image', note: 'enhanced_Image18_000', src: space03 },
        { kind: 'image', note: 'enhanced_Image15', src: space04 },
        { kind: 'image', note: 'enhanced_Image16', src: space05 },
      ],
    },
    {
      heading: 'Social & Invitation',
      // Figma: three 348×718 portrait frames side by side.
      columns: 3,
      ratio: '348 / 718',
      media: [
        { kind: 'video', note: 'social sequence' },
        { kind: 'image', note: 'phone splash screen — social post', src: phoneSplash },
        { kind: 'video', note: 'invitation animation' },
      ],
    },
    {
      heading: 'Marketing Campaign',
      // Was a 2×2 grid in Figma; now one large and three in a tight row,
      // for scale contrast (per Neama).
      layout: 'lead',
      columns: 3,
      ratio: '629 / 351',
      media: [
        { kind: 'image', note: 'interactive AR installation', src: campaign01 },
        { kind: 'image', note: 'billboard', src: campaign02 },
        { kind: 'image', note: 'AR bench installation', src: campaign03 },
        { kind: 'image', note: 'light-projection street installation', src: campaign04 },
      ],
    },
    {
      heading: 'Walkthrough Video',
      layout: 'bleed',
      // This is a still frame standing in for the actual walkthrough video.
      media: [{ kind: 'image', note: 'MacBook mockup — walkthrough (video still)', src: macbookStill }],
    },
  ],

  spatialRenders: {
    note: 'Interior renders — physical application of the Dimenso identity (360 Room, Creative Hub, Creative Lab, Interactive, Cafe Bar).',
    images: [
      spatial01, spatial02, spatial03, spatial04, spatial05, spatial06, spatial07,
      spatial08, spatial09, spatial10, spatial11, spatial12, spatial13, spatial14,
    ],
  },

  footer: {
    label: 'END_OF_DISPATCH № 01',
    returnLabel: '← Return to Terminal',
  },
};
