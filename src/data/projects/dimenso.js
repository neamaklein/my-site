// Content transcribed verbatim from Figma (Portfolio file, "DIMENSO" case study),
// except the "Invitation" spelling, corrected per Neama — Figma still has
// "Invtation", worth fixing there too.
// Images below are temporary Figma-exported stills, downloaded and
// compressed for web use, standing in until Neama hands over the
// full-resolution originals from her local source folder.
// Do not rewrite/shorten copy here — edit the source in Figma, then re-sync.

import pavilionExterior from '../../assets/dimenso/process/pavilion-exterior.jpg';
import heroVideo from '../../assets/dimenso/hero.mp4';
import posterMagenta from '../../assets/dimenso/process/poster-magenta.mp4';
import posterOrange from '../../assets/dimenso/process/poster-orange.mp4';
import posterCyan from '../../assets/dimenso/process/poster-cyan.mp4';

import morphology from '../../assets/dimenso/brandbook/morphology.mp4';
import logoIcon from '../../assets/dimenso/logo-icon.png';
import icon01 from '../../assets/dimenso/brandbook/icons/01.png';
import icon02 from '../../assets/dimenso/brandbook/icons/02.png';
import icon03 from '../../assets/dimenso/brandbook/icons/03.png';
import icon04 from '../../assets/dimenso/brandbook/icons/04.png';
import icon05 from '../../assets/dimenso/brandbook/icons/05.png';

import space01 from '../../assets/dimenso/spacedesign/space-01.jpg';
import space02 from '../../assets/dimenso/spacedesign/space-02.jpg';
import space03 from '../../assets/dimenso/spacedesign/space-03.jpg';
import space04 from '../../assets/dimenso/spacedesign/space-04.jpg';
import space05 from '../../assets/dimenso/spacedesign/space-05.jpg';

import socialSequence from '../../assets/dimenso/social/social-sequence.mp4';
import invitationAnimation from '../../assets/dimenso/social/invitation-animation.mp4';
import socialWide from '../../assets/dimenso/social/social-wide.mp4';

import campaign01 from '../../assets/dimenso/marketing/campaign-01.jpg';
import campaign02 from '../../assets/dimenso/marketing/campaign-02.jpg';
import campaign03 from '../../assets/dimenso/marketing/campaign-03.jpg';
import campaign04 from '../../assets/dimenso/marketing/campaign-04.jpg';

import planGround from '../../assets/dimenso/plans/plan-ground.jpg';
import planUpper from '../../assets/dimenso/plans/plan-upper.jpg';
import elevation from '../../assets/dimenso/plans/elevation.jpg';
import walkthroughVideo from '../../assets/dimenso/walkthrough/walkthrough.mp4';
import walkthroughPoster from '../../assets/dimenso/walkthrough/walkthrough-poster.jpg';
import macbookFrame from '../../assets/dimenso/walkthrough/macbook-frame.webp';

import spatial01 from '../../assets/dimenso/spatial/spatial-01.jpg';
import spatial03 from '../../assets/dimenso/spatial/spatial-03.jpg';
import spatial04 from '../../assets/dimenso/spatial/spatial-04.jpg';
import spatial06 from '../../assets/dimenso/spatial/spatial-06.jpg';
import spatial07 from '../../assets/dimenso/spatial/spatial-07.jpg';
import spatial08 from '../../assets/dimenso/spatial/spatial-08.jpg';
import spatial13 from '../../assets/dimenso/spatial/spatial-13.jpg';

