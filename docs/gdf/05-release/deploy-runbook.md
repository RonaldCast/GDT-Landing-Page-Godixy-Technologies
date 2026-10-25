# Deploy runbook — Godixy Technologies Landing Page

GDF phase F8 / gate G8 · Tier: Lite · Owner: Paula Castillo (DevOps/SRE)
Approver: Ronald Castillo

This runbook is operational evidence for G8. It does **not** approve G8 and does **not** authorize a production deploy. Production writes require explicit approval from Ronald Castillo.

Verified sources (2026-10-25): `Dockerfile`, `.dockerignore`, `server.mjs`, `astro.config.mjs`, `package.json`, `.env.example`, `src/pages/api/health.ts`, `src/pages/index.ts`, `src/actions/index.ts`, `src/features/contact/server/mailer.ts`, `docs/gdf/03-design/architecture.md`, `docs/gdf/03-design/adr/ADR-003-astro-actions-node-adapter.md`.

There is no Compose file and no Coolify project file in this repository. Coolify steps below are service-configuration steps mapped to those files. No Coolify CLI is documented here.

## 1. Preconditions

Confirm all of the following before a human-approved production deploy:

- **Coolify** is the hosting platform. TLS and the reverse proxy are handled by Coolify (`architecture.md` §9). Secrets are injected only through Coolify environment variables (`architecture.md` §7; project brief constraint).
- **Docker** multi-stage image from the repository `Dockerfile`. Base image: `node:22-alpine` (`ARG NODE_IMAGE=node:22-alpine`). Runtime user: `node`. Process: `node server.mjs`.
- **Node 22** for local tooling: `package.json` `engines.node` is `>=22.12.0`. The image uses `node:22-alpine`.
- **Domain and TLS** via the Coolify proxy. The public site URL used at build time for canonical and hreflang links is `SITE_URL` (`astro.config.mjs` `site`; `Dockerfile` `ARG SITE_URL`). DNS and certificate issuance are Coolify/operator work; they are not configured in this repo.
- **Single replica.** Contact rate-limit state is in-memory per process and is not shared across instances (`architecture.md` §6; ADR-003). Horizontal scale is out of scope until that ADR is revisited.
- **No application database.** There is no persistence layer to migrate or back up (`architecture.md` §1; ADR-003).
- **G8 human approval** from Ronald Castillo. This specialist does not self-approve the gate.

`.dockerignore` keeps `.env` and `.env.*` out of the build context (`.env.example` is the only env file allowed). Docs and tests are also excluded from the image.

## 2. Build args and runtime environment

Names only. Never write secret values in this document, in git, or in the image.

### Build arguments (`Dockerfile`)

| Name | When it is read | Notes from source |
| --- | --- | --- |
| `SITE_URL` | Build stage | `ARG SITE_URL` then `ENV SITE_URL=${SITE_URL}` so `astro.config.mjs` can set `site` for canonical and hreflang links. Dockerfile default is present in source; override the build arg to match the public HTTPS origin before a production build. |
| `NODE_IMAGE` | All stages | Defaults to `node:22-alpine`. Leave as-is unless the approver changes the base image. |

`SITE_URL` is also a runtime name listed below because `.env.example` and `astro.config.mjs` read it from the environment. Canonical/hreflang values are baked at `npm run build`.

### Runtime environment (inject in Coolify; names only)

| Name | Source | Role |
| --- | --- | --- |
| `SITE_URL` | `astro.config.mjs`, `.env.example` | Public site origin. |
| `SMTP_HOST` | `astro.config.mjs` env schema, `mailer.ts` | SMTP hostname. If empty, the contact action treats mail as unavailable and the UI offers `mailto:` fallback. |
| `SMTP_PORT` | `astro.config.mjs` env schema, `mailer.ts` | SMTP port. |
| `SMTP_SECURE` | `astro.config.mjs` env schema, `mailer.ts` | SMTP TLS flag. |
| `SMTP_USER` | `astro.config.mjs` env schema, `mailer.ts` | SMTP username. |
| `SMTP_PASS` | `astro.config.mjs` env schema, `mailer.ts` | SMTP password. |
| `CONTACT_TO` | `astro.config.mjs` env schema, `mailer.ts` | Recipient mailbox. |
| `CONTACT_FROM` | `astro.config.mjs` env schema, `mailer.ts` | Envelope/from address. |
| `HOST` | `Dockerfile` `ENV`, `server.mjs` | Listen address. Image sets `0.0.0.0`. |
| `PORT` | `Dockerfile` `ENV`, `server.mjs` | Listen port. Image sets `4321`. |
| `TRUST_PROXY` | `astro.config.mjs` env schema, `src/actions/index.ts` | Behind Coolify, set so the first `X-Forwarded-For` entry is the rate-limit key. Schema default is off. |
| `ENABLE_HSTS` | `server.mjs` | HSTS is added only when this value is the string `true`. Leave unset until TLS is confirmed. |

