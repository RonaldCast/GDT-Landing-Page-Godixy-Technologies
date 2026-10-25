# Security review — Godixy Technologies landing page

| Field | Value |
| --- | --- |
| Task ID | `security` |
| Specialist | Nicolás Vega (Security Engineer) |
| Date | 2026-10-25 |
| GDF tier | Lite (contact form treated at Standard level) |
| Phase / gate | F2–F8 · input to G7 / G8 |
| Approver | Ronald Castillo — **no gate is approved by this review** |
| Mode | Focused source review (not a full-codebase audit) |
| Independent verifier | Pending (must not be the author). Recommended: Isabel Medina, then Ronald Castillo |

**Release stance (this review only):** no source-confirmed High or Critical finding. G7 has **no security code blocker**. G8 still has **operational residuals** that a human must accept or close (in-memory rate limit, `TRUST_PROXY`, SMTP credentials at Coolify, privacy-notice legal review, unsigned working tree). This document does not approve G7 or G8.

---

## 1. Evidence boundary

### 1.1 Source revision

| Check | Result |
| --- | --- |
| Git repository | **Absent.** `git status` / `git rev-parse` fail: this directory is not a git work tree (no `.git`). |
| Revision | **Unversioned working tree** inspected on 2026-10-25. No commit hash, branch or dirty/clean state can be recorded. |
| Local secret file | No `.env` on disk. Only `.env.example` (placeholder names, empty SMTP values). |
| Production probe | **Not performed.** No network scan, no Coolify/SMTP/DNS inspection. |
| Safe local command | `npm audit` and `npm audit --omit=dev` against the local lockfile (2026-10-25). Both: **0 vulnerabilities**. |

G8 evidence in the handoff ledger expects an image built from an **accepted commit**. That condition cannot be met from this tree until Paula / Ronald initialise version control and pin a revision. That is a release-integrity residual, not an application vulnerability.

### 1.2 Inputs used (verified by reading current files)

- `src/actions/index.ts`
- `src/features/contact/schema.ts`
- `src/features/contact/server/handle-contact.ts`
- `src/features/contact/server/email.ts`
- `src/features/contact/server/mailer.ts`
- `src/features/contact/server/rate-limit.ts`
- `src/features/contact/ContactForm.vue`, `mailto.ts`, `service-intent.ts`
- `server.mjs`
- `astro.config.mjs`
- `.env.example`, `.gitignore`, `.dockerignore`, `Dockerfile`
- `src/pages/index.ts`, `src/pages/api/health.ts`
- `src/layouts/BaseLayout.astro`, `src/features/navigation/LanguageSwitcher.vue`
- `src/pages/[lang]/privacy.astro` and privacy copy in `src/shared/i18n/en.ts`
- Unit / e2e tests under `tests/`
- Built artifacts `dist/client/**` and `dist/server/**` (secret-name leak check only)
- Design context: `docs/gdf/03-design/architecture.md`, `docs/gdf/03-design/adr/ADR-003-astro-actions-node-adapter.md`, `docs/gdf/01-discovery/requirements.md` (NFR-06/07), `docs/gdf/00-commercial/project-brief.md`

A prior focused note (earlier scaffold under `src/lib/contact.ts`) reported **no application rate limit**. That claim is **rejected against this tree**: `createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 })` is wired in `src/actions/index.ts` and enforced in `handleContact`.

### 1.3 Out of scope / unreviewed

Not inferred and not tested: Coolify TLS, reverse-proxy header rewriting, WAF, SMTP provider account security, DNS / SPF / DKIM / DMARC, OS CVEs in `node:22-alpine`, Three.js native/WebGL memory safety, runtime behaviour under load, and any control that exists only in a dashboard.

---

## 2. Trust boundaries and data classification

```text
Internet visitor ──► Coolify TLS/proxy (not in this repo)
                         │
                         ▼
                 server.mjs (headers) ──► Astro handler
                         │
         ┌───────────────┼────────────────┐
         ▼               ▼                ▼
   GET / (redirect)   static HTML      POST contact.send
   GET /api/health    + Vue islands    (Astro Action, JSON)
                                           │
                          Zod → origin → rate limit → honeypot
                                           │
                                           ▼
                                      nodemailer SMTP ──► mailbox (CONTACT_TO)
```

