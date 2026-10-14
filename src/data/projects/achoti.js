// Content transcribed verbatim from the "UX/UI_Amit - Neama" Figma Slides
// deck (PjkAvn1QVIZgqFMlEK0tk3, Neama Klein & Amit Tal), in its own
// language (Hebrew), mapped onto the DIMENSO case-study template.
// Slides kept, per Neama: the problem (2), conclusions (6), format (7),
// infrastructure (8), the characters (9, 26–27), logo, colours, type and
// icons (1, 22–25), wireframes (28) and mockups (29). Left out: 5W (3),
// competitor research (4–5), audiences, personas and journeys (10–21),
// the QR code (31) and the thank-you slide (32, used here as the hero).
//
// Images: the character illustrations are the originals embedded in
// Neama's UX UI.fig; everything built in Figma itself (logo, screens,
// wireframes, icons) is cropped from the deck render — swap for full-size
// exports when available. The explainer video (slide 30) isn't in the
// files yet: its slot shows in the review copy only.
//
// Not from the deck (structural labels only — rename freely):
//   meta labels/values, section headings "Mockups" / "Character" /
//   "Wireframes" / "Video" (kept in English like the other projects).
// Credits: Neama's name always comes first wherever a collaborator is named.

import hero from '../../assets/achoti/hero.jpg';
import logo from '../../assets/achoti/logo.png';
import logos from '../../assets/achoti/logos.png';
import lineup from '../../assets/achoti/lineup.png';
import wireframes from '../../assets/achoti/wireframes.png';
import mockups from '../../assets/achoti/mockups.png';

const character = import.meta.glob('../../assets/achoti/character/*.jpg', { eager: true, import: 'default' });
const icons = import.meta.glob('../../assets/achoti/icons/*.png', { eager: true, import: 'default' });

// Files are numbered in deck order, so sorting the paths keeps that order.
const inOrder = (files) =>
  Object.keys(files)
    .sort()
    .map((path) => files[path]);

const images = (files, notes) =>
  inOrder(files).map((src, index) => ({ kind: 'image', src, note: notes?.[index] ?? '' }));

