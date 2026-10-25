import { describe, expect, it, vi } from 'vitest';
import { contactSchema, fieldErrors, type ContactData } from '@/features/contact/schema';
import { buildMailto } from '@/features/contact/mailto';
import { buildContactEmail } from '@/features/contact/server/email';
import { handleContact, type ContactDeps } from '@/features/contact/server/handle-contact';
import { createRateLimiter } from '@/features/contact/server/rate-limit';
import { en } from '@/shared/i18n/en';

const valid = {
  name: 'Ana Pérez',
  email: 'ana@example.com',
  company: 'ACME SRL',
  companySize: 'medium',
  service: 'integration',
  message: 'We need to integrate our ERP with an online payment gateway.',
  consent: true,
  website: '',
  locale: 'es',
} as const;

const parse = (overrides: Record<string, unknown> = {}) => contactSchema.safeParse({ ...valid, ...overrides });

describe('contactSchema', () => {
  it('accepts a valid submission and trims values', () => {
    const result = parse({ name: '  Ana Pérez  ' });
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('Ana Pérez');
  });

  it('defaults optional fields', () => {
    const { company: _c, website: _w, locale: _l, ...rest } = valid;
    const result = contactSchema.parse(rest);
    expect(result).toMatchObject({ company: '', website: '', locale: 'en' });
  });

  it.each([
    ['name', { name: 'A' }],
    ['email', { email: 'not-an-email' }],
    ['companySize', { companySize: 'huge' }],
    ['service', { service: 'crypto' }],
    ['message', { message: 'too short' }],
    ['message', { message: 'x'.repeat(2001) }],
    ['consent', { consent: false }],
    ['company', { company: 'x'.repeat(201) }],
  ])('reports %s errors as field keys', (field, overrides) => {
    const result = parse(overrides);
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrors(result.error)).toHaveProperty(field, field);
  });

  it('maps every field error key to localized copy', () => {
    const result = contactSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      for (const key of Object.keys(fieldErrors(result.error))) {
        expect(en.contact.form.errors).toHaveProperty(key);
      }
    }
  });
});

describe('rate limiter', () => {
  it('allows up to the limit inside the window, then blocks', () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(limiter.hit('ip', 0)).toBe(true);
    expect(limiter.hit('ip', 10)).toBe(true);
    expect(limiter.hit('ip', 20)).toBe(false);
    expect(limiter.hit('other', 20)).toBe(true);
  });

  it('allows again after the window slides', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.hit('ip', 0)).toBe(true);
    expect(limiter.hit('ip', 999)).toBe(false);
    expect(limiter.hit('ip', 1000)).toBe(true);
  });
});

describe('buildContactEmail', () => {
  const data = contactSchema.parse(valid);

  it('includes all fields and the visitor language', () => {
    const email = buildContactEmail(data);
    expect(email.text).toContain('Ana Pérez');
    expect(email.text).toContain('ACME SRL');
    expect(email.text).toContain('Medium (51-250 people)');
    expect(email.text).toContain('Language: ES');
    expect(email.replyTo).toBe('ana@example.com');
    expect(email.subject).toContain('Systems implementation & integration');
  });

  it('prevents header injection and escapes HTML', () => {
    const email = buildContactEmail({
      ...data,
      name: 'Eve\r\nBcc: victim@example.com',
      message: '<script>alert(1)</script> and some more text',
    } as ContactData);
    expect(email.subject).not.toMatch(/[\r\n]/);
    expect(email.html).not.toContain('<script>');
    expect(email.html).toContain('&lt;script&gt;');
  });
});

describe('handleContact', () => {
  const data = contactSchema.parse(valid);
  const deps = (overrides: Partial<ContactDeps> = {}): ContactDeps => ({
    rateLimiter: createRateLimiter({ limit: 5, windowMs: 60_000 }),
    send: vi.fn().mockResolvedValue(undefined),
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
    devMode: false,
    ...overrides,
  });

  it('sends exactly one email for a valid submission (AC-19)', async () => {
    const d = deps();
    await expect(handleContact(data, 'ip', d)).resolves.toEqual({ ok: true });
    expect(d.send).toHaveBeenCalledTimes(1);
  });

  it('silently drops honeypot submissions (AC-21)', async () => {
    const d = deps();
    await expect(handleContact({ ...data, website: 'https://spam.example' }, 'ip', d)).resolves.toEqual({ ok: true });
    expect(d.send).not.toHaveBeenCalled();
  });

  it('rate limits per client', async () => {
    const d = deps({ rateLimiter: createRateLimiter({ limit: 1, windowMs: 60_000 }) });
    await handleContact(data, 'ip', d);
    await expect(handleContact(data, 'ip', d)).resolves.toEqual({ ok: false, reason: 'rate_limited' });
  });

  it('reports unavailable when SMTP is missing in production (AC-22)', async () => {
    await expect(handleContact(data, 'ip', deps({ send: null }))).resolves.toEqual({ ok: false, reason: 'unavailable' });
  });

  it('logs instead of failing when SMTP is missing in development', async () => {
    const d = deps({ send: null, devMode: true });
    await expect(handleContact(data, 'ip', d)).resolves.toEqual({ ok: true });
    expect(d.logger.info).toHaveBeenCalled();
  });

  it('maps transport errors to send_failed without leaking details', async () => {
    const d = deps({ send: vi.fn().mockRejectedValue(new Error('535 auth failed')) });
    await expect(handleContact(data, 'ip', d)).resolves.toEqual({ ok: false, reason: 'send_failed' });
  });
});

describe('buildMailto', () => {
  it('produces an encoded mailto link with the draft', () => {
    const href = buildMailto('hello@godixy.com', en.contact.form, {
      name: 'Ana & Co',
      email: 'ana@example.com',
      service: 'cloud',
      message: 'Line 1\nLine 2',
    });
    expect(href.startsWith('mailto:hello@godixy.com?subject=')).toBe(true);
    const body = decodeURIComponent(new URL(href).searchParams.get('body') ?? '');
    expect(body).toContain('Cloud infrastructure & IT services');
    expect(body).toContain('Line 1\nLine 2');
    expect(href).not.toContain('&Co');
  });
});