| Principal | Trust | Can do |
| --- | --- | --- |
| Anonymous visitor | Lowest | Read prerendered pages; POST `contact.send`; GET `/` and `/api/health`. |
| Same-origin browser | Low | Same as visitor, plus `lang` cookie and `sessionStorage` service intent. |
| Node process | Trusted for this app | Reads `astro:env` secrets; sends mail; holds in-memory rate-limit map. |
| SMTP server | External | Receives full form payload and `Reply-To`. |
| Coolify operator | High (human) | Injects env vars; terminates TLS; may set `X-Forwarded-*`. **Not visible in source.** |

| Data | Class | Where it exists in this source | Retention in this app |
| --- | --- | --- | --- |
| Name, email, company, company size, service, message, locale, consent | Contact PII / business inquiry | Request body → `ContactData` → SMTP `text`/`html`/`replyTo`. Dev-only logger may print the built email when SMTP is unset (`handle-contact.ts`). | **No database.** Not written to disk by application code. |
| Client IP or `X-Forwarded-For` first hop | Network identifier | Rate-limit key only (`actions/index.ts` → `createRateLimiter`). | In-process `Map`, window 10 minutes, lost on restart. |
| `lang` cookie | Preference (`en` \| `es`) | Set in `LanguageSwitcher.vue`; read in `src/pages/index.ts`. | One year, `path=/`, `samesite=lax`, `secure` on HTTPS. Not HttpOnly (JS must write it). |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `CONTACT_FROM` | Secrets / mailbox routing | `astro:env` `context: 'server'`, `access: 'secret'`. | Process environment at runtime. Default `CONTACT_TO` in config is the public address `hello@godixy.com`. |
| `TRUST_PROXY` | Public config flag | `astro:env` `access: 'public'`, default `false`. | Not a secret. |

NFR-06/07 and the project brief require: server validation, honeypot + rate limit, secrets only in the environment, no unescaped user input in email HTML, security headers, HTTPS, collect-only-listed-fields, explicit consent, no tracker without consent.

---

## 3. Coverage ledger

| Surface | Boundary | Attack class | Paths | Check | Result |
| --- | --- | --- | --- | --- | --- |
| `contact.send` | Internet → Action | CSRF / cross-origin write | `src/actions/index.ts` | Source + `tests/e2e/contact.spec.ts` (`Origin: https://evil.example` → 403) | Control present for browser `Origin` mismatch |
| `contact.send` | Visitor → mail | Header injection | `email.ts` `singleLine` | Source + unit test (`Eve\\r\\nBcc:…`) | Rejected as vuln |
| `contact.send` | Visitor → mail HTML | Stored XSS in mailbox | `email.ts` `escapeHtml` | Source + unit test | Rejected as vuln |
| `contact.send` | Visitor → SMTP | Abuse / flood | honeypot + 5/10 min limiter | Source + unit tests | Control present; residuals below |
| `contact.send` | Visitor → secrets | Secret exfil via client | `astro.config.mjs`, `dist/client` | Grep client bundle: no `SMTP_*`, no `_internalGetSecret` | Rejected as vuln |
| Repo / image | Developer → git/Docker | Secret commit / bake-in | `.gitignore`, `.dockerignore`, `Dockerfile` | No `.env` file; Docker build copies `.` after ignoring `.env*` | Control present in this tree |
| HTTP responses | Browser | Clickjacking, MIME sniff, referrer | `server.mjs` | Source + `tests/e2e/platform.spec.ts` | Headers present |
| Prerendered HTML | Browser | Script/style injection | Astro `security.csp` + built `/en/` | Meta CSP: `default-src 'self'`, hashed `script-src`/`style-src`, no `unsafe-inline`/`unsafe-eval` | Control present |
| `GET /` | Visitor | Open redirect | `src/pages/index.ts`, `isLang` | Location is only `/en/` or `/es/` | Rejected as vuln |
| `GET /api/health` | Internet | Info leak | `src/pages/api/health.ts` | Body is `{ status: 'ok' }` | Rejected as vuln |
| Pages / islands | Visitor | DOM XSS | `src/` | No `v-html`, `innerHTML`, `eval`, `document.write` | Rejected as vuln |
| JSON-LD | Visitor | Script injection | `BaseLayout.astro` `set:html={JSON.stringify(…)}` | Static organisation fields only | Rejected as vuln |
| Dependencies | Supply chain | Known advisories | `package-lock.json` | `npm audit` 0 / 0 | See §8 |
| Coolify / SMTP / TLS | Platform | MITM, header spoof, secret storage | — | **Not in source** | `needs_validation` / residual |

