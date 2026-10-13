# Neama Klein portfolio

React + Vite site, deployed to GitHub Pages (`base: '/my-site/'`). Work happens on
branch `claude/neama-klein-portfolio-p59918`.

## Working with Neama

- Reply in Hebrew, as a design peer. She prefers multiple-choice questions.
- Text from her Figma or decks is final: never rewrite it, never invent copy.
- Don't add elements or animations she didn't ask for; check with her before
  major layout changes.
- Her name always comes first in credits.

## Projects

- Data: `src/data/projects/*.js`, listed in `src/data/projects/index.js`
  (`comingSoon` reserves dispatch numbers for projects not built yet).
- Assets: `src/assets/<slug>/`. Videos: H.264, no audio, `+faststart`.
- DIMENSO source: Figma file `RzHu5E5HREe8x9XzR8aF0j` (Portfolio).

## Review copy (claude.ai artifact)

Neama comments on a review copy published as a claude.ai artifact:
https://claude.ai/artifact/QHioNtRsrjth9wFGNvipmy

- Build: `sh scripts/make-review.sh` → `review-build/` (hash routing; the
  walkthrough is swapped for a 720p copy, since artifact files cap at ~15MB).
- Publish `review-build/index.html` with `root: review-build` to that URL;
  pass new asset files in `files` and `null` for removed ones.
- Review-only code is gated by `REVIEW` in `src/review/flags.js` (the in-page
  editor in `src/review/`). Her edits live in the artifact db, collection
  `media`; once a change is baked into the site, delete its doc.
- For each comment: change the site, commit and push, rebuild and publish,
  reply in the thread in Hebrew and resolve it (unless the reply asks her
  something).
