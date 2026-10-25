# Project Brief — Godixy Technologies Corporate Landing Page

| Field | Value |
| --- | --- |
| Client | Godixy Technologies (internal project) |
| Owner / approver | Ronald Castillo |
| Plan approval | 2026-10-25, covers G1–G5 scope and design decisions |
| Pending gates | G7 acceptance, G8 production deploy, G9 closure (human approval required) |
| Orchestrator | Elena Cruz (recommends dispatch; the parent coordinator dispatches) |
| Sources | `../Sources/GDF.md`, `../Sources/style_guide.md` |

## 1. GDF tier classification

**Tier: GDF Lite, with one Standard-level element (the contact form).**

Justification (GDF §9: classify by complexity, data, integrations and failure impact, not price):

- **Complexity:** low. A marketing site with a handful of prerendered pages in two locales. GDF lists "landing page, página corporativa" as Lite examples.
- **Integrations:** one outbound integration (SMTP via nodemailer). No database, no user accounts, no third-party APIs.
- **Data:** the contact form handles personal data (name, email, company, message) and the server holds an SMTP secret. This is the only part that needs Standard-level controls: validation, abuse protection, secret handling and security review.
- **Failure impact:** moderate reputational impact if the site is down or the form leaks or spams; no transactional or regulated data.

Controls are scaled accordingly: Lite documentation, design and deploy checklist for the site as a whole; Standard rigour (automated tests, security review, documented rollback) for the contact action.

## 2. Objectives

1. Present Godixy Technologies credibly to companies of all sizes, executives and IT teams.
2. Convert visitors into qualified leads through a reliable, secure contact form.
3. Apply the brand style guide (navy `#101E38`, teal `#4EACC4`, Inter, rounded modular geometry).
4. Serve English and Spanish content with correct locale detection.
5. Deliver strong performance, accessibility and SEO despite a 3D hero and animations.
6. Make the site self-hostable on Coolify with a repeatable Docker deploy and rollback.

## 3. Scope

### In scope

- Astro 5 site, TypeScript strict, Vue 3 islands for interactive parts.
- Three.js hero scene and anime.js v4 animations, with `prefers-reduced-motion` fallbacks.
- Astro i18n: `/en/` and `/es/` prerendered; root `/` redirects by locale cookie, then `Accept-Language`, then a default.
- Contact form via Astro Actions: Zod validation, honeypot, rate limiting, nodemailer delivery, secrets via `astro:env`.
- `@astrojs/node` standalone output, Dockerfile, Coolify deployment runbook.
- SEO basics (meta, Open Graph, hreflang, sitemap), WCAG 2.2 AA target.
- README and Spanish handover package.

### Out of scope

- CMS, blog engine, user accounts or admin panel.
- Database or CRM integration (emails only).
- Locales beyond English and Spanish.
- Paid analytics or marketing automation setup.
- Ongoing content production and copywriting beyond the initial pages.
- Phase 10 support SLA (to be agreed separately).

## 4. Constraints

- Brand: must follow `style_guide.md` (colors, typography, spacing scale 4–64px, radii 8/12/16px/pill).
- Stack is fixed by the approved plan; changes require a change request to Ronald Castillo.
- Hosting: Coolify with Docker; Node runtime required for the contact action.
- Secrets (SMTP credentials) never committed; injected only through Coolify environment variables.
- No external writes, production deploys or client-facing sends without explicit human approval.
- Human-facing handover documentation in professional Spanish; agent artifacts in English.

## 5. Risks register

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- |
| R1 | Contact form abused for spam or email flooding | Medium | Medium | Honeypot, per-IP rate limit, Zod length limits, no user-controlled headers | Diego Rojas / Nicolás Vega |
| R2 | SMTP secret leaked through repo, logs or client bundle | Low | High | `astro:env` server secrets, `.env` git-ignored, log redaction, security review | Nicolás Vega |
| R3 | Three.js hero hurts LCP, battery or low-end devices | Medium | Medium | Lazy client island, static poster fallback, reduced-motion and WebGL-unsupported paths, perf budget | Sofía Herrera |
| R4 | Locale redirect breaks SEO or caching (redirect loops, wrong canonical) | Medium | Medium | Prerendered locale pages, hreflang, 302 only at `/`, tests for cookie and header cases | Gabriel Núñez / Isabel Medina |
| R5 | Rate limiter is in-memory and resets on redeploy or does not scale across replicas | Medium | Low | Document single-replica assumption in ADR; revisit if scaled | Gabriel Núñez |
| R6 | Animations reduce accessibility (motion sickness, focus loss) | Medium | Medium | Respect `prefers-reduced-motion`, keyboard and screen-reader QA | Marcos Peralta / Isabel Medina |
| R7 | Deploy failure on Coolify with no tested rollback | Low | High | Pinned image tags, health check, documented rollback to previous image | Paula Castillo |
| R8 | Spanish and English copy drift or incomplete translations | Medium | Low | Single i18n dictionary, build-time missing-key check, bilingual review | Camila Reyes / Ana Paredes |

## 6. Work units

| ID | Work unit | Owner | Gate | Depends on |
| --- | --- | --- | --- | --- |
| g1-brief | Project brief and handoff ledger | Elena Cruz | G1 | Approved plan |
| g2-requirements | Requirements, acceptance criteria, content and i18n inventory | Camila Reyes | G2 | g1-brief |
| g5-ux | Information architecture, wireframes, components, motion and a11y rules | Marcos Peralta | G5 | g2-requirements |
| g5-architecture | Brief architecture, ADRs (stack, i18n redirect, contact action, rate limit, deploy) | Gabriel Núñez | G5 | g2-requirements |
| g6-frontend | Pages, layouts, Vue islands, Three.js hero, anime.js, i18n routing | Sofía Herrera | G6 | g5-ux, g5-architecture |
| g6-backend | Contact Astro Action, Zod schema, honeypot, rate limit, nodemailer, `astro:env` | Diego Rojas | G6 | g5-architecture |
| security | Security review of contact action, secrets, headers, dependencies | Nicolás Vega | G2–G8 input | g5-architecture, then g6-backend |
| g7-qa | Test plan, acceptance evidence, a11y/perf/i18n checks, UAT readiness | Isabel Medina | G7 | g6-frontend, g6-backend, security |
| g8-devops | Dockerfile, Coolify runbook, health check, rollback, post-release checks | Paula Castillo | G8 | g5-architecture (draft), g7-qa (release) |
| g9-docs | README and Spanish handover package | Ana Paredes | G9 | g7-qa, g8-devops |

## 7. Dependencies and parallel slices

Recommended dispatch order for the parent coordinator:

1. **Slice A (sequential):** g1-brief, then g2-requirements.
2. **Slice B (parallel after G2):** g5-ux and g5-architecture. Nicolás Vega reviews the contact-action ADR as soon as it is drafted.
3. **Slice C (parallel after G5):** g6-frontend and g6-backend. The shared contract is the action input schema and response shape defined in the architecture ADR. g8-devops may draft the Dockerfile and runbook in parallel.
4. **Slice D (sequential):** security review of the implemented action, then g7-qa. G7 needs human approval.
5. **Slice E (sequential):** g8-devops production deploy (needs human approval), then g9-docs handover (needs human approval).

Halt rule: any dependent task waits for verified inputs. Missing approval or conflicting evidence stops the flow with a decision packet to Ronald Castillo.