export const dimenso = {
  slug: 'dimenso',
  dispatchNumber: '01',
  category: 'BRAND_ID',

  hero: {
    // Per Neama: no logo-reveal intro and no headline or subtitle; the
    // page opens straight on the video.
    // Her upload: the logo video, on a loop.
    media: { kind: 'video', note: 'hero background (looping video, not a still image)', src: heroVideo },
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
    // Per Neama (the YouTube credit: Amit Tal & Neama Klein); her name first.
    { label: 'Team', value: 'Neama Klein · Amit Tal' },
  ],

  strategy: {
    heading: 'Strategy',
    paragraphs: [
      {
        lead: 'Dimensō',
        text: ' is a hybrid Creative Lab platform designed to bridge the gap between the flexibility of Open Source technology and a premium, high-end user experience. It functions as a centralized creative hub, unifying the world’s most advanced AI engines into a single, intuitive interface.',
      },
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
      // Her uploads: the posters as moving images (black bars cropped off);
      // the orange one fills its frame on white, per her edit.
      { kind: 'video', note: 'brand poster — magenta', src: posterMagenta, loop: true },
      {
        kind: 'video',
        note: 'brand poster — orange',
        src: posterOrange,
        loop: true,
        css: { backgroundColor: '#ffffff', objectFit: 'fill' },
      },
      { kind: 'video', note: 'brand poster — cyan', src: posterCyan, loop: true },
    ],
  },

  brandBook: {
    heading: 'Graphic Index',
    // Per Neama: the logo half as large again.
    logoScale: 1.5,
    fonts: [{ name: 'Brandon Grotesque' }, { name: 'Adobe Clean' }],
    logoSrc: logoIcon,
    // Her upload: the morphology as a video.
    morphologySrc: morphology,
    morphologyKind: 'video',
    // Per Neama: each icon on its own, wrapping to fit the card.
    iconSet: [
      { src: icon01, name: 'Creative Hub' },
      { src: icon02, name: 'Creative Lab' },
      { src: icon03, name: 'Interactive' },
      { src: icon04, name: 'Cafe Bar' },
      { src: icon05, name: '360 Room' },
    ],
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
      // Per Neama: the first image edge to edge, a full screen; the other
      // four at half the width, two by two. Full-resolution files from the
      // portfolio Figma (the deck crops were 512px).
      layout: 'lead',
      leadBleed: true,
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
      // Per Neama: the two phone videos side by side (her uploads), no
      // third slot; one height, no taller than most of the screen.
      columns: 2,
      maxRowHeight: '80svh',
      ratio: '348 / 718',
      media: [
        { kind: 'video', note: 'social sequence', src: socialSequence, loop: true },
        // Per Neama: 98% of its cell, centred, 7px lower.
        {
          kind: 'video',
          note: 'invitation animation',
          src: invitationAnimation,
          loop: true,
          size: { width: 98, align: 'center' },
          offset: { x: 0, y: 7 },
        },
      ],
      // Per Neama: a wide video under the phones (her upload), edge to edge
      // so its small type reads.
      after: [{ kind: 'video', note: 'social wide video', src: socialWide, loop: true }],
    },
    {
      heading: 'Marketing Campaign',
      // Was a 2×2 grid in Figma; now one large and three in a tight row,
      // for scale contrast, all edge to edge (per Neama).
      layout: 'lead',
      leadBleed: true,
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
      // Per Neama: her plans (iD_plans_A3, iD_elevation_cyan), before the
      // video, each named under it. The names are descriptive labels, not
      // from her files — rename freely.
      heading: 'Plans',
      columns: 1,
      media: [
        { kind: 'image', note: 'ground floor plan', src: planGround, caption: 'Ground Floor Plan', captionBelow: true },
        { kind: 'image', note: 'upper floor plan', src: planUpper, caption: 'Upper Floor Plan', captionBelow: true },
        { kind: 'image', note: 'front elevation', src: elevation, caption: 'Front Elevation', captionBelow: true },
      ],
    },
    {
      heading: 'Walkthrough Video',
      // Per Neama: the full walkthrough (1:30, silent) playing on the
      // MacBook from the Figma. It loads only as you near it and plays
      // while it is on screen. `screen` is the display area of the frame
      // image, in % of its size.
      layout: 'device',
      // Per Neama: the screen 1.04x so it meets the bezel.
      device: {
        frame: macbookFrame,
        screen: { left: 9.75, top: 4.31, width: 80.6, height: 82.8, scale: 1.04 },
      },
      media: [{ kind: 'video', note: 'DIMENSO walkthrough', src: walkthroughVideo, poster: walkthroughPoster }],
    },
  ],

  // Per Neama: no image twice in a row. The Figma strip held seven renders
  // each twice (01/02, 03/11, 04/05, 06/12, 07/10, 08/09, 13/14 are the
  // same picture); each now shows once, and the strip loops.
  spatialRenders: {
    note: 'Interior renders — physical application of the Dimenso identity (360 Room, Creative Hub, Creative Lab, Interactive, Cafe Bar).',
    images: [spatial01, spatial03, spatial04, spatial06, spatial07, spatial08, spatial13],
  },

  footer: {
    label: 'END_OF_DISPATCH № 01',
    returnLabel: '← Return to Terminal',
  },
};
