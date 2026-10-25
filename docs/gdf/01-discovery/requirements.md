# Requirements — Godixy Technologies Corporate Landing Page

| Field | Value |
| --- | --- |
| Phase / Gate | F2 Discovery / G2 (approved via plan, 2026-10-25) |
| GDF tier | Lite (corporate landing page + contact form, low data sensitivity) |
| Owner | Camila Reyes, Business Analyst |
| Client | Godixy Technologies EIRL (internal project) |
| Sources | Parent brief; `../Sources/GDF.md`; `../Sources/style_guide.md`; tone references redpixel.io, synerxrd.com |
| Status | Accepted with the 2026-10-25 plan. Open items D-01–D-09 stay listed; later implementation resolved D-01 (SMTP + Node adapter), D-03 (no storage), D-04 (company optional), D-05 (four size bands), D-06 (honeypot + 5/10 min), D-09 (no analytics). D-02, D-07 and D-08 still need human sign-off. |

## 1. Business objectives

- **BO-1** Present Godixy as a professional software and technology company to small, medium and large companies, executives and IT teams.
- **BO-2** Communicate the six service lines, mission, vision and values (Precision, Continuity, Clarity) accurately.
- **BO-3** Show the GDF delivery method (10 phases, G1–G9 gates, Lite/Standard/Advanced tiers) as the differentiator.
- **BO-4** Generate qualified leads through a contact form delivered to hello@godixy.com.
- **BO-5** Serve EN and ES audiences equally, auto-detecting language with manual override.
- **BO-6** Build credibility without invented metrics, clients, logos or testimonials.

## 2. Functional requirements (MoSCoW)

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-01 | Hero with value proposition, primary CTA (contact) and secondary CTA (services). | Must |
| FR-02 | Trust pillars section based on Precision, Continuity, Clarity and verifiable delivery. | Must |
| FR-03 | Interactive services explorer covering the six services; selecting one reveals its detail. | Must |
| FR-04 | "How we work": GDF 10 phases, G1–G9 gates, Lite/Standard/Advanced tiers. | Must |
| FR-05 | "Who we serve": small, medium, large companies; executives; IT teams. | Must |
| FR-06 | About: mission, vision and three values. | Must |
| FR-07 | Engagement models (fixed price, time & materials, paid discovery, monthly service) and support plans (Essential, Business, Managed) without prices or SLAs. | Must |
| FR-08 | FAQ as accessible accordion. | Must |
| FR-09 | Contact form submitted via Astro Action that emails hello@godixy.com (Section 5). | Must |
| FR-10 | Footer with legal name "Godixy Technologies EIRL", contact email, nav links, language switcher, copyright year. | Must |
| FR-11 | EN/ES content with browser language auto-detection on first visit and a manual switcher. | Must |
| FR-12 | Sticky header with section navigation and mobile menu. | Must |
| FR-13 | Persist manual language choice across visits. | Should |
| FR-14 | Services explorer CTA pre-selects "service interest" in the form. | Should |
| FR-15 | Subtle scroll/hover animations and interactive GDF timeline. | Should |
| FR-16 | Privacy notice page/section linked from form consent and footer. | Should |
| FR-17 | Privacy-friendly analytics (no cookies) — tool to be decided. | Could |
| FR-18 | Dark mode. | Won't (this release) |

## 3. Non-functional requirements

