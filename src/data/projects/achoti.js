// ACHOTI, per Neama: the flow and every text from Amit Tal's case study of
// the same project (amit-touch-portfolio.onrender.com, achotiData.js), in
// English. Each card there is a chapter here, in her order: challenge,
// solution, wireframes, identity, interface language, characters, core
// experience, indoor navigation, treatment journey, the film, the final
// experience. Her closing card ("Return to the archive") is this page's
// footer. Card tags (e.g. "Problem Discovery · Patient Stress") are left
// out; only the intro's tags are used, as the category.
//
// Images are Amit's files from her site; the walkthrough film is Neama's
// own screen recording. The navigation and
// queue details and the primary logo are padded with transparent space so
// they sit at their own size beside taller media (Rows keeps a row at one
// height).
// Credits: Neama's name always comes first wherever a collaborator is named.

import hero from '../../assets/achoti/hero.jpg';
import logo from '../../assets/achoti/logo.png';
import logos from '../../assets/achoti/logos.png';
import sceneCorridor from '../../assets/achoti/scenes/scene-corridor.png';
import sceneCar from '../../assets/achoti/scenes/scene-car.png';
import mainThinking from '../../assets/achoti/characters/main-thinking.png';
import mainStanding from '../../assets/achoti/characters/main-standing.png';
import patientUser from '../../assets/achoti/characters/patient-user.png';
import pregnantUser from '../../assets/achoti/characters/pregnant-user.png';
import visitorUser from '../../assets/achoti/characters/visitor-user.png';
import wireframes from '../../assets/achoti/wireframes.png';
import roleSelection from '../../assets/achoti/screens/role-selection.png';
import arrival from '../../assets/achoti/screens/arrival.png';
import dashboard from '../../assets/achoti/screens/dashboard.png';
import indoorNavigation from '../../assets/achoti/screens/indoor-navigation.png';
import navTurn from '../../assets/achoti/screens/nav-turn.png';
import navEta from '../../assets/achoti/screens/nav-eta.png';
import queuePanel from '../../assets/achoti/screens/queue-panel.png';
import walkthrough from '../../assets/achoti/app-walkthrough.mp4';
import walkthroughPoster from '../../assets/achoti/app-walkthrough-poster.jpg';
import phoneFrame from '../../assets/achoti/phone-frame.webp';

const icons = import.meta.glob('../../assets/achoti/icons/*.svg', { eager: true, import: 'default' });
const inOrder = (files) =>
  Object.keys(files)
    .sort()
    .map((path) => files[path]);

const image = (src, note, caption) => ({ kind: 'image', src, note, ...(caption ? { caption } : {}) });

