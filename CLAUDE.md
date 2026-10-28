# Neama Klein portfolio

React + Vite site, live at https://neama.design (Cloudflare) with a copy on
GitHub Pages (`base: '/my-site/'`). Work happens on branch
`claude/neama-klein-portfolio-p59918`; every push there is tested and deployed
automatically.

**Before changing anything other than page content (config, packages,
workflows, `worker/`, routing, the contact form, big media, git branches or
history, hosting, domains), read `.claude/skills/site-setup/SKILL.md` and
follow it.** It lists what must never be changed, even on request.

## Open suggestion for Neama (raise it once, then remove this section)

At the start of the next session, before her request, tell Neama briefly
(in Hebrew, multiple choice, in her terms):

- Her new home films are HEVC only. Visitors whose browser can't play HEVC
  (often Firefox, some Windows PCs) see just the still image and the film
  doesn't move when they scroll, and laptops are where most people view
  portfolios.
- Suggest a fallback: browsers that can play HEVC keep her new files, the
  rest get the earlier H.264 films, so nobody loses the film. Her design and
  her files stay as they are.
- Also mention, as a separate option: re-exporting with a keyframe every 12
  frames (wide) / 6 (phone) would make scrolling smoother; hers have one
  every 45.

Offer: (a) add the fallback, (b) also re-export with more keyframes, (c)
keep it as it is. Do what she picks (how-to: the site-setup skill, "Video
formats"), then delete this section in the same commit and push. If she
picks (c), delete this section and note her choice in the comment above
the `<video>` in `src/components/DispatchFilm.jsx`.

## Working with Neama

- Reply in Hebrew, as a design peer. She prefers multiple-choice questions.
- Text from her Figma or decks is final: never rewrite it, never invent copy.
- Don't add elements or animations she didn't ask for; check with her before
  major layout changes.
- Her name always comes first in credits.

## Projects

- Data: `src/data/projects/*.js`, listed in `src/data/projects/index.js`
  (`comingSoon` reserves dispatch numbers for projects not built yet).
- Assets: `src/assets/<slug>/`. Videos: H.264, no audio, `+faststart`; HEVC
  only with an H.264 fallback (see the site-setup skill, "Video formats").
- DIMENSO source: Figma file `RzHu5E5HREe8x9XzR8aF0j` (Portfolio).

## Review copy (claude.ai artifact)

Neama comments on a review copy published as a claude.ai artifact:
https://claude.ai/artifact/QHioNtRsrjth9wFGNvipmy

- Build: `sh scripts/make-review.sh` → `review-build/` (hash routing; the
  walkthrough and the home film are swapped for lighter copies in `scripts/review/`,
  since artifact files cap at ~15MB).
- Publish `review-build/index.html` with `root: review-build` to that URL;
  pass new asset files in `files` and `null` for removed ones.
- Review-only code is gated by `REVIEW` in `src/review/flags.js` (the in-page
  editor in `src/review/`). Tools → Wide / Mobile shows the whole site in a
  phone-sized frame (`src/review/PhonePreview.jsx`). Edits made there are
  phone-only: same key plus `~m`; bake them into the phone (max-width) styles. Her edits live in the artifact db, collection
  `media`; once a change is baked into the site, delete its doc.
- Local editing: `npm run edit` (port 5174, hash routing) runs the same
  editor on Neama's machine; records go to `review-local/media.json` and
  uploads to `review-local/blobs/` (gitignored), same keys as the db. Bake
  them the same way, then remove the record.
- For each comment: change the site, commit and push, rebuild and publish,
  reply in the thread in Hebrew and resolve it (unless the reply asks her
  something).
