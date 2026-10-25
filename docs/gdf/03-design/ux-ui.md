# UX/UI Design Spec — Godixy Landing (F5 / G5)

Owner: Marcos Peralta (UX/UI). Status: **accepted via plan approval 2026-10-25**. Visual approval is not G7 technical acceptance. Implemented tokens use `#1A7088` for text-safe teal.
Inputs: `../Sources/style_guide.md`, `../Sources/Images/Logo.png`, references redpixel.io / synerxrd.com (direction only). No user research exists; flows below are assumptions to validate.
Stack: Astro + Vue islands, anime.js v4, Three.js hero, bilingual EN/ES.

## 1. Information architecture

Single page, anchor IDs identical in both locales; locale routes `/` (EN) and `/es/` (ES), switcher keeps the current hash.

| # | Section | Anchor | Island? | Primary goal |
|---|---|---|---|---|
| 0 | Skip link + sticky header | — | Vue (menu, lang) | Orient, navigate, CTA |
| 0a | Home intro overlay | — | Vue + Three.js (home only) | Brand mark assembles, then yields to the hero |
| 1 | Hero | `#top` | Vue + Three.js | Value prop, "Start a project" |
| 2 | Trust pillars | `#trust` | static + anime | Explicit scope, verifiable delivery, continuous support |
| 3 | Services explorer (6) | `#services` | Vue tabs | Find a matching service |
| 4 | How we work (GDF 10 phases, G1–G9) | `#process` | Vue timeline + tier toggle | Show rigor and predictability |
| 5 | Who we serve | `#audience` | static | Self-identification (Executives, IT teams, sizes) |
| 6 | About | `#about` | static | Mission, vision, 3 values |
| 7 | Engagement models (4) + support plans (3) | `#engagement` | static | Pick a way to work (no prices) |
| 8 | FAQ | `#faq` | Vue accordion | Remove objections |
| 9 | Contact form | `#contact` | Vue form | Convert |
| 10 | Footer | — | static | Legal, secondary nav |

Header nav (max 6): Services · Process · Who we serve · About · Engagement · FAQ; CTA scrolls to `#contact`.
Primary flow: Hero → Services → Process → Engagement → Contact. Every section ends at most one scroll from a CTA path.

## 2. Wireframes (desktop 1280, container 1200, 12 cols, gutter 24)

```
[0] HEADER (sticky, 72px, white; border-bottom + shadow after 8px scroll)
| [Logo]   Services Process Who About Engagement FAQ   [EN|ES] [Start a project] |
Mobile (<768): [Logo] .............. [EN|ES] [☰]  -> full-height sheet, links stacked, CTA bottom.

[0a] HOME INTRO (every visit to `/en/` and `/es/` only — not privacy/404)
Full-viewport navy (#101E38) overlay, z-index above the header. Center: Three.js
logoBlocks assemble into the Godixy mark, then crossfade to `/icon.png`.
Skip control bottom-center. Overlay exits upward; then the hero rises.
Reduced-motion / no-JS: overlay never shown; hero is visible on first paint.

[1] HERO (min-h 88vh, white -> soft-teal gradient bottom)
| LABEL: SOFTWARE DELIVERY, VERIFIED     |                                  |
| H1 (48/800, 2 lines max)               |   Three.js canvas: rounded navy  |
| Body lead (18, muted, 60ch)            |   + teal blocks, mouse parallax  |
| [Start a project] [See how we work]    |   (static PNG under reduced-mo.) |
| 3 counters: phases | gates | tiers     |                                  |
Mobile: canvas moves below copy at 280px height, counters 3-up small; no parallax on touch.

[2] TRUST PILLARS (surface bg)
| [icon] Explicit scope | [icon] Verifiable delivery | [icon] Continuous support |
Cards radius 8, 3-up; mobile 1-col stack.

[3] SERVICES EXPLORER
| LABEL / H2 / intro                                                     |
| Tablist (vertical, 4 cols)   |  Panel (8 cols, radius 12, soft-teal)   |
|  > Service 1 (active bar)    |  H3, description, deliverables list,    |
|    Service 2 ... Service 6   |  tags (pill), [Discuss this service]    |
Mobile: tablist becomes horizontal scroll-snap pill row above panel (still tabs pattern).

[4] HOW WE WORK
| H2  ............................ Tier toggle [Lite|Standard|Advanced]   |
| ●F1─◆G1─●F2─◆G2─ ... ─●F9─◆G9─●F10 (horizontal rail, phases as steps) |
| Detail card: phase name, purpose, outputs, gate criteria (tier-scaled)  |
Mobile: vertical rail, each phase a disclosure row; toggle full-width segmented control.

[5] WHO WE SERVE        | Executives card | IT teams card | Sizes: Startup·SMB·Enterprise pills |
[6] ABOUT               | Mission | Vision (2-col) / Values: 3 cards row |   Mobile: stack.
[7] ENGAGEMENT          | 4 model cards (2x2 desktop, 1-col mobile)    |
                        | Support: Essential | Business | Managed (3-up, feature checklist, "Talk to us") |
[8] FAQ                 | 8 cols centered, accordion rows, divider lines |
[9] CONTACT (navy bg)   | Left: H2 white, promise, email | Right: white panel radius 16 form |
                        | Name*, Email*, Company, Service (select), Message*, consent*, [Send] |
                        Mobile: copy above form, form full-width.
[10] FOOTER (navy)      | Logo in white field | nav | contact | © year · Privacy | EN|ES |
```

