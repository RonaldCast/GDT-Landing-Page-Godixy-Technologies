# ADR-004: Motion with Three.js and anime.js

- Status: Accepted
- Date: 2026-10-25
- Owner: Gabriel Núñez (Solution Architect)

## Context

The brand calls for a distinctive, modern feel: a 3D hero and choreographed section animations. Motion must not hurt load performance (LCP, TBT), accessibility, or users who prefer reduced motion.

## Decision

- **Three.js** renders the hero scene inside `HeroScene.vue`, hydrated with `client:only` or `client:visible` and dynamically imported so it never blocks first paint.
- **anime.js v4** drives UI animations (section reveals, process steps, explorer transitions), loaded via dynamic import from `src/shared/motion`.
- Both libraries are self-hosted chunks (no CDN) and load only when motion is allowed.
- `prefers-reduced-motion: reduce` → no Three.js load, static hero fallback, animations skipped or reduced to instant state changes.
- Content is fully readable and usable without any animation.

## Alternatives considered

- **CSS-only animations**: lightest, but cannot deliver the 3D hero or complex timelines. Used where sufficient.
- **GSAP**: capable, but anime.js v4 is smaller and enough for the required timelines.
- **Motion One / Vue transitions only**: fine for simple reveals, weak for orchestrated sequences.
- **Pre-rendered video or Lottie hero**: heavier assets, not interactive, harder to theme.
- **Spline / hosted 3D embeds**: third-party runtime and CSP exceptions. Rejected.

## Consequences

- Three.js is the largest client dependency; it is isolated to one lazy island and must stay out of the critical path (verified with Lighthouse in E2E).
- Reduced-motion and no-WebGL paths must be tested explicitly (Playwright emulation).
- CSP must allow self-hosted script chunks and WebGL; no external origins needed.
- Motion helpers are centralized in `src/shared/motion` to keep features consistent.