---

## 4. Confirmed findings

**None.**

A finding is confirmed only after a source-traced boundary failure **and** independent verification. This pass did not establish a High or Critical boundary failure. I am the author of these candidates; Isabel (or another non-author) must try to disprove them before anyone treats a candidate as confirmed.

No application source was changed.

---

## 5. Needs validation

These are concrete, source-grounded hypotheses that depend on a fact this review must not invent or probe.

### NV-01 — `TRUST_PROXY` and first `X-Forwarded-For`

- **Status:** `needs_validation` — no severity.
- **Path:** `src/actions/index.ts` (`clientKey`, lines 16–22); default `TRUST_PROXY=false` in `astro.config.mjs`.
- **Actor:** unauthenticated client that can set or influence `X-Forwarded-For`.
- **Intended control:** 5 submissions / 10 minutes per real client IP.
- **Missing fact:** whether Coolify (or any proxy in front of `server.mjs`) **replaces** `X-Forwarded-For` with the socket peer and whether Paula will set `TRUST_PROXY=true`.
- **If `TRUST_PROXY=false` behind a proxy:** every visitor shares the proxy address → global lockout after 5 accepted attempts / 10 minutes (availability), not a confidentiality break.
- **If `TRUST_PROXY=true` and the proxy forwards a client-supplied chain without sanitising:** the client picks the rate-limit key → per-IP limit is bypassable.
- **Owner / safe plan:** Paula Castillo records the live proxy header behaviour from Coolify docs or a **staging** request dump (names only). Ronald accepts the chosen setting. Do not probe production.
- **Independent verifier:** pending.

### NV-02 — Visitor TLS and HSTS

- **Status:** `needs_validation` — no severity.
- **Path:** `server.mjs` sets `Strict-Transport-Security` only when `ENABLE_HSTS=true` (default unset/false). `.env.example` does not list this flag.
- **Actor:** network observer on the visitor path.
- **Intended control:** NFR-06 “HTTPS only”; HSTS when enabled.
- **Missing fact:** whether Coolify terminates TLS and already emits HSTS. This review does not assume that.
- **Owner / safe plan:** Paula documents TLS + HSTS on the staging/production proxy. Ronald decides whether the app should also send HSTS (`includeSubDomains` has subdomain impact).
- **Independent verifier:** pending.

### NV-03 — SMTP credential transit (`SMTP_SECURE` default false, no `requireTLS`)

- **Status:** `needs_validation` — no severity. Carries forward the TLS part of the earlier scaffold note; the “no rate limit” part does not.
- **Path:** `src/features/contact/server/mailer.ts` (nodemailer `secure: SMTP_SECURE`, no `requireTLS`).
- **Actor:** on-path attacker between the container and the SMTP host.
- **Intended control:** SMTP secrets and PII stay confidential in transit.
- **Observed in source:** port default 587, `SMTP_SECURE` default `false`. Nodemailer will try STARTTLS if the server offers it; it will **not** fail closed if STARTTLS is absent.
- **Missing fact:** SMTP host location (localhost vs Internet), enforced TLS on the provider, and Coolify secret storage.
- **Owner / safe plan:** Paula + Ronald configure provider TLS (465/`SMTP_SECURE=true` or 587 + documented STARTTLS) and store credentials only in Coolify. No production SMTP probe from this review.
- **Independent verifier:** pending.