Breakpoints: `sm 480`, `md 768`, `lg 1024`, `xl 1280`. Section vertical padding: 64 desktop / 48 mobile. H1 scales to 36, H2 to 26 below 768.

## 3. Component inventory and states

All interactive elements: min target 44×44, visible `:focus-visible` ring (see §6), `cursor:pointer`, disabled = 50% opacity + `aria-disabled`.

| Component | Default | Hover | Focus | Active / selected | Loading | Success | Error | Empty |
|---|---|---|---|---|---|---|---|---|
| Button primary (navy bg, white) | navy | bg `--color-navy-700`, lift 1px | ring | pressed scale .98 | spinner + "Sending…", disabled | — | — | — |
| Button secondary (outline navy) | white | bg soft-teal | ring | scale .98 | — | — | — | — |
| Nav link | navy | text-teal underline grows | ring | `aria-current` underline (scroll-spy) | — | — | — | — |
| Lang switcher (2 links) | muted | navy | ring | current: navy bold, `aria-current="true"`, `lang` attr | — | — | — | — |
| Mobile menu | closed | — | trap focus inside | open, `aria-expanded` | — | — | — | — |
| Service tab | muted text | soft-teal bg | ring | navy text, 3px teal bar, `aria-selected` | — | — | — | — |
| Tier toggle (radiogroup) | outline | soft-teal | ring | navy fill, white text | — | — | — | — |
| Timeline step | grey node | node teal | ring | node navy + label bold, detail swaps | — | — | — | — |
| Card (pillar/model/plan) | white, border `--color-border` | border teal, shadow-md, lift 2px | ring (if link) | — | — | — | — | — |
| Accordion row | collapsed | bg surface | ring | expanded, chevron 180° | — | — | — | — |
| Text input / select / textarea | border `--color-border-strong` | border navy | ring + border navy | — | readonly during submit | green check icon | red border, icon + message below, `aria-invalid` | placeholder is hint only, label always visible |
| Form (whole) | idle | — | — | — | button loading, fields readonly | panel replaced by success message (focus moved to it) | top error summary listing links to fields; network error banner + retry | — |
| Hero canvas | animated | parallax | — | — | static poster until WebGL ready | — | WebGL fail → static poster | — |
| Home intro overlay | navy full-viewport, mark assembling | — | skip button ring (teal on navy) | — | WebGL assembling | overlay gone, hero rising | WebGL fail → static `/icon.png` then exit | — |
| Intro skip | white text, navy | underline | teal ring on navy | pressed | — | — | — | — |
| Tag / pill | soft-teal bg, text-teal | — | — | — | — | — | — | — |

Validation: on blur after first edit, and on submit. Messages localized; email format and required only. Honeypot field (hidden, `aria-hidden`) for spam.

## 4. Interaction and motion spec

