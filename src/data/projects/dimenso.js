// Content transcribed verbatim from Figma (Portfolio file, "DIMENSO" case study),
// except the "Invitation" spelling and Cyan hex, corrected per Neama — Figma
// still has "Invtation" and Cyan == Yellow, worth fixing there too.
// Do not rewrite/shorten copy here — edit the source in Figma, then re-sync.

export const dimenso = {
  slug: 'dimenso',
  dispatchNumber: '01',
  category: 'BRAND_ID',

  hero: {
    // TODO(Neama): these two text layers are empty in Figma — fill in the
    // hero headline + subtitle there and they'll flow through here.
    heading: '',
    subtitle: '',
    scrollLabel: 'SCROLL_TO_UNBOX',
  },

  title: {
    tag: 'DISPATCHED_2026 · ROLE: BRAND_in_a_ box',
    name: 'DIMENSO',
    tagline: 'A spatial identity for a measurement-obsessed architecture studio — every line drawn to scale.',
  },

  meta: [
    { label: 'Course', value: 'BRAND IN A BOX' },
    { label: 'Year', value: '2026' },
    { label: 'Category', value: 'BRAND_ID' },
    { label: 'Role', value: 'BRAND DESIGNER' },
  ],

  strategy: {
    slip: 'PACKING_SLIP_001',
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
  // Design gallery — a full-width cover render, then a pinned row of 3
  // portrait AI clips. Both pin to the viewport top while scrolling, same
  // as the Space Design gallery below.
  process: {
    items: [
      { type: 'single', full: true, media: { kind: 'image', note: 'process cover render' } },
      {
        type: 'row',
        media: [
          { kind: 'video', note: 'AI render clip 1' },
          { kind: 'video', note: 'AI render clip 2' },
          { kind: 'video', note: 'AI render clip 3' },
        ],
      },
    ],
  },

  brandBook: {
    slip: 'PACKING_SLIP_002',
    heading: 'Graphic Index',
    fonts: [
      { name: 'Brandon Grotesque' },
      { name: 'Adobe Clean' },
    ],
    primaryColors: [
      { name: 'Magenta', hex: '#E541A6' },
      { name: 'Yellow', hex: '#F1A528' },
      // TODO(Neama): confirm real hex — was a duplicate of Yellow in Figma.
      { name: 'Cyan', hex: '#00B4D8' },
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
  // `media` is a placeholder count — swap for real files from the
  // /portfolio-source/dimenso/ folder.
  galleries: [
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Space Design',
      // Sticky scroll-reveal in Figma: each image pins while the next
      // scrolls over it — same as the `process` section above.
      layout: 'sticky',
      media: [
        { kind: 'image', note: 'enhanced_Image27' },
        { kind: 'image', note: 'enhanced_Image24' },
        { kind: 'image', note: 'enhanced_Image18_000' },
        { kind: 'image', note: 'enhanced_Image15' },
        { kind: 'image', note: 'enhanced_Image16' },
      ],
    },
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Social & Invitation',
      media: [
        { kind: 'image', note: 'iPad mockup — social post' },
        { kind: 'video', note: 'invitation animation' },
      ],
    },
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Marketing Campaign',
      media: [
        { kind: 'image', note: 'campaign visual 1' },
        { kind: 'image', note: 'campaign visual 2' },
        { kind: 'video', note: 'campaign motion 1' },
        { kind: 'video', note: 'campaign motion 2' },
      ],
    },
    {
      slip: 'PACKING_SLIP_003',
      heading: 'Walkthrough Video',
      media: [{ kind: 'video', note: 'MacBook mockup — walkthrough' }],
    },
  ],

  spatialRenders: {
    note: 'Interior renders — physical application of the Dimenso identity (360 Room, Creative Hub, Creative Lab, Interactive, Cafe Bar).',
    count: 30,
  },

  footer: {
    label: 'END_OF_DISPATCH № 01',
    returnLabel: '← Return to Terminal',
  },
};