### NV-04 — Privacy notice vs Ley 29733 (and consent UX)

- **Status:** `needs_validation` — legal, not a technical vulnerability.
- **Path:** `src/pages/[lang]/privacy.astro`, `src/shared/i18n/en.ts` / `es.ts` privacy sections; consent checkbox in `ContactForm.vue`.
- **Observed:** notice describes form fields, email delivery, in-memory IP for rate limiting, one `lang` cookie, no analytics. Consent text does **not** hyperlink the privacy page (FR-16 asked for a link on the label; AC-24 is satisfied via the footer).
- **Missing fact:** legal adequacy for Peru Ley 29733 / applicable law (requirements D-07).
- **Owner:** Ronald Castillo; legal counsel if Godixy requires it. Already listed as a G7 open item in `qa-report.md`.

---

## 6. Rejected candidates

| ID | Claim | Refuting evidence |
| --- | --- | --- |
| RJ-01 | Attacker injects extra mail headers (`Bcc`, subject newline) | `singleLine` strips CR/LF on name, email, company, subject and `replyTo`. Message is body-only. Unit test in `tests/unit/contact.test.ts`. |
| RJ-02 | Attacker XSS via email HTML | `escapeHtml` on row values and message. Unit test asserts `<script>` is escaped. |
| RJ-03 | SMTP secrets ship in the client bundle | `access: 'secret'` + `astro:env/server` only. `dist/client` has no `SMTP_*` / `_internalGetSecret`. |
| RJ-04 | Secrets committed or copied into the image | `.gitignore` and `.dockerignore` ignore `.env` / `.env.*` except `.env.example`. No `.env` present. Runtime stage copies `node_modules`, `server.mjs`, `package*.json` and `dist` only. |
| RJ-05 | Browser CSRF posts a cross-origin JSON action | `isSameOrigin` compares `Origin` host to `X-Forwarded-Host` or `Host`; mismatch throws `FORBIDDEN`. E2E: 403. (Non-browser clients can omit `Origin` — that is the public Action, not CSRF.) |
| RJ-06 | `GET /` open redirect via cookie or `Accept-Language` | `resolvePreferredLang` accepts only `en`/`es`; `Location` is `localizedPath(lang)`. |
| RJ-07 | `/api/health` leaks versions, env or secrets | JSON `{ status: 'ok' }`, `Cache-Control: no-store`. |
| RJ-08 | Stored / reflected XSS on the marketing pages | No user HTML rendering; no `v-html` / `innerHTML` / `eval`. JSON-LD is `JSON.stringify` of static fields. |
| RJ-09 | Clickjacking | `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'` on every `server.mjs` response. |
| RJ-10 | `lang` cookie injection of arbitrary values | Writer only stores enum `en`/`es`. Reader uses `isLang`. |
| RJ-11 | No application rate limit (prior scaffold) | Current `createRateLimiter` + `handleContact` + unit tests. |
| RJ-12 | Third-party trackers | No analytics/gtag/pixel in `src/`. CSP `connect-src 'self'`. Privacy copy matches. |

---

## 7. Hardening notes (not vulnerabilities)

Missing best practice, incomplete defence-in-depth, or documentation gaps. **Do not treat these as scored vulns.**