export const achoti = {
  slug: 'achoti',
  dispatchNumber: '02',
  category: 'UX_UI',

  hero: {
    media: { kind: 'image', note: 'ACHOTI — logo, the app and its character', src: hero },
    scrollLabel: 'SCROLL_TO_UNBOX',
  },

  title: {
    tag: '01 · INTRODUCTION · UX/UI · HEALTHCARE',
    name: 'ACHOTI',
    tagline: 'Hospital Navigation & Support System',
  },

  meta: [
    { label: 'Course', value: 'UX/UI' },
    { label: 'Team', value: 'Neama Klein · Amit Tal' },
    { label: 'Category', value: 'UX/UI · Healthcare · Digital Companion' },
    { label: 'Year', value: '2026' },
  ],

  strategy: {
    paragraphs: [
      'A personal hospital companion that turns a stressful medical journey into one continuous, reassuring experience — from preparation at home to the exact room inside the hospital.',
    ],
  },

  // Per Neama: the Graphic Index in the same language as the other
  // projects (it replaces Amit's identity and interface-language boards),
  // in the flow's place for them: after the wireframes.
  brandBookBefore: 'A Human Presence Across the Entire Journey',
  brandBook: {
    heading: 'Graphic Index',
    labels: { element: 'Logo variations' },
    logoSrc: logo,
    elementSrc: logos,
    primaryColors: [
      { hex: '#00736C' },
      { hex: '#00A79D' },
      { hex: '#B3E5E1' },
      { hex: '#E0F4F2' },
      { hex: '#A6360F' },
      { hex: '#E1582C' },
      { hex: '#F8D4C5' },
      { hex: '#FCEDE7' },
    ],
    secondaryColors: [
      { name: '', hex: '#1F2D3D' },
      { name: '500', hex: '#575C60' },
      { name: '300', hex: '#D9D9D9' },
      { name: '100', hex: '#E7E7E7' },
      { name: 'white', hex: '#FFFFFF' },
    ],
    fonts: [{ name: 'אסימון', sample: 'אבג' }],
    // Each icon on its own, wrapping to fit the card.
    iconSet: inOrder(icons).map((src) => ({ src, name: '' })),
    // Figma SVGs at the size they were drawn, not stretched to the grid row.
    iconNatural: true,
  },

  galleries: [
    {
      eyebrow: '02 · The Challenge',
      heading: 'The Hospital Experience is Not Only Medical',
      text: [
        'Patients and families must juggle appointments, preparation instructions, documents, complex corridors, and the constant stress of what happens next. Uncertainty and fragmented information define the journey.',
      ],
      columns: 2,
      maxRowHeight: '70svh',
      media: [
        image(sceneCorridor, 'hospital corridor sketch', 'Hospital Corridors'),
        image(mainThinking, 'the companion, thinking', 'Information Overload'),
      ],
    },
    {
      eyebrow: '03 · The Solution',
      heading: 'A Continuous Digital Companion',
      text: [
        'ACHOTI unites every phase of the medical visit into one reassuring narrative: clear preparation at home, contextual guidance upon arrival, and seamless indoor wayfinding from doorstep to consultation.',
      ],
      columns: 2,
      maxRowHeight: '70svh',
      media: [image(sceneCar, 'arriving by car', 'Journey Preparation'), image(roleSelection, 'role selection screen')],
    },
    {
      eyebrow: '04 · User Flow & Wireframes',
      heading: 'Structure First. Visual Design Comes Later.',
      text: [
        'The flow, hierarchy and pacing were defined before any final interface styling. Each screen focuses on the next immediate decision.',
      ],
      columns: 1,
      maxRowHeight: '85svh',
      media: [image(wireframes, 'wireframes', '7-Screen System Architecture')],
    },
    {
      eyebrow: '05 · Character Design / Companion System',
      heading: 'A Human Presence Across the Entire Journey',
      text: [
        'The companion is a recurring product cue. Poses communicate context and emotion, while the wider character family keeps the visual language inclusive and consistent.',
      ],
      columns: 4,
      maxRowHeight: '70svh',
      media: [
        image(mainStanding, 'the companion', 'Companion Persona'),
        image(patientUser, 'patient', 'Patient Persona'),
        image(pregnantUser, 'maternity', 'Maternity Persona'),
        image(visitorUser, 'visitor', 'Visitor Persona'),
      ],
    },
    {
      eyebrow: '06 · Core Experience',
      heading: 'The Journey Adapts to Why You Are Here',
      text: [
        'The experience changes according to the user context while keeping orientation immediate and simple. Clear next steps appear precisely when needed.',
      ],
      columns: 3,
      maxRowHeight: '70svh',
      media: [
        image(roleSelection, 'role selection screen', '01 · Role & Intake Flow'),
        image(arrival, 'arrival screen', '02 · Hospital Arrival Check-in'),
        image(dashboard, 'treatment status screen', '03 · Treatment & Queue Status'),
      ],
    },
    {
      eyebrow: '07 · Indoor Navigation',
      heading: 'Wayfinding Becomes the Interface',
      text: [
        'The physical environment becomes the main reference. Direction, remaining walking time, accessibility information and the companion stay visible without forcing the user to decode a separate map.',
      ],
      columns: 3,
      maxRowHeight: '70svh',
      media: [
        image(navTurn, 'turn guidance', 'Turn Guidance & Destination'),
        image(indoorNavigation, 'indoor navigation screen'),
        image(navEta, 'live ETA', 'Live ETA & Accessibility'),
      ],
    },
    {
      eyebrow: '08 · Treatment Journey',
      heading: 'A Single Place to Understand What Happens Next',
      text: [
        'Current status, upcoming steps and treatments are organized around continuous progress rather than fragmented departments, so patients always know what comes next.',
      ],
      columns: 2,
      maxRowHeight: '70svh',
      media: [
        image(queuePanel, 'care pathway and queue tracker', 'Care Pathway & Queue Tracker'),
        image(dashboard, 'treatment status screen'),
      ],
    },
    {
      eyebrow: '09 · Product in Motion',
      heading: 'Experience ACHOTI in Action',
      text: [
        'Watch how intuitive transitions and empathetic guidance transform a daunting hospital visit into a calm, confident, and supported experience.',
      ],
      // Per Neama: her own walkthrough of the app, in a phone mockup (her
      // frame, its screen see-through; measured off the 790×1602 crop).
      layout: 'device',
      device: {
        frame: phoneFrame,
        overlay: true,
        width: 'min(100%, calc(80svh * 790 / 1602))',
        screen: { left: 4.94, top: 2.12, width: 90.13, height: 95.76, radius: '11.2% / 5.2%' },
      },
      media: [{ kind: 'video', note: 'ACHOTI walkthrough', src: walkthrough, poster: walkthroughPoster }],
    },
    {
      eyebrow: '10 · Final Experience',
      heading: 'From “Where Do I Go?” to “I Know What Happens Next.”',
      text: [
        'A human visual language and contextual guidance turn hospital navigation into a calmer, more understandable experience.',
      ],
      columns: 4,
      maxRowHeight: '70svh',
      media: [
        image(roleSelection, 'onboarding role'),
        image(indoorNavigation, 'indoor wayfinding'),
        image(dashboard, 'treatment pathway'),
        image(arrival, 'arrival guidance'),
      ],
    },
  ],

  footer: {
    label: 'END_OF_DISPATCH № 02',
    returnLabel: '← Return to Terminal',
  },
};
