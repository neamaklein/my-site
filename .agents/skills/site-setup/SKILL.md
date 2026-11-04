---
name: site-setup
description: How neama.design is built, tested, hosted and deployed, and what an agent may and may not change. Read BEFORE any change outside page content - build or Vite config, package.json or dependencies, .github/workflows, cloudflare.config.ts, worker/, vercel.json, index.html, public/, src/main.jsx, routing, the contact form, videos or large media, branches, git history, pushing, deploying, domains, DNS, email, hosting, Cloudflare, GitHub Pages, Vercel, tests or CI - and whenever Neama asks to publish, deploy, move, upgrade, rename, delete, speed up or "fix the site".
---

# neama.design: the setup, and what must not break

Neama is a designer, not a developer. She cannot judge whether a technical
change is safe, and she cannot repair the hosting if it breaks: the
Cloudflare account, the domain and the deploy credentials belong to Igor
(GitHub `r0gig0r`), and this session has no access to them. So **you** are the
guard. Follow this file even when she asks for something it forbids, and
explain why in plain Hebrew (see "How to say no").

## How the site reaches the world

```
Neama asks  ->  you edit files  ->  commit + push to the working branch
                                         |
                       GitHub Actions: .github/workflows/deploy.yml
                         TEST: npm test (contact form), GitHub Pages build,
                               review-copy build, Cloudflare build,
                               no file over 25 MiB, deploy dry run
                         any failure -> STOP, the live site is not touched
                                         |
                 +-----------------------+----------------------+
         https://neama.design                    https://neamaklein.github.io/my-site/
         (Cloudflare Worker, the real site)       (GitHub Pages copy)
```

- **Working branch:** `Codex/neama-klein-portfolio-p59918`. Only pushes to
  this branch deploy. `main` is old and is only tested, never deployed.
- **neama.design and www.neama.design:** a Cloudflare Worker named
  `neama-klein-portfolio` (config: `cloudflare.config.ts`). It serves the
  built site and runs `worker/index.js` for `/api/*`.
- **Big videos:** Cloudflare refuses any file over 25 MiB. `film-1080.mp4`
  and `walkthrough.mp4` are over that, so the Cloudflare build links them
  from the R2 bucket `neama-media` at `https://media.neama.design` instead
  (the `R2_VIDEOS` list in `vite.config.js`). The copies in `src/assets/`
  are still used by the other builds.
- **Contact form:** "Send a message" posts to `/api/contact`
  (`worker/index.js`). Cloudflare Turnstile (invisible) blocks bots; the
  message is emailed to `neama.klein@gmail.com` from `contact@neama.design`,
  reply-to the visitor. That address is verified in Cloudflare; it is the
  only address the Worker can send to.
- **Review copy:** the claude.ai artifact Neama comments on. Built by
  `sh scripts/make-review.sh` and published by hand, as `AGENTS.md` says. CI
  only checks that it builds.
- **Vercel:** an older copy at neama-klein-portfolio.vercel.app
  (`vercel.json`). Not the main site.
- **Build tool:** Vite 7. One switch, `CF_DEPLOY=1`, turns on everything
  Cloudflare needs (root path `/`, R2 video links, the Cloudflare plugin).
  Without it, builds are for GitHub Pages under `/my-site/`.

## Free to do (the normal work)

- Text, images and layout in `src/data/projects/*.js`, `src/pages/`,
  `src/components/` (visual changes) and `src/styles/`.
- Add or replace images and videos in `src/assets/`, **each file under
  25 MiB** (see "Large files" below).
