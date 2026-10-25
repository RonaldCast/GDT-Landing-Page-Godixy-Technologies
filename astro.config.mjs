// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import vue from '@astrojs/vue';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://godixy.com',
  output: 'static',
  // Standalone handler (static files + on-demand routes), wrapped by server.mjs to add security headers.
  adapter: node({ mode: 'standalone' }),
  integrations: [vue()],
  trailingSlash: 'ignore',
  markdown: { syntaxHighlight: false },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  env: {
    schema: {
      SMTP_HOST: envField.string({ context: 'server', access: 'secret', optional: true }),
      SMTP_PORT: envField.number({ context: 'server', access: 'secret', default: 587 }),
      SMTP_SECURE: envField.boolean({ context: 'server', access: 'secret', default: false }),
      SMTP_USER: envField.string({ context: 'server', access: 'secret', optional: true }),
      SMTP_PASS: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO: envField.string({
        context: 'server',
        access: 'secret',
        default: 'hello@godixy.com',
      }),
      CONTACT_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
      TRUST_PROXY: envField.boolean({ context: 'server', access: 'public', default: false }),
    },
  },
  security: {
    checkOrigin: true,
    // Hash-based CSP emitted as a <meta> tag so it also covers prerendered pages.
    // Headers that cannot live in <meta> (frame-ancestors, HSTS...) are set in server.mjs.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' mailto:",
      ],
    },
  },
});
