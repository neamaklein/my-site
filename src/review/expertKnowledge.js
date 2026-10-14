// The expert scan's reference library. The in-page expert cannot browse
// or load skills at run time, so the rules it judges by are compiled here
// from this project's design skills and from web research (sources
// listed per section). Update this file when the sources change.

export const EXPERT_KNOWLEDGE = `
[A] TASTE — anti-generic rules (Taste skill; Artifact design guidance)
- Reject the default AI look: centered hero by default, purple/blue gradients as a default color, rounded corners on every element, generic sans stacks with no typographic intention, emoji as section markers, accent bars on rounded cards, warm cream + serif + terracotta, near-black + one acid accent, broadsheet hairline rules with dense columns.
- Every visual decision needs a reason rooted in the subject. Name the one thing the page will be remembered by; if nothing stands out, that is a finding.
- Boldness spent in one place; everything around it quiet.
- Structure is information: numbering, eyebrows, dividers and labels must encode something true (01/02/03 only for a real sequence).
- Repeated elements share edges, baselines and inner padding; nothing stretches over empty space or sits alone in a row.
- Running text near 65 characters per line; a set type scale; headings balanced; uppercase labels slightly tracked.
- Size a hero to its content; the first still frame must already say what the page is.
- Remove one accessory: ask what can go without loss.

[B] APPLE HUMAN INTERFACE GUIDELINES — principles and foundations (apple-design skill; HIG pages typography.md, layout.md, color.md, branding.md, design-principles.md, accessibility.md, motion.md). For a website, apply the principles and foundations, not app-platform conventions.
- Principles: Purpose, Agency, Responsibility, Familiarity, Flexibility, Simplicity ("Be clear and direct" — every element earns its place), Craft ("Care about every detail" — spacing, alignment, wording), Delight ("Make it human" — not decoration).
- typography.md: "Minimize the number of typefaces you use, even in a highly customized interface." Avoid light/thin weights at small sizes. Hierarchy from weight, size and color. Desktop text default 13pt, minimum 10pt (about 13px minimum on the web).
- layout.md: "Make essential information easy to find by giving it sufficient space." "Extend content to fill the screen or window" (full-bleed artwork). "Place items to convey their relative importance" (most important near the top and leading side). Align components to communicate hierarchy. Progressive disclosure instead of density. When artwork meets a different aspect ratio, "don't change the aspect ratio of the artwork; instead, scale it so that important visual content remains visible."
- branding.md: "Ensure branding always defers to content." Use a custom font for headlines and the system font for body. Don't repeat the logo everywhere.
- color.md: one color means one thing; colors must work in light and dark; never color alone to convey meaning.
- accessibility.md: text contrast 4.5:1 up to 17pt, 3:1 for 18pt+ or bold; motion optional and respectful of reduced motion; nothing conveyed by color alone.
- motion.md: motion purposeful, brief, never the only carrier of meaning, rare on frequent interactions.

[C] WEB STANDARDS (WCAG 2.2 summaries; web.dev "Serve responsive images")
- Contrast AA: 4.5:1 body text, 3:1 large text (18pt / 14pt bold and up). Text must survive 200% zoom without horizontal scrolling; content reflows at 400%.
- Line length: 60–75 characters for body text in practice; WCAG AAA caps it at 80. Don't fully justify text. Leading at least 1.5 within paragraphs for long text.
- Images: serve sizes matched to the display (srcset with width descriptors + sizes; 4–6 widths); set width/height or aspect-ratio to prevent layout shift; never lazy-load the main (LCP) image. An image shown larger than its pixels (sharpness < 1) looks soft; below about 0.75 it looks blurry, especially on retina screens.

[D] WHAT BRANDING STUDIOS WANT FROM A JUNIOR PORTFOLIO (web research, 2026)
- Creative Boom, "In 2026, here's what creative recruiters are looking for in juniors": explain the thinking behind the work ("can you explain your thinking behind the work?" — Matt Redway, PlayStation); work "doesn't have to be perfect or polished, but it does have to be unexpected and meaningful" (James McNaught, Wolff Olins); "a personal viewpoint" (Tom Muller, helloMuller); "raw ideas, raw visuals, the weird stuff" (James Le Beau-Morley); "Anyone can execute a beautiful bit of work these days" — the big idea and the why set juniors apart (Daniel Poll, Noramble). Red flag: a strong portfolio whose maker can't explain their decisions.
- The Brand Identity, "What do studios look for in junior designers?" (Justified Studio, Only, The District): originality — "something we haven't seen before"; "Simple, powerful ideas"; adaptability across styles and audiences; a "tight as hell" grasp of "type, grids, balance and touch"; write what made each project work, then cut it until it is "as clear and as concise as you can make it" — reviewers are "time-poor"; make the portfolio easy to open.
- Case-study structure reviewers look for (UX Planet; UX Design Institute; NN/g advice via summaries): context → problem/brief → your role and collaborators → key decisions and trade-offs → outcome. Screens alone don't show scope or ownership: state what you owned. Reviewers often skim only one or two case studies, often in under three minutes per portfolio on first pass: lead with the best work.

[E] NEAMA'S OWN STANDARDS
- "Design is planning": design organizes experience; beauty is a byproduct of correct thinking.
- Originality over the derivative and banal; boldness grounded in grid, composition and proper typography; rules bent on purpose, never carelessly. Typography is central.
- She is aiming for a branding role at a studio or tech company, later her own studio.
`;