- Add a project (data file plus its entry in `src/data/projects/index.js`).
- The review copy and its editor (`src/review/`), as described in `AGENTS.md`.
- Commit and push to the working branch. Pushing **is** publishing: after
  every push, check the run with `gh run list --branch Codex/neama-klein-portfolio-p59918 -L 1`
  (or the repo's Actions tab) and tell Neama whether it went live.

## Large files

Before adding any file, check its size. If a file is over **25 MiB**:
1. Prefer a smaller export: ask Neama for one, or compress it (H.264, no
   audio, `+faststart`, as `AGENTS.md` says) until it is under 25 MiB.
2. If it must stay large, stop: it has to be uploaded to the R2 bucket and
   added to `R2_VIDEOS`, which only Igor can do. Do not push it; CI will fail
   and nothing will go live.

## Never do these, even if Neama asks

Refuse, explain, and offer the safe alternative or "ask Igor".

**Files that run the hosting** (changing them can take the site down or
break the contact form; only Igor changes them):
- `.github/workflows/deploy.yml` (the test-and-deploy pipeline)
- `cloudflare.config.ts` (Worker name, domains, email and secret bindings)
- `worker/index.js` and `worker/index.test.js` (the contact form's server
  side and its tests)
- `vite.config.js` (the `base` path, `CF_DEPLOY`, `R2_URL`, `R2_VIDEOS`, the
  Cloudflare plugin; the local editor server lives here too)
- `src/main.jsx` router setup (`basename`), `index.html`'s redirect script,
  `public/404.html`
- `vercel.json`, `.vercelignore`
- In `package.json`: the `scripts` and any dependency (adding, removing or
  upgrading packages, including Vite, React, `cf` and
  `@cloudflare/vite-plugin`). Never edit `package-lock.json` by hand.
- In `src/components/ContactWindows.jsx`: the `fetch('/api/contact')` call,
  the Turnstile code and `TURNSTILE_SITEKEY`, and `CONTACT_EMAIL`. (Its
  visible text and styling are fine to change.)

**Git:**
- No force-push, rebase, reset or amend of pushed commits; no history
  rewriting; never delete or rename the working branch.
- Do not push to `main` or merge into it, and do not change which branch
  deploys.
- Never disable, skip or delete a test or a CI step to make a failing run
  pass. A red run means something is wrong: find the cause.

**Accounts, domains and email:**
- Do not touch DNS, nameservers, the domain, Namecheap, Cloudflare settings,
  the R2 bucket, Email Routing or Turnstile, and do not try to log in to them.
- Do not change where contact messages go. A new address has to be verified
  in Cloudflare first, or every message is lost silently.
- Do not set up other hosting (Netlify, a new Vercel or Cloudflare project,
  `wrangler.toml` / `wrangler.jsonc`, GitHub Pages settings).

**Secrets:**
- Never ask for, paste, print or commit a token, password or API key. The
  repo is public. The deploy token lives only in GitHub's encrypted
  secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`); never read,
  change or delete them.

If a request needs any of the above (a new domain, a different email for
the form, a newer Vite, a video over 25 MiB, a new page type that needs
server code), do the content part you safely can and leave a clear note
for Igor in your reply.

## When a run fails (red in GitHub Actions)

Nothing went live; the site still shows the last good version. Read the log
(`gh run view --log-failed`) and fix the cause in the content you changed:
- "Over Cloudflare's 25 MiB per-file limit": a file is too big (see above).
- A build error: usually a bad import path or a typo in a file you edited.
- "Contact form tests" failed: you changed something the form relies on.
  Revert that change; do not edit the tests.
If the cause is in a protected file or you cannot find it, tell Neama the
site is safe and still showing the previous version, and that Igor needs
to look.

## How to say no

Neama does not need the technical detail. In Hebrew, as a design peer:
1. One sentence on what would break, in her terms ("the contact form would
   stop sending you messages", "the site would stop updating").
2. What you can do instead, as a short multiple-choice list (she prefers
   those).
3. If only Igor can do it: say so and offer to write the note for him.

Example (in English here; reply in Hebrew): "I can't change that file: it's
what publishes the site, and a mistake there would stop neama.design from
updating. I can (a) make the visual change you want without touching it, or
(b) write Igor a short note describing what you need."