Tokens: `--dur-fast 150ms`, `--dur-base 250ms`, `--dur-slow 600ms`, `--dur-hero 1200ms`; `--ease-out cubic-bezier(.22,1,.36,1)` (`outQuint`-like), `--ease-in-out cubic-bezier(.65,0,.35,1)`. anime.js: `ease: 'outQuint'`, `'inOutCubic'`.

| What | Trigger | Property | Duration / easing | Stagger |
|---|---|---|---|---|
| Home intro assemble | first paint on `/en/` `/es/` when motion allowed | `logoBlocks` scatter → home (Three.js) | 1600 outCubic (incl. stagger) | 40ms / block, last block home at 1600 |
| Home intro mark hold | assemble complete | canvas fade → `/icon.png` | 300 linear | — |
| Home intro exit | hold complete or Skip / Escape | overlay opacity 1→0, translateY 0→-8% | 400 outQuint | — |
| Section reveal (label, H2, intro, cards) | IntersectionObserver 20% visible, once | opacity 0→1, translateY 24→0 | 600 outQuint | 80ms per child, max 6 |
| Hero copy + visual intro | `data-intro=done` (or first paint if no intro) | opacity 0→1, translateY 24→0 | 800 outQuint | 80ms |
| Hero counters | in view, once | number 0→target | 1200 outQuint | 150ms |
| Hero blocks (Three.js) | after intro done + pointermove | blocks assemble from offset; parallax rotation ±6°, translate ±12px, lerp 0.08 | assemble 1200; idle float 6s loop | 60ms per block |
| Header shadow | scroll > 8px | box-shadow, bg opacity | 150 ease-out | — |
| Service tab change | click / arrow keys | panel crossfade + translateX 8→0 | 250 outQuint | list items 40ms |
| Timeline progress | section in view | rail fill scaleX 0→1 (vertical: scaleY) | 1200 inOutCubic | nodes 80ms |
| Timeline step select | click / keys | detail card fade/slide | 250 outQuint | — |
| Tier toggle | change | gate criteria list height + fade | 250 inOutCubic | 40ms |
| Accordion | toggle | grid-rows 0fr→1fr, chevron rotate | 250 inOutCubic | — |
| Buttons / cards | hover | translateY, shadow, bg | 150 ease-out | — |
| Form success | submit 2xx | panel fade-in, check icon draw | 600 outQuint | — |

Rules: animate only `transform`/`opacity` (plus accordion grid-rows); no scroll-jacking after the intro; content is visible without JS (reveal classes added by JS only). Three.js: pause on `visibilitychange` and when hero out of view; cap DPR at 2; **one WebGL renderer at a time** (dispose the intro renderer before hydrating the hero scene); target ≤ 60 blocks.

### 4.1 Home intro (increment 2026-10-25)

Approved plan: every visit to the landing (`/en/`, `/es/`). Privacy and 404 do not play it. Visual approval of this increment is not G7.

**First paint.** An inline script in `<head>` (home only) sets `document.documentElement.dataset.intro` to `playing` or, when `prefers-reduced-motion: reduce`, `done`. The overlay markup exists in the home HTML but is shown only while `playing` or `exiting`. Without JS the attribute is absent, the overlay stays hidden, and the hero is visible.

**Sequence (2.2–2.6 s).** `playing` (navy `#101E38` covers the viewport, `overflow: hidden`) → `logoBlocks` only (no satellites) assemble in 1600 ms → hold 300 ms while the canvas crossfades to `/icon.png` → `exiting` (overlay moves up and fades, 400 ms) → `done` + event `godixy:intro-done` → hero copy and `HeroScene` rise (`translateY` 24→0, 800 ms). Then the hero island may load Three.js.

**Skip.** Control always visible: EN “Skip intro” / ES “Saltar intro”. `Escape` does the same. Skip is WCAG 2.2.2 (pause/stop) for this non-essential motion. After skip or completion, move focus to `#hero-title` (`tabindex="-1"`).

**Fallbacks (no invented research; same policy as ADR-004).**

