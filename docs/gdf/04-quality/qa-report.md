# QA report — G7 acceptance evidence

Prepared by: Isabel Medina (QA Engineer) · Date: 2026-10-25 · Build: local production build (`server.mjs`)

**Status: ready for human review. G7 is not approved until Godixy signs it off** (see the open items below).

## Automated results

| Check | Result |
| --- | --- |
| `astro check` + `vue-tsc` | 0 errors, 0 warnings, 0 hints |
| ESLint | 0 problems |
| Vitest | 43 / 43 passed |
| Playwright (desktop + mobile) | 29 / 29 passed; 56 / 56 on a 2× repeat (no flakes) |
| axe WCAG 2.2 AA, `/en/` and `/es/` | 0 violations |
| `npm audit` | 0 vulnerabilities |

### Lighthouse (local production server)

| Page | Profile | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/en/` | mobile (median of 3) | 97 | 100 | 100 | 100 | 2.3 s | 0 | 0–40 ms |
| `/es/` | mobile | 96 | 100 | 100 | 100 | 2.2 s | 0 | 100 ms |
| `/en/` | desktop | 99 | 100 | 100 | 100 | 0.7 s | 0.007 | 100 ms |
| `/es/` | desktop | 100 | 100 | 100 | 100 | 0.6 s | 0.008 | 0 ms |

The first mobile run after a cold server start scored 61 (TBT 1.5 s); three follow-up runs scored 96–98. Re-measure
on the Coolify deployment, where TLS and the proxy add latency.

## Acceptance criteria trace

| AC | Verdict | Evidence |
| --- | --- | --- |
| AC-01 browser language | Pass | `i18n.spec.ts` › language negotiation; `i18n.test.ts` › parseAcceptLanguage |
| AC-02 switcher keeps section, persists | Pass | `i18n.spec.ts` › switching language keeps the section and persists |
| AC-03 EN/ES parity | Pass | `i18n.test.ts` › dictionary parity |
| AC-04 keyboard + visible focus | Pass (automated part) | tabs, timeline, FAQ, menu, skip link specs; manual screen-reader pass pending |
| AC-05 reduced motion | Pass | `platform.spec.ts` › reduced motion |
| AC-06 Lighthouse ≥ 90 mobile | Pass | table above |
| AC-07 no unapproved claims | Pass, needs content sign-off | `i18n.test.ts` › content guardrails; "within two business days" removed |
| AC-08 hero CTAs | Pass | `sections.spec.ts` › hero CTAs |
| AC-09 trust pillars = values | Pass (fixed) | `sections.spec.ts` › trust pillars; each pillar now carries its value label |
| AC-10 six services, ARIA tabs | Pass | `sections.spec.ts` › services tabs |
| AC-11 scope items | Pass | `i18n.test.ts` › includes the scope items from the brief |
| AC-12 10 phases, G1–G9, phase 10 ongoing | Pass | `sections.spec.ts` › GDF timeline |
| AC-13 three tiers | Pass | `sections.spec.ts` › GDF tiers |
| AC-14 audiences | Pass | Audience section (company sizes, executives, IT teams) |
| AC-15 mission, vision, values | Pass | `sections.spec.ts` › values |
| AC-16 four models, three plans | Pass | `i18n.test.ts` › four engagement models and three support plans |
| AC-17 no prices/SLAs/figures | Pass | `i18n.test.ts` › content guardrails |
| AC-18 FAQ keyboard | Pass | `sections.spec.ts` › FAQ (native `<details>` exposes expanded state) |
| AC-19 one email per valid submission | Pass (unit) / pending (real SMTP) | `contact.test.ts` › sends exactly one email; real send in G8 smoke test |
| AC-20 inline errors, focus, data kept | Pass | `contact.spec.ts` › invalid submission |
| AC-21 honeypot | Pass | `contact.test.ts` › silently drops honeypot submissions |
| AC-22 failure + fallback address | Pass | `contact.spec.ts` › server failure keeps the data |
| AC-23 submit disabled while sending | Pass | `contact.spec.ts` › submit is disabled while sending |
| AC-24 footer incl. privacy link | Pass (fixed) | `sections.spec.ts` › footer; new `/en/privacy/`, `/es/privacy/` |
| AC-25 lang, canonical, hreflang | Pass | `i18n.spec.ts` › hreflang; x-default points to the negotiating root `/` |

## Defects found and fixed during G7

1. **AC-09** — pillars showed "Explicit scope / Verifiable delivery / Continuous support" without the values.
   Each pillar now shows its value (Precision, Continuity, Clarity) above its title.
2. **AC-24** — no privacy link. Added a bilingual privacy notice describing only what the site actually does
   (form fields, email delivery, in-memory rate limiting, one `lang` cookie, no analytics).
3. **AC-02** — the switcher only kept an existing URL hash. It now opens the other language at the section
   currently in view, including on the privacy page.
4. **AC-07** — "reply within two business days" was an unapproved commitment; rephrased in both languages.
5. **NV-04 / AC-16** — consent label had no privacy link. Added `consentPrivacy` in both dictionaries and a link to `/en/privacy/` and `/es/privacy/`.
5. **NV-04 / AC-16** — consent label had no privacy link. Added `consentPrivacy` in both dictionaries and a link to `/en/privacy/` and `/es/privacy/`.

## Open items for human review (block G7 sign-off)

- **Privacy notice text** must be reviewed by Godixy (and legal counsel if applicable) before publication.
- **Content sign-off** of both languages (tone, legal name, service descriptions).
- **Manual accessibility pass** with VoiceOver and NVDA, and real-device checks (see `test-plan.md`).
- **AC-19 real delivery** — verify on staging with SMTP credentials.

## Screenshots

- `evidence/en-hero-desktop.png`, `evidence/es-hero-mobile.png`
- `evidence/en-pillars.png` (AC-09 fix)
- `evidence/es-privacy.png` (AC-24 fix)