export const achoti = {
  slug: 'achoti',
  dispatchNumber: '06',
  // Station-sign stripes beside the dispatch number: the project's colors.
  stripes: ['#00A79D', '#E1582C'],
  category: 'UX_UI',

  hero: {
    media: { kind: 'image', note: 'אחותי — logo, the app and its character', src: hero },
    scrollLabel: 'SCROLL_TO_UNBOX',
  },

  title: {
    tag: 'קורס UX/UI · נעמה קליין ועמית טל',
    name: 'אחותי',
    tagline: 'המלווה האישית שלך',
  },

  meta: [
    { label: 'Course', value: 'UX/UI' },
    { label: 'Team', value: 'Neama Klein · Amit Tal' },
    { label: 'Category', value: 'UX/UI' },
  ],

  strategy: {
    heading: 'Strategy',
    dir: 'rtl',
    lang: 'he',
    paragraphs: [
      { lead: 'הבעיה המרכזית:', text: ' התמצאות במרחבים רפואיים מורכבים (בתי חולים) היא חוויה מתסכלת, מלווה בחרדה גבוהה, אובדן זמן יקר, וקשיי ניווט פיזיים וקוגניטיביים. מטופלים ומלווים מגיעים במצבי לחץ (בין אם מדובר בבדיקה שגרתית, הגעה דחופה למיון, או ליווי לידה), מוצאים את עצמם הולכים לאיבוד בין מחלקות, מסדרונות ואגפים, ונאלצים להתמודד עם בירוקרטיה מסורבלת ותורים לא ברורים.' },
      { lead: 'המסקנות המרכזיות:', text: '' },
      { lead: 'ביטול החיכוך:', text: ' המשתמש לא צריך לחפש קודים או לשאול אנשים בדרך; האפליקציה חייבת ללוות אותו אוטומטית מרגע היציאה מהבית ועד לכיסא בחדר ההמתנה.' },
      { lead: 'התאמה למצבי חירום וסטרס:', text: ' עיצוב ממשק חייב להיות נקי, בעל ניגודיות גבוהה (כפי שבא לידי ביטוי בשפת המותג הטורקיזית-ירוקה), עם כפתורים ברורים ונגישים שמפחיתים עומס קוגניטיבי.' },
      { lead: 'הנגשת מידע מורכב:', text: ' שילוב בין ניווט פיזי מדויק לבין ניהול התיק הרפואי וההנחיות (אילו מסמכים צריך להביא, פענוח זמנים) תחת קורת גג דיגיטלית אחת.' },
      { lead: 'הפורמט:', text: ' אפליקציית מובייל ייעודית המרכזת את כל מסע המטופל – מהתכנון המוקדם בבית, דרך ההגעה והחניה, הניווט הפנימי במחלקות, ועד לסיכום הביקור.' },
      { lead: 'התשתית והטכנולוגיה:', text: '' },
      { lead: 'מפות פנימיות מובנות:', text: ' הסתמכות על מערכת מיפוי פנימית שטעונה מראש באפליקציה ומתעדכנת בענן, מה שמייתר לחלוטין את הצורך בסריקת QR פיזית בשטח בית החולים.' },
      { lead: 'ניווט פנים-מבני מתקדם:', text: ' שילוב אלמנטים של מציאות רבודה והכוונת צעדים מדויקת על גבי מסך הטלפון למציאת מחלקות, מעליות וחדרי בדיקה מורכבים.' },
      { lead: 'אוטומציה וסנכרון בזמן אמת:', text: ' חיבור למערכות הניהול של בית החולים המזהות את הגעת המשתמש (למשל בכניסה לחניה או למתחם) ומפעילות אוטומטית את צ׳ק-האין וההנווט ליעד הספציפי (תורים, יולדות או מיון).' },
    ],
  },

  brandBook: {
    heading: 'Graphic Index',
    labels: {
      element: 'Logo variations',
      primaryColors: 'צבעוניות ראשית',
      secondaryColors: 'צבעוניות משנית',
      fonts: 'פונט',
    },
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
    // Per Neama: each icon on its own, wrapping to fit the card.
    iconSet: inOrder(icons).map((src) => ({ src, name: '' })),
  },

  galleries: [
    {
      heading: 'Mockups',
      columns: 1,
      media: [{ kind: 'image', note: 'app screens', src: mockups }],
    },
    {
      heading: 'Character',
      text: [
        'מערכת האיורים מבוססת על דמויות מינימליסטיות, ידידותיות ועכשוויות, המייצגות את מגוון המבקרים והמלווים בבית החולים. הדמויות מאופיינות בפרופורציות מוארכות, הבעות פנים פשוטות ושפת גוף טבעית, תוך שימוש בפלטת צבעים מצומצמת של שחור, לבן, כתום וטורקיז. הן מופיעות במגוון סיטואציות יומיומיות בבית החולים, במטרה ליצור שפה חזותית אחידה, נגישה ומזמינה, המעניקה תחושת רוגע והתמצאות במרחב.',
      ],
      textDir: 'rtl',
      textLang: 'he',
      columns: 2,
      media: [
        { kind: 'image', note: 'the four characters', src: lineup },
        ...images(character, ['character poses', 'in the waiting room', 'arriving by car']),
      ],
    },
    {
      heading: 'Wireframes',
      columns: 1,
      media: [{ kind: 'image', note: 'wireframes', src: wireframes }],
    },
    {
      heading: 'Video',
      columns: 1,
      // TODO(Neama): the explainer video (slide 30) goes here.
      media: [{ kind: 'video', note: 'סרטון המחשה', reviewOnly: true }],
    },
  ],

  footer: {
    label: 'END_OF_DISPATCH № 06',
    returnLabel: '← Return to Terminal',
  },
};
