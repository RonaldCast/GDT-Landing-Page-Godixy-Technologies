# Test plan — Godixy landing page

Owner: Isabel Medina (QA Engineer) · GDF tier: Lite · Gate: G7 (acceptance)

## Scope

The bilingual landing page (`/en/`, `/es/`), the privacy notice (`/en/privacy/`, `/es/privacy/`), the
language-negotiating root (`/`), the contact Astro Action, the health endpoint and the custom Node server
headers. Out of scope: real SMTP delivery (needs production credentials; covered by the G8 smoke test in
`docs/gdf/05-release/`).

## Levels

| Level | Tool | Where | Command |
| --- | --- | --- | --- |
| Static | `astro check`, `vue-tsc`, ESLint | whole repo | `npm run check && npm run lint` |
| Unit | Vitest | `tests/unit/` | `npm test` |
| End-to-end | Playwright (Chromium desktop + Pixel 7) | `tests/e2e/` | `npm run test:e2e` |
| Accessibility | axe-core (WCAG 2.0/2.1/2.2 A + AA) inside Playwright | `tests/e2e/platform.spec.ts` | `npm run test:e2e` |
| Performance / SEO | Lighthouse (mobile + desktop) | `/en/`, `/es/` | see "Lighthouse" below |

`npm run verify` runs static checks, unit tests and the production build in one go.

Playwright builds the site and starts `server.mjs` on port 4399 with SMTP disabled, so the contact form
exercises its "unavailable" path. Set `E2E_BASE_URL` to run the same suite against a deployed environment
(for example the Coolify preview) without starting a local server.

## What each suite covers

- `tests/unit/i18n.test.ts` — Accept-Language parsing with q-values, cookie precedence, URL helpers, EN/ES
  dictionary parity (same keys and list lengths, no empty strings, no untranslated prose), and a guardrail that
  no price, percentage, hour or business-day figure appears in the copy.
- `tests/unit/contact.test.ts` — Zod schema (each field's rule, defaults, trimming, every error key has
  localized copy), sliding-window rate limiter, email builder (header-injection and HTML-escape), the
  `handleContact` flow (send once, honeypot, rate limit, unavailable in production, logged in development,
  transport failure) and the `mailto:` fallback.
- `tests/e2e/i18n.spec.ts` — redirects from `/`, `lang` attributes, the switcher keeping the current section
  and persisting via cookie, hreflang/canonical.
- `tests/e2e/sections.spec.ts` — hero CTAs, trust pillars, services tabs (keyboard), service-to-contact
  preselection, GDF timeline and tiers, FAQ keyboard, values, footer with privacy link, 404.
- `tests/e2e/contact.spec.ts` — inline validation and focus, failure alert with `mailto:` fallback, disabled
  submit while sending, cross-origin action rejection.
- `tests/e2e/platform.spec.ts` — health check, security headers and CSP meta, no console/CSP errors, skip link,
  3D hero goes live, reduced motion keeps the static hero, axe scans (EN and ES).
- `tests/e2e/mobile.spec.ts` — mobile menu (open, Escape returns focus, closes on navigation), no horizontal
  overflow.

## Lighthouse

```sh
npm run build && PORT=4399 node server.mjs &
npx lighthouse http://127.0.0.1:4399/en/ --chrome-flags="--headless=new" --view
npx lighthouse http://127.0.0.1:4399/es/ --chrome-flags="--headless=new" --view
```

Run each URL at least three times and take the median: the first run after a server start is cold.

## Manual checks before G7 sign-off

1. Screen reader pass (VoiceOver on macOS Safari, NVDA on Windows Firefox) of the services tabs, the GDF
   timeline and the contact form errors.
2. Real-device check on iOS Safari and Android Chrome (3D hero, mobile menu, form keyboard types).
3. Content review of both languages by Godixy (tone, legal name, privacy notice text).
4. One real submission on the staging deployment with SMTP configured (AC-19).