| ID | Note | Smallest improvement (owner) |
| --- | --- | --- |
| H-01 | `maxKeys = 10_000` in `rate-limit.ts` only triggers cleanup of **fully expired** keys. The map can grow past 10_000 while keys are still in-window. Impact is process memory, and only if many distinct keys appear (see NV-01). | Evict oldest keys when `size > maxKeys` (Diego, if Ronald wants it). |
| H-02 | `isSameOrigin` trusts `X-Forwarded-Host` even when `TRUST_PROXY` is false. Browser CSRF still fails unless that header is attacker-controlled (proxy fact). | Gate `X-Forwarded-Host` on `TRUST_PROXY`, same as XFF. |
| H-03 | `.env.example` omits `TRUST_PROXY` and `ENABLE_HSTS`, which the architecture and `server.mjs` document. | Paula adds names (no values) to the runbook / example env. |
| H-04 | `Dockerfile` `ARG NODE_IMAGE=node:22-alpine` is a moving tag, not a digest. | Paula pins a digest at G8. |
| H-05 | Invalid JSON still pays Zod cost before origin/rate-limit. Cheap CPU; not demonstrated as a DoS. | Check origin first if desired. |
| H-06 | Runtime image installs all production npm deps (including client-only `three` / `animejs`). | Optional slimmer runtime (Paula). |
| H-07 | Dev mode logs the built email (PII) when SMTP is unset. Production uses `import.meta.env.DEV` (false after `astro build`). Docker sets `NODE_ENV=production`. | Keep `astro dev` off the public network. |
| H-08 | Transport errors are logged with `error.message` (may mention SMTP replies). Client only sees generic `send_failed`. | Redact logs if the mailbox host is noisy (Diego). |
| H-09 | Consent label does not link to `/en/privacy/` / `/es/privacy/`. Footer does. | Sofía / Ana if legal asks for an in-form link. |
| H-10 | No `robots.txt` / sitemap in `public/` (SEO, not a security control). | Out of this review. |

---

## 8. Secrets, headers, abuse controls, dependencies

### 8.1 Secrets handling

| Control | Evidence |
| --- | --- |
| Schema | `astro.config.mjs` `env.schema`: SMTP + contact fields `context: 'server'`, `access: 'secret'`. `TRUST_PROXY` is public by design. |
| Example env | `.env.example` lists names and empty SMTP values; `CONTACT_FROM` is a display-name example, not a password. |
| Ignore rules | `.gitignore` and `.dockerignore`: `.env`, `.env.*`, `!.env.example`. |
| Image | Multi-stage; `USER node`; secrets not copied as files. Must be injected at runtime (Coolify — not in source). |
| Client | No secret names in `dist/client`. |
| Client errors | Action maps failures to `TOO_MANY_REQUESTS` / `SERVICE_UNAVAILABLE` / `INTERNAL_SERVER_ERROR` plus short reason codes. Unit test: transport `535 auth failed` becomes `send_failed` to the caller. |

**Residual:** SMTP credentials will exist in Coolify (or the host env). This review cannot see that store. Ronald accepts custody; Paula documents names only.

### 8.2 CSP and HTTP headers

`server.mjs` applies to **all** responses (static and on-demand), then removes `X-Powered-By`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()`
- `Cross-Origin-Opener-Policy: same-origin`
- `Content-Security-Policy: frame-ancestors 'none'`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` **only if** `ENABLE_HSTS=true`

Astro `security.csp` emits a **meta** policy on prerendered pages (confirmed on `dist/client/en/index.html`):

- `default-src 'self'`
- `img-src 'self' data:`
- `font-src 'self'`
- `connect-src 'self'`
- `object-src 'none'`
- `base-uri 'self'`
- `form-action 'self' mailto:`
- `script-src 'self'` + sha256 hashes (16 hashes on `/en/`; no `unsafe-inline` / `unsafe-eval`)
- `style-src 'self'` + sha256 hashes (14 hashes on `/en/`)

`frame-ancestors` cannot live in `<meta>`; the split with `server.mjs` matches ADR/architecture. E2E asserts both the header and the meta tag.

Fonts are self-hosted (`@fontsource-variable/inter`). Three.js and anime.js are bundled, not loaded from a CDN.

### 8.3 Abuse controls

