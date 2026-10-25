# ADR-001: Astro islands with Vue 3

- Status: Accepted
- Date: 2026-10-25
- Owner: Gabriel Núñez (Solution Architect)

## Context

The landing page is mostly static marketing content in two languages, with a handful of interactive parts (3D hero, services explorer, GDF process, FAQ, contact form, language switcher, mobile nav). Core Web Vitals and SEO matter more than app-like navigation. The team's frontend standard (GDF 5.2) is Vue 3 + TypeScript.

## Decision

Use Astro 5 as the page framework and Vue 3 (`@astrojs/vue`) only for interactive islands:
`HeroScene.vue`, `ServicesExplorer.vue`, `GdfProcess.vue`, `ContactForm.vue`, `LanguageSwitcher.vue`, `MobileNav.vue`. (Implementation note: the FAQ uses native `<details name="faq">` instead of a `FaqAccordion.vue` island; it is keyboard-accessible and ships zero JS.)
All other sections are static `.astro` components shipping no JavaScript. Code is organized by feature (`src/features/*`) with cross-cutting code in `src/shared/*`.

## Alternatives considered

- **Vue 3 SPA (Vite)**: matches the GDF default but ships the whole app as JS and needs extra work for SEO/prerendering. Rejected.
- **Nuxt 3 (SSG/SSR)**: good SEO, but hydrates the full page by default; heavier than needed for a few widgets.
- **Plain HTML + vanilla JS**: minimal payload, but loses component reuse, typing and team familiarity with Vue.
- **Astro with React/Svelte islands**: technically equivalent; rejected to stay on the team's Vue skill set.

## Consequences

- Minimal JS per page; each island hydrates independently with its own directive.
- Islands cannot share reactive state implicitly; pass data via props (e.g. translated strings) and keep islands self-contained.
- Two component models (`.astro` and `.vue`) to maintain; boundary rule: use Vue only when client interactivity is required.
- Both models run under TypeScript strict and are verified by `astro check` and ESLint.
