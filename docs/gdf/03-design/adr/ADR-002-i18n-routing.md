# ADR-002: i18n routing and typed dictionaries

- Status: Accepted
- Date: 2026-10-25
- Owner: Gabriel Núñez (Solution Architect)

## Context

The site must serve English and Spanish with indexable, shareable URLs per language, remember the visitor's choice, and guarantee that both languages always have the same content keys.

## Decision

- Astro i18n config: `locales: ['en','es']`, `defaultLocale: 'en'`, `prefixDefaultLocale: true`, `redirectToDefaultLocale: false`.
- `src/pages/[lang]/index.astro` prerenders `/en/` and `/es/` via `getStaticPaths`.
- `src/pages/index.ts` is on-demand (`export const prerender = false`) and returns a 302 to `/en/` or `/es/`, choosing by: cookie `lang` → `Accept-Language` → default `en`.
- `LanguageSwitcher.vue` sets the `lang` cookie and navigates to the other locale.
- Content lives in typed dictionaries `src/shared/i18n/en.ts` and `es.ts`; `es` is typed against the shape of `en`, so missing or extra keys fail compilation. Helpers in `src/shared/i18n/utils.ts`.

## Alternatives considered

- **Unprefixed default locale (`/` = EN)**: asymmetric URLs and harder cookie-based redirect logic. Rejected.
- **Astro `redirectToDefaultLocale: true`**: always sends `/` to EN, ignoring cookie and browser language. Rejected.
- **Client-side language detection**: causes a flash of the wrong language and is invisible to crawlers.
- **JSON files or i18n library (vue-i18n, i18next)**: no compile-time parity check without extra tooling; runtime cost in islands.
- **Content collections per locale**: more structure than a single-page site needs.

## Consequences

- Each locale is static HTML with its own `lang` attribute and `hreflang` alternates; good for SEO and caching.
- `/` requires the Node server (one on-demand route); cheap and uncached by design (302, varies by cookie and `Accept-Language`).
- Dictionary parity is enforced by `astro check`/`tsc`; translators edit TS files, not a CMS.
- Adding a locale means: config entry, dictionary typed against `en`, `getStaticPaths` entry and redirect rule update.