| Condition | Overlay | Three.js | Hero |
|---|---|---|---|
| `prefers-reduced-motion: reduce` | not shown (`done` at first paint) | none | visible immediately |
| Low-power or no WebGL (detected after hydrate) | static `/icon.png`, then exit | none | rises after short exit |
| JS disabled | not shown | none | visible |
| Privacy / 404 | not in the DOM | none | n/a |

**Acceptance notes for Sofía / Isabel**

- AC-INTRO-1 — `/en/` and `/es/` show the overlay when motion is allowed; `#hero-title` is not the first thing a sighted user sees.
- AC-INTRO-2 — Skip and Escape set `data-intro=done`, hide the overlay, reveal the hero, and focus `#hero-title`.
- AC-INTRO-3 — Reduced motion and no-JS: overlay not shown; hero readable.
- AC-INTRO-4 — `/en/privacy/`, `/es/privacy/`, and 404 have no `[data-intro-root]`.
- AC-INTRO-5 — Intro renderer is disposed before the hero scene imports Three.js.
- AC-INTRO-6 — Unskipped intro finishes in 2.2–2.6 s before the hero rise starts.

**prefers-reduced-motion: reduce** — no Three.js load (static poster image of blocks), no home intro, no parallax, reveals become instant (opacity only, 0ms), counters show final value, timeline rail drawn fully, accordion/tab changes instant. Skip on the intro covers WCAG 2.2.2 for that sequence; keep the in-page pause control on the looping hero scene.

## 5. Token mapping (CSS custom properties)

```css
:root {
  --color-navy: #101E38;      --color-navy-700: #1B2D50;  /* hover */
  --color-teal: #4EACC4;      /* decorative / on navy only */
  --color-text-teal: #1A7088; /* teal for text & UI on light bg */
  --color-soft-teal: #E2F4F6; --color-surface: #F5F7FA;
  --color-muted: #4A5668;     --color-white: #FFFFFF;
  --color-border: #D5DBE3;    /* decorative card borders */
  --color-border-strong: #8A94A6; /* form controls, 3.06:1 */
  --color-error: #B42318;     --color-success: #067647;
  --font-sans: 'Inter', system-ui, sans-serif;
  --fs-h1: 3rem; --fw-h1: 800; --fs-h2: 2rem; --fw-h2: 700;
  --fs-h3: 1.375rem; --fw-h3: 600; --fs-body: 1rem; --fs-label: .75rem; --fw-label: 500;
  --ls-label: .12em; /* style guide gives no value; proposed */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
  --radius-card: 8px; --radius-panel: 12px; --radius-lg: 16px; --radius-pill: 9999px;
  --shadow-sm: 0 1px 2px rgb(16 30 56 / .06);
  --shadow-md: 0 8px 24px rgb(16 30 56 / .10);
  --focus-ring: 0 0 0 2px var(--color-white), 0 0 0 4px var(--color-text-teal);
}
```

`--color-navy-700`, borders, error/success and `--ls-label` are proposed extensions not in the style guide — need approval.

## 6. Accessibility notes (target WCAG 2.2 AA)

Contrast (computed with the WCAG relative-luminance formula):

| Foreground / background | Ratio | Use |
|---|---|---|
| Teal #4EACC4 / white | 2.62 ✗ | Fails text and 3:1 UI — decorative only |
| Teal #4EACC4 / surface #F5F7FA | 2.44 ✗ | Decorative only |
| #1F7F99 / white · surface · soft teal | 4.61 · 4.30 ✗ · 4.06 ✗ | Rejected: fails on tinted surfaces |
| **Text teal #1A7088** / white · surface · soft teal | **5.65 · 5.26 · 4.98** | Labels, links, tags, focus ring |
| White / #1A7088 | 5.65 | Teal-filled buttons if needed |
| Navy / white · soft teal | 16.60 · 14.63 | Headings, body, primary button |
| Muted #4A5668 / white · surface · soft teal | 7.44 · 6.93 · 6.56 | Secondary text |
| Teal #4EACC4 / navy | 6.34 | Accents and labels on navy sections |
| Error #B42318 / white · Success #067647 / white | 6.57 · 5.69 | Form messages (always with icon + text) |
| Border-strong #8A94A6 / white | 3.06 | Input borders (non-text 3:1) |