| ID | Category | Requirement |
| --- | --- | --- |
| NFR-01 | Performance | Lighthouse Performance ≥ 90 on mobile and desktop for both locales; LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms. |
| NFR-02 | Quality scores | Lighthouse Accessibility, Best Practices and SEO ≥ 90 each. |
| NFR-03 | Accessibility | WCAG 2.1 AA: semantic landmarks, one H1 per page, keyboard operability, visible focus, text contrast ≥ 4.5:1 (3:1 large text/UI), labelled inputs, error messages linked via `aria-describedby`, skip link. |
| NFR-04 | Reduced motion | With `prefers-reduced-motion: reduce`, non-essential animation is disabled; no content depends on motion; nothing flashes > 3 times/s. |
| NFR-05 | SEO | Per-locale URLs (e.g. `/en/`, `/es/`), `<html lang>`, `hreflang` en/es/x-default, canonical, localized title/description, Open Graph, sitemap, robots.txt, Organization JSON-LD with legal name. |
| NFR-06 | Security | Server-side validation; honeypot + rate limiting; secrets only in environment variables; no user input echoed unescaped into email HTML; security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy); HTTPS only. |
| NFR-07 | Privacy | Collect only form fields listed; explicit consent before submission; no form data stored beyond email delivery unless decided; no third-party trackers without consent; privacy notice in EN/ES. |
| NFR-08 | i18n | No hardcoded UI strings; all copy from locale files; ES and EN at parity. |
| NFR-09 | Brand | Follow style guide: Inter, Navy `#101E38`, Teal `#4EACC4`, Soft Teal `#E2F4F6`, spacing 4–64 px, radii 8/12/16 px. |
| NFR-10 | Compatibility | Latest 2 versions of Chrome, Safari, Firefox, Edge; responsive 320 px–1920 px. |
| NFR-11 | Maintainability | Astro static output for content; server only for the Action endpoint. |

## 4. Acceptance criteria per section

**Global**
- **AC-01** First visit with browser language `es*` renders ES; any other language renders EN.
- **AC-02** The switcher changes language on the same section without losing scroll context; choice persists on reload.
- **AC-03** Every section in the content inventory (Section 7) exists in EN and ES with no untranslated strings.
- **AC-04** All interactive elements are reachable and operable by keyboard with visible focus.
- **AC-05** With reduced motion enabled, no scroll/parallax/auto-playing animation runs.
- **AC-06** Lighthouse ≥ 90 in all four categories on `/en/` and `/es/` (mobile profile).
- **AC-07** No metric, client name, logo or testimonial appears that is not approved by Godixy.

**Hero** — **AC-08** Shows headline, sub-headline and two CTAs; primary CTA scrolls to Contact, secondary to Services.

**Trust pillars** — **AC-09** Displays Precision, Continuity and Clarity with descriptions matching the approved values text.

**Services** — **AC-10** All six services listed; selecting a service (click, Enter or Space) shows its detail; state exposed via ARIA (tabs or disclosure pattern). **AC-11** Each detail includes the scope items from the brief (e.g. CMS integration, payment gateways, SSL, technical training).

**How we work** — **AC-12** Shows 10 GDF phases in order, gates G1–G9 positioned between phases, phase 10 shown as ongoing support without a gate. **AC-13** Explains Lite, Standard and Advanced tiers and that tier depends on complexity, data, integrations and failure impact.

**Who we serve** — **AC-14** Covers small, medium and large companies, executives and IT teams.

**About** — **AC-15** Mission, vision (5–10 year horizon) and three values match the approved texts.

**Engagement & support** — **AC-16** Four engagement models and three support plans shown. **AC-17** No prices, SLAs, response times or uptime figures appear.

**FAQ** — **AC-18** Accordion items toggle via mouse and keyboard; `aria-expanded` reflects state.

**Contact** — **AC-19** Valid submission sends one email to hello@godixy.com with all fields and locale, and shows a localized success message. **AC-20** Invalid fields show localized inline errors, focus moves to the first invalid field, entered data is kept. **AC-21** Filled honeypot returns a generic success response and sends no email. **AC-22** Server failure shows a localized error with the fallback address hello@godixy.com. **AC-23** Submit button is disabled while sending (no double submission).

**Footer** — **AC-24** Shows "Godixy Technologies EIRL", hello@godixy.com, nav links, language switcher, privacy link and current year.

**SEO** — **AC-25** Each locale page has correct `lang`, canonical and reciprocal `hreflang` (en, es, x-default) validated with a hreflang checker.