The runtime stage also sets `NODE_ENV=production` in the `Dockerfile`. That is image configuration, not a Coolify secret.

`server.mjs` listen fallbacks (only if Coolify omits the names the image already sets): `HOST` → `0.0.0.0`, `PORT` → `4321`.

## 3. Dockerfile healthcheck

Exact instruction from the `Dockerfile` runtime stage. `PORT` is `4321` in that stage (`ENV PORT=4321`, `EXPOSE 4321`).

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/api/health" || exit 1
```

That probe is `GET /api/health` on port **4321** (loopback). The route is on-demand (`src/pages/api/health.ts`, `prerender = false`) and responds with JSON `{ "status": "ok" }`, `Content-Type: application/json`, `Cache-Control: no-store`.

Coolify may also run its own probe; if it does, use the same path and port. Do not invent another health URL.

## 4. Coolify service setup

Configure one Coolify application/service for this repository. Do not deploy until Ronald Castillo authorizes the window.

1. **Build from the `Dockerfile`.** Multi-stage: `deps` (`npm ci`) → `build` (`npm run build` with `SITE_URL`) → `prod-deps` (`npm ci --omit=dev`) → `runtime` (`CMD ["node", "server.mjs"]`). There is no Compose service name to select.
2. **Pass build arg `SITE_URL`** so the production origin is compiled into canonical and hreflang links. Do not rely on changing it only after the image is built.
3. **Publish container port 4321.** Match `EXPOSE 4321` and `ENV PORT=4321`. Point the Coolify proxy at that port. TLS terminates at the Coolify proxy (`architecture.md` §9).
4. **Single replica.** One container. ADR-003: the in-memory limiter (5 requests / 10 minutes per IP) resets on restart and is not shared across instances.
5. **Inject runtime env vars in Coolify** using the names in §2. Values stay in Coolify only. Do not bake `.env` into the image (blocked by `.dockerignore`).
6. **Set `TRUST_PROXY` in Coolify** so rate limiting uses the first `X-Forwarded-For` hop (`architecture.md` §7; `src/actions/index.ts`).
7. **Leave `ENABLE_HSTS` unset** until the proxy serves HTTPS for the chosen domain. Then set it to the string `true` (see §5 and §8).
8. **Healthcheck.** Keep the Dockerfile `HEALTHCHECK` (`GET /api/health` on 4321). Coolify should treat an unhealthy container as a failed deploy.
9. **Process signals.** `server.mjs` closes on `SIGTERM` / `SIGINT` and force-exits after 10 seconds if the server does not close.

## 5. Post-release checklist

Run after a human-approved deploy, against the public HTTPS origin (not invented here). Do not enable HSTS in the same change as first TLS unless TLS is already proven.

| Check | Expected evidence |
| --- | --- |
| `GET /` language redirect | `302` to `/en/` or `/es/` (`src/pages/index.ts`). Order: cookie `lang`, then `Accept-Language`, then default `en` (`src/shared/i18n/utils.ts`, `defaultLang`). Response sets `Vary: Accept-Language, Cookie` and `Cache-Control: private, no-store`. |
| `GET /en/` | Prerendered English landing page loads (`architecture.md` §3; `locales` / `prefixDefaultLocale: true`). |
| `GET /es/` | Prerendered Spanish landing page loads. |
| `GET /api/health` | Body `{ "status": "ok" }` (`src/pages/api/health.ts`; `tests/e2e/platform.spec.ts`). |
| Contact email delivery | One real submission with SMTP configured. `mailer.ts` sends to `CONTACT_TO` from `CONTACT_FROM` (fallback `SMTP_USER` then `CONTACT_TO`) only when `SMTP_HOST` is set. QA left AC-19 real delivery as a G8 smoke test (`docs/gdf/04-quality/qa-report.md`, `test-plan.md`). If SMTP is missing, the action returns mail unavailable and the UI offers `mailto:`. |
| HSTS only after TLS | `Strict-Transport-Security: max-age=31536000; includeSubDomains` is emitted only when `ENABLE_HSTS` is the string `true` (`server.mjs`). Confirm HTTPS on the Coolify proxy **before** turning this on. Other headers from `server.mjs` (nosniff, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, COOP, `frame-ancestors 'none'`) apply regardless. |

Also confirm the Coolify/Docker healthcheck is healthy and that the deployed image is the approved commit.

## 6. Rollback

There is no database migration to reverse. Rollback is a previous Coolify image / deployment of this same service.

1. In Coolify, redeploy the **previous successful deployment** (previous image) of this service. Do not scale out to add a second replica as a rollback tactic.
2. Keep or restore the Coolify env names from §2. If the failed release changed env names, restore the previous Coolify env set. Values stay in Coolify; they are not in git.
3. Wait for the Dockerfile healthcheck: `GET /api/health` on port 4321 (interval 30s, timeout 5s, start period 15s, 3 retries).
4. Re-run §5: `/` redirect, `/en/`, `/es/`, `/api/health`, one contact send if SMTP is configured, and HSTS state (still off unless TLS was already confirmed).
5. If the previous image is missing, recovery is a new build from the last known-good git commit plus Coolify env restore (§7). That is a new deploy and still needs G8 authorization if it is production.

`server.mjs` graceful close (10 s) applies when Coolify sends `SIGTERM` during the swap.

## 7. Backup and recovery

- **No application database.** Submissions are not stored; they exist only in transit and in the recipient mailbox (`architecture.md` §6; ADR-003). There is nothing to dump or restore at the app layer.
- **Recovery** = redeploy a known-good image (previous Coolify deployment or rebuild from a known-good commit) **and** restore SMTP / other env names in Coolify.
- **Secrets live only in Coolify.** `.dockerignore` excludes `.env` and `.env.*`. `.env.example` lists names (and non-secret local placeholders already present in that file). Do not copy production values into the repo, tickets, or this runbook.
- Rate-limit memory is lost on every restart. That is expected for a single replica.

## 8. Assumptions and decisions needed

These items are not settled in the verified files. They require Ronald Castillo (G8). This specialist does not approve them.

| Decision | Why it is open | Recommendation from evidence (not an approval) |
| --- | --- | --- |
| **SMTP provider and mailbox ownership** | Requirements D-01 is still “to decide”. Code is generic nodemailer SMTP (`SMTP_*`, `CONTACT_TO`, `CONTACT_FROM`). No provider is configured in the repo. | Choose a provider, store credentials only in Coolify, then run the AC-19 real-delivery smoke test. |
| **DNS** | Domain/TLS “via Coolify proxy” is architecture, not a checked-in DNS record. | Point the production hostname at Coolify; confirm the certificate before public cutover. Set build arg `SITE_URL` to that HTTPS origin. |
| **`ENABLE_HSTS` after TLS** | `server.mjs` adds HSTS only when `ENABLE_HSTS` is `true`. Enabling it on HTTP or a wrong host is harmful. | Keep it unset for the first TLS-verified deploy. After HTTPS is confirmed on the Coolify proxy, set `ENABLE_HSTS` to `true` in a follow-up Coolify env change. |
| **`TRUST_PROXY`** | Schema default is false. Architecture says to enable it behind Coolify. | Set it in Coolify for production so the rate limiter keys on the first `X-Forwarded-For` hop. |
| **G8 deploy window and image** | Gate is pending human approval (`handoff-ledger.md`). G7 is also pending human sign-off (`qa-report.md`). | Ronald Castillo authorizes the production deploy (and accepts residual G7 items if any). Paula does not deploy and does not self-approve G8. |

After G8 is approved and post-release checks pass, next documentation owner is **Ana Paredes** (G9 Spanish handover), who may restyle this runbook but must not change ports, env names, healthcheck, or rollback facts without Paula’s verification.