| Control | Behaviour in source |
| --- | --- |
| Schema | Zod: length limits, email, enums for size/service/locale, `consent: true`. Authoritative on the server; client is UX only. |
| Same-origin | JSON Action rejects mismatching `Origin`. Astro `checkOrigin: true` (forms). Missing `Origin` is allowed (non-browser clients). |
| Rate limit | In-memory sliding window, **5 hits / 10 minutes / key**, consumed **before** honeypot and send. Resets on process restart. Single instance assumed (ADR-003). |
| Honeypot | Hidden `website` field, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden`. Non-empty → `{ ok: true }`, no email, warning log. |
| Mail envelope | `from` / `to` from config; visitor email only as `replyTo` after `singleLine`. |
| Fallback | If SMTP unset in production: `unavailable` + `mailto:` (PII stays in the visitor’s mail client). |

These match NFR-06 and AC-19/21/22 at the unit-test level. Real SMTP delivery remains a G8 smoke test (Isabel / Paula).

### 8.4 Dependency audit

| Command | Date | Result |
| --- | --- | --- |
| `npm audit --omit=dev` | 2026-10-25 | 0 vulnerabilities (319 production dependencies in the report metadata) |
| `npm audit` (all) | 2026-10-25 | 0 vulnerabilities |

Dockerfiles run `npm ci --no-audit`. A lockfile change after this date needs a fresh audit before G8. Runtime OS image CVEs were not assessed.

Isabel’s `qa-report.md` recorded the same 0-advisory result; this review reproduced it locally.

---

## 9. Residual risks for human acceptance

Ronald Castillo must **name** any residual he accepts. Nicolás does not accept them.

| ID | Residual | Why it remains | Suggested owner |
| --- | --- | --- | --- |
| RR-01 | **In-memory rate limit** | Per process; lost on restart; not shared across replicas. Accepted design in ADR-003 for a single Coolify container. Horizontal scale without a shared store weakens the control. | Gabriel / Ronald |
| RR-02 | **`TRUST_PROXY` / `X-Forwarded-For`** | Correctness depends on Coolify header behaviour, which is not in this repo (NV-01). | Paula / Ronald |
| RR-03 | **SMTP credentials at Coolify** | Secrets are correctly excluded from the repo and client. Custody, rotation, TLS to the mailbox host (NV-03) and D-02 (SPF/DKIM/DMARC) are operational. | Paula / Ronald |
| RR-04 | **Privacy notice legal review** | Technical description matches the code. Legal fitness (Ley 29733 / D-07) and the missing in-form privacy link are not decided here (NV-04). | Ronald (+ counsel) |
| RR-05 | **Unversioned tree** | No git revision. G8 “build from accepted commit” is not satisfiable yet. | Paula / Ronald |
| RR-06 | **Visitor HTTPS / HSTS** | App does not force TLS; HSTS is opt-in (NV-02). | Paula / Ronald |

---

## 10. Release recommendation (input to G7 / G8)

| Gate | Security recommendation | Blockers from this review | Residuals that do **not** block code acceptance |
| --- | --- | --- | --- |
| **G7 acceptance** | **No security code blocker.** The contact Action, headers, CSP, secret wiring and local `npm audit` are consistent with NFR-06 and ADR-003. | None confirmed High/Critical. Independent verification of this review is still open. | RR-01 (documented), RR-04 (already a QA G7 open item), H-09. |
| **G8 production** | **Do not treat this file as deploy approval.** Ship only after a human accepts RR-01–RR-06 or closes them. | No code-level High/Critical. **Process:** pin a git commit; set Coolify env **names** (no values in git); decide `TRUST_PROXY` and TLS/HSTS; SMTP smoke test (AC-19). | In-memory limiter; legal privacy text; digest-pin of `node:22-alpine`. |

I do **not** approve G7 or G8. I do **not** waive RR-01–RR-06.

---

## 11. Next owner

1. **Isabel Medina** — independently try to disprove the candidates in §5–§6 (she is not the author). Fold the outcome into the G7 packet beside `qa-report.md`.
2. **Ronald Castillo** — accept or reject residuals RR-01–RR-06; decide G7; later decide G8 with Paula’s runbook.
3. **Paula Castillo** (after G7) — Coolify env list (names only), `TRUST_PROXY` / `ENABLE_HSTS`, SMTP TLS, image pin, rollback. Do not deploy without Ronald’s G8 approval.

G9 security-sensitive operating guidance (secret custody, what the form stores vs emails) should later go to **Ana Paredes** for the Spanish handover; this file stays an English agent artifact.