- **Skip link**: first focusable element, "Skip to content" / "Saltar al contenido", visible on focus, targets `<main id="main" tabindex="-1">`.
- **Focus**: `:focus-visible` uses `--focus-ring` (2px white gap + 2px #1A7088); on navy sections use `#4EACC4` ring. Never `outline: none` without replacement. Sticky header: `scroll-padding-top: 88px` so focused targets aren't hidden (WCAG 2.4.11).
- **Services tabs** (WAI-ARIA Tabs, automatic activation): `role="tablist"` with `aria-orientation="vertical"` (horizontal on mobile), `role="tab"`, `aria-selected`, `aria-controls`, roving `tabindex` (0 on active, -1 others). Keys: Up/Down (or Left/Right when horizontal) move + activate, Home/End first/last, Tab moves into `role="tabpanel"` (`tabindex="0"`, `aria-labelledby`).
- **Timeline**: phases as a tablist-like list of buttons with `aria-current="step"`; gate markers have text labels ("Gate G3: contract"), not colour alone. Tier toggle = `role="radiogroup"` with arrow-key navigation; announce change via `aria-live="polite"` region.
- **Accordion**: each header is `<h3><button aria-expanded aria-controls>`; panel `role="region"` + `aria-labelledby`; Enter/Space toggle; multiple panels may stay open; hidden panels use `hidden` (not just height 0).
- **Mobile menu**: button with `aria-expanded`/`aria-controls`, focus trap, Esc closes and returns focus to trigger.
- **Form**: visible `<label>` per field, `autocomplete` (name, email, organization), required marked with text "(required)", errors linked by `aria-describedby`, error summary focused on failed submit, success message in `role="status"`.
- **Language**: `<html lang="en|es">`; switcher links use `hreflang` and `lang`; `<link rel="alternate" hreflang>` in head.
- **Canvas**: `aria-hidden="true"`; hero meaning carried by text. Icons decorative unless standalone.
- **Home intro**: `role="dialog"` + `aria-modal="true"` + `aria-labelledby` pointing at a visually hidden `role="status"` (EN/ES loading text). Skip is the only focusable control (44×44). On navy, focus ring is `#4EACC4`. After dismiss, overlay is `display: none`, `inert`, and `aria-hidden`. Do not play on inner pages.
- **Text**: rem units, works at 200% zoom and 320px width without horizontal scroll; line length ≤ 70ch.

## 7. Open decisions (human approval needed for G5)

1. Approve `#1A7088` as text teal and the proposed extension tokens (§5).
2. Final copy EN/ES for 6 services, 4 engagement models, 3 support plans, FAQ items (content owner).
3. Contact form backend/endpoint and consent/privacy text (Diego / Nicolás).
4. Hero poster image for reduced-motion and WebGL fallback (to be rendered from the Three.js scene).

Next owner: Sofía Herrera (frontend) after G5 approval; Isabel Medina to derive a11y/motion acceptance checks from §3–§6.

---

## Handoff — g5-intro-spec (F5 increment)

- **Task ID:** g5-intro-spec
- **GDF tier / phase:** Lite / F5 (design increment on G5 already approved 2026-10-25). This increment is **not** self-approved as a new G5 or G7.
- **Owner:** Marcos Peralta
- **Confirmed inputs:** Approved plan “Logo intro Three.js”; existing §4 motion tokens; ADR-004; `logoBlocks` in `src/features/hero/blocks.ts`; `/icon.png`.
- **Deliverable:** this file, §3 inventory rows, §4 table + §4.1, §6 intro bullet.
- **Evidence:** timings and fallbacks derived from the approved plan and ADR-004; no new user research.
- **Assumptions:** “Hero image” means the existing hero visual + copy, not a new photograph. Frequency is every landing visit (human choice 2026-10-25).
- **Unresolved:** Human visual check of the 3D mark vs `/icon.png`. Do not treat that check as G7.
- **Risks:** Dual WebGL if the hero hydrates during the intro; first-paint flash if `data-intro` is set after paint; existing E2E must skip or reduce motion.
- **Next owner:** Sofía Herrera (g6-intro-overlay, g6-hero-handoff, g6-verify).