## 5. Contact form fields and validation

Validation runs on client (UX) and is enforced on server (Astro Action schema). Messages localized EN/ES.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| Name | text | Yes | Trimmed, 2–100 chars. |
| Email | email | Yes | Valid email format, ≤ 254 chars. |
| Company | text | Yes* | Trimmed, 2–120 chars. *Required status to confirm (D-04). |
| Company size | select | Yes | One of: 1–10, 11–50, 51–250, 251–1000, 1000+ employees (bands to confirm, D-05). |
| Service interest | select | Yes | One of the six services, or "Not sure / other". |
| Message | textarea | Yes | Trimmed, 20–2000 chars; live character counter. |
| Consent | checkbox | Yes | Must be checked; label links to privacy notice. |
| Honeypot | hidden text | No | Visually hidden, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden`; must be empty. |
| Locale | hidden | Auto | `en` or `es`, from current page. |

Additional rules: reject unknown select values server-side; strip control characters; set `Reply-To` to the sender's email; rate limit per IP (threshold to confirm, D-06).

## 6. Out of scope

- Blog, case studies, portfolio, careers or news pages.
- Client portal, login, CMS for site content.
- Prices, SLAs, response times or contractual terms.
- Invented metrics, client logos, testimonials or certifications.
- Live chat, chatbot, scheduling/booking integrations.
- CRM integration or database storage of leads (unless decided in D-03).
- Languages other than EN and ES.
- Paid advertising, marketing automation, newsletter.

## 7. Content inventory

| Section | EN required | ES required | Content source |
| --- | --- | --- | --- |
| Header / navigation | Yes | Yes | Section list |
| Hero | Yes | Yes | To be written; tone per references |
| Trust pillars | Yes | Yes | Values in brief |
| Services explorer (6) | Yes | Yes | Service list in brief |
| How we work (GDF) | Yes | Yes | `GDF.md` phases, gates, tiers |
| Who we serve | Yes | Yes | Audience in brief |
| About (mission, vision, values) | Yes | Yes | Brief (approved text) |
| Engagement models & support plans | Yes | Yes | Brief (no prices/SLAs) |
| FAQ | Yes | Yes | To be written; needs approval |
| Contact form + messages | Yes | Yes | Section 5 |
| Privacy notice | Yes | Yes | To be written; legal review |
| Footer | Yes | Yes | Legal name, email |
| SEO metadata (title, description, OG) | Yes | Yes | To be written |

## 8. Risks and open decisions (require human approval)

| ID | Item | Proposed default |
| --- | --- | --- |
| D-01 | Email delivery provider for the Astro Action (e.g. Resend, SMTP) and hosting adapter. | To decide with Architecture (F5). |
| D-02 | Domain, sender address and SPF/DKIM/DMARC for godixy.com. | Required before G8. |
| D-03 | Store leads beyond email? Retention period? | No storage. |
| D-04 | Is Company required? | Required. |
| D-05 | Company size bands. | As listed in Section 5. |
| D-06 | Rate-limit threshold and anti-spam (honeypot only vs. CAPTCHA). | Honeypot + 5 requests/IP/hour. |
| D-07 | Privacy notice text and applicable law (Peru, Ley 29733, assumed from EIRL form). | Legal review needed. |
| D-08 | FAQ questions and final copy approval in EN and ES. | Draft by content owner. |
| D-09 | Analytics tool, if any. | None at launch. |

- **R-01** Teal `#4EACC4` on white is ≈2.6:1 contrast — fails AA for text; use only for decoration/large accents or a darker teal variant for text.
- **R-02** Heavy interactivity may push Lighthouse below 90; prefer CSS animation and island hydration only where needed.
- **R-03** Content approval delays (FAQ, hero copy, privacy) may block G7.

**Next owner:** Elena Cruz / parent coordinator to request G2 human validation, then Gabriel Núñez (architecture, D-01) and Marcos Peralta (UX/UI).
