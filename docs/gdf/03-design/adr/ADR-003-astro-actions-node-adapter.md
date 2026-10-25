# ADR-003: Astro Actions on the Node adapter

- Status: Accepted
- Date: 2026-10-25
- Owner: Gabriel Núñez (Solution Architect)

## Context

The only server-side need is delivering contact form messages by email, plus a locale redirect at `/` and a health endpoint for Coolify. There is no persistence, authentication or external API. Secrets (SMTP credentials) must never reach the client.

## Decision

- Astro `output: 'static'` with `@astrojs/node` in `mode: 'standalone'`; only `src/pages/index.ts`, `/api/health` and actions run on demand.
- Contact handled by Astro Action `contact.send` (`accept: 'json'`) in `src/actions/index.ts`.
- One Zod schema in `src/features/contact/schema.ts`, shared by `ContactForm.vue` (UX validation) and the action (authoritative validation).
- Anti-abuse: honeypot field + in-memory per-IP rate limit (5 requests / 10 min).
- Email via nodemailer SMTP; config from `astro:env` server secrets: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO` (default `hello@godixy.com`), `CONTACT_FROM`.
- If SMTP is not configured: log in dev and return a "mail unavailable" error; the UI offers a `mailto:` fallback.

## Alternatives considered

- **Separate ASP.NET Core API (GDF default backend)**: a second service and deploy unit for one endpoint. Disproportionate.
- **Third-party form service (Formspree, etc.)**: external data processor, recurring cost, less control over UX and privacy.
- **Fully static site + `mailto:` only**: no server, but poor UX and no spam control. Kept only as fallback.
- **Plain API route (`/api/contact`)**: works, but Actions give typed input/output and built-in Zod validation with less code.
- **Redis/DB-backed rate limit**: unnecessary infrastructure for a single instance.

## Consequences

- Single container, no database; submissions are not stored.
- Rate limit resets on restart and is not shared across instances; scaling horizontally requires revisiting this ADR.
- Client IP accuracy depends on Coolify proxy headers (to verify during F6).
- Site keeps working without SMTP (graceful degradation), which simplifies local dev and staging.
