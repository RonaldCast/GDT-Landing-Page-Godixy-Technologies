# Handoff Ledger — Godixy Technologies Corporate Landing Page

- **GDF tier:** Lite (contact form at Standard level). See `docs/gdf/00-commercial/project-brief.md`.
- **Approver:** Ronald Castillo. Plan approval on 2026-10-25 covers G1–G5 scope and design decisions.
- **Rule:** no specialist approves their own gate. Elena Cruz recommends dispatch; the parent coordinator dispatches and records results.

## 1. Task ledger

| Task ID | Owner | Phase / Gate | Inputs (source) | Deliverable path | Evidence required | Next owner |
| --- | --- | --- | --- | --- | --- | --- |
| g1-brief | Elena Cruz | F1 / G1 | Approved plan (Ronald Castillo, 2026-10-25); `GDF.md`; `style_guide.md` | `docs/gdf/00-commercial/project-brief.md`, `docs/gdf/02-planning/handoff-ledger.md` | Tier justification, risks register, work units with owners | Camila Reyes |
| g2-requirements | Camila Reyes | F2 / G2 | Project brief; `style_guide.md`; audience (companies, executives, IT teams) | `docs/gdf/01-discovery/requirements.md` | Prioritized requirements, testable acceptance criteria, EN/ES content inventory, form fields and privacy notes | Marcos Peralta, Gabriel Núñez |
| g5-ux | Marcos Peralta | F5 / G5 | Requirements; `style_guide.md`; `Sources/Images` | `docs/gdf/03-design/ux-ui.md` | Sitemap, wireframes per section, component list, motion and reduced-motion rules, WCAG 2.2 AA checklist | Sofía Herrera |
| g5-architecture | Gabriel Núñez | F5 / G5 | Requirements; approved stack | `docs/gdf/03-design/architecture.md`, `docs/gdf/03-design/adr/` | ADRs for stack, i18n redirect, contact action contract, rate limit, deploy model; action input/response schema | Sofía Herrera, Diego Rojas, Nicolás Vega, Paula Castillo |
| g6-frontend | Sofía Herrera | F6 / G6 | UX design; architecture and ADRs; action contract | `src/` (pages, layouts, components, i18n) | `astro check` and build pass with TS strict; lint clean; reduced-motion and WebGL fallbacks shown; Lighthouse report | Isabel Medina |
| g6-backend | Diego Rojas | F6 / G6 | Contact action ADR; Zod schema; `astro:env` design | `src/actions/`, server env schema, `.env.example` | Unit tests for validation, honeypot, rate limit and mail failure; no secrets in repo or client bundle | Nicolás Vega |
| security | Nicolás Vega | F2–F8 / input to G5, G7, G8 | Architecture ADRs; g6-backend code; dependency list | `docs/gdf/04-quality/security-review.md` | Findings with severity; secrets handling verified; headers/CSP; dependency audit; residual risks for human acceptance. Written 2026-10-25; no confirmed High/Critical. | Isabel Medina |
| g7-qa | Isabel Medina | F7 / G7 | Acceptance criteria; g6 builds; security review | `docs/gdf/04-quality/qa-report.md` | Test results per criterion; i18n redirect cases (cookie, header, default); a11y and perf results; open defects by severity | Ronald Castillo (G7 decision), then Paula Castillo |
| g8-devops | Paula Castillo | F8 / G8 | Architecture; Docker requirements; QA sign-off; Coolify access (human-granted) | `Dockerfile`, `docs/gdf/05-release/deploy-runbook.md` | Image builds and runs locally; health check; env var list without values; rollback steps tested; post-release checklist | Ronald Castillo (G8 decision), then Ana Paredes |
| g9-docs | Ana Paredes | F9 / G9 | QA report; runbook; architecture; security review | `README.md`, `docs/gdf/06-handover/` (Spanish) | README accurate to repo; Spanish user guide and handover package reviewed by Gabriel, Paula, Isabel, Nicolás | Ronald Castillo (G9 decision) |

## 2. Gate packets

### G2 — Discovery

- **Status:** Approved via plan approval 2026-10-25.
- **Evidence expected:** `requirements.md` with prioritized requirements, acceptance criteria, EN/ES content inventory and contact-form data fields.
- **Decision needed:** None now. Any requirement that departs from the approved plan goes to Ronald Castillo as a change request.

### G5 — Design

- **Status:** Approved via plan approval 2026-10-25.
- **Evidence expected:** UX design (sitemap, wireframes, components, motion and a11y rules) and architecture with ADRs, including the contact action contract and Nicolás Vega's review notes.
- **Decision needed:** None now for decisions already in the plan. New decisions in the ADRs (for example a non-in-memory rate limiter or CSP that blocks required assets) are escalated before G6 starts.

### G7 — Acceptance

- **Status:** Evidence ready. Pending human approval.
- **Evidence expected:** QA report mapping each acceptance criterion to a result; i18n redirect, form validation, honeypot, rate limit and mail-failure tests; accessibility and Lighthouse results; security review with no open high or critical findings; list of known minor defects.
- **Evidence delivered:** `docs/gdf/04-quality/qa-report.md`, `docs/gdf/04-quality/security-review.md`. Consent now links to the privacy notice.
- **Decision needed:** Ronald Castillo accepts the build for release, or returns it with blocking defects. Any accepted residual risk must be named explicitly.

### G8 — Production

- **Status:** Pending human approval.
- **Evidence expected:** Image built from the accepted commit; Coolify env vars set (names only, no values in docs); health check passing; rollback procedure tested; DNS/TLS plan; post-release checklist (both locales load, `/` redirects correctly, contact email delivered).
- **Decision needed:** Ronald Castillo authorizes the production deploy and the deploy window. Post-release validation results are then confirmed before G9.

### G9 — Closure

- **Status:** Pending human approval.
- **Evidence expected:** README; Spanish handover package (user guide, technical summary, deploy and rollback, credentials ownership without secret values); sign-off from Gabriel, Paula, Isabel and Nicolás on their sections.
- **Decision needed:** Ronald Castillo confirms formal handover, ownership of the Coolify service and SMTP account, and the Phase 10 support terms.
