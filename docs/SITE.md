# Neama Klein — Portfolio site

A React + Vite single-page site. The live copy is on GitHub Pages under
`/my-site/`; the working branch is `claude/neama-klein-portfolio-p59918`.

## Run it

```sh
npm install
npm run dev        # local development
npm run build      # production build into dist/ (base /my-site/)
npm run preview    # serve the build
npm run edit       # the in-page editor on your machine (port 5174)
```

The zip also holds `dist/`, a ready build: serve that folder from a web server at
the path `/my-site/` (it uses real URLs, not `#`).

## How the site is organised

| Where | What |
| --- | --- |
| `src/pages/Home.jsx` | The home page: the Creative Dispatch film. |
| `src/pages/CaseStudy.jsx` | One page per project, built from its data file. |
| `src/data/projects/*.js` | Each project's words, media and layout. `index.js` sets the order (the film's stations). |
| `src/assets/<project>/` | Each project's images and videos. `src/assets/home/` holds the film. |
| `src/components/` | The building blocks (below). |
| `src/styles/` | `tokens.css` (colours, type, spacing) and `global.css` (fonts, base styles). |
| `src/review/` | The review-only editor (never in the live site). |
| `scripts/` | `make-review.sh` builds the claude.ai review copy. |

### Home: the film

`DispatchFilm.jsx` plays the film by scrolling: down plays forward, up plays back.

- **Versions:**
  - wide screens: 1080p
  - small landscape screens: 720p
  - phones held upright: the vertical cut
- **The board along the bottom:** lists all seven dispatches. It appears once
  the camera passes the printer, and each name opens its project.
- **Station labels** (`StationLabel.jsx`): appear beside each model as the
  camera reaches it.
- **The last frame** (review copy only):
  - Instagram, LinkedIn and Contact open the contact windows (`ContactWindows.jsx`).
  - The name card plays the zoom onto the card and opens About me
    (`NameCardZoom.jsx`). Back plays the zoom in reverse.
- **Coming back from a project** returns to that project's station.

### Project pages

Every project page is assembled from its data file:

- `Hero` — the opening picture or video.
- `TitleBlock` and `MetaGrid` — the name, tagline and project details.
- `Gallery` — the image and video sections. Its layouts:
  - `columns` — rows of N, with `phoneColumns` for phones
  - `lead` — one large item with small ones below; clicking a small one swaps it in
  - `device` — a video inside a phone or laptop frame
  - `stack`
- `BrandBook` — the Graphic Index: logo, morphology, colours, icons and fonts.
  A font can carry a `specimen`, which shows the sample as outlines so it
  appears without the font installed.
- `Process`, `SpatialRenders`, `Strategy`, `Feature` — special sections for
  particular projects.

### Projects (dispatch order)

1. DIMENSO
2. ACHOTI (with Amit Tal)
3. PALATE
4. Spin & Sip
5. Next October
6. Rocksé
7. Wheel of Time

## Design tokens

- **Type:** Montserrat (Regular and Bold) throughout. The files are in
  `src/assets/fonts/` with their open licence.
- **Colour:**
  - `--color-frame: #52146a` — the purple of the film's space, a little more saturated
  - `#ecdfd0` — the beige of the windows

## The review copy and the editor

- **The review copy** is a claude.ai artifact. `sh scripts/make-review.sh` builds it into
  `review-build/` with `#` routing. The heaviest videos are swapped for the
  lighter copies in `scripts/review/`, because artifact files are capped at about 15MB.
- **The in-page editor:** under **Tools → Edit** you can pick any element and change it.
  Edits are saved to the artifact's database (or to `review-local/` with
  `npm run edit`) and are later built into the site for real.
- **Tools → Wide / Mobile:** shows the whole site in a phone-sized frame. Edits
  made there apply to the phone layout only.
