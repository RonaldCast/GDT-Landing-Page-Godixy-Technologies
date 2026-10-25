import type { ContactData } from '../schema';
import { buildContactEmail, type ContactEmail } from './email';
import type { RateLimiter } from './rate-limit';

export type ContactFailure = 'rate_limited' | 'unavailable' | 'send_failed';

export type ContactResult = { ok: true } | { ok: false; reason: ContactFailure };

export interface ContactDeps {
  rateLimiter: RateLimiter;
  /** Null when no mail transport is configured. */
  send: ((email: ContactEmail) => Promise<void>) | null;
  logger: Pick<Console, 'info' | 'warn' | 'error'>;
  /** In development an unconfigured transport logs the email instead of failing. */
  devMode: boolean;
}

export async function handleContact(data: ContactData, clientKey: string, deps: ContactDeps): Promise<ContactResult> {
  if (!deps.rateLimiter.hit(clientKey)) {
    return { ok: false, reason: 'rate_limited' };
  }

  // Bots that fill the hidden field get a success response and nothing is sent.
  if (data.website.length > 0) {
    deps.logger.warn('[contact] honeypot triggered; submission dropped');
    return { ok: true };
  }

  const email = buildContactEmail(data);

  if (!deps.send) {
    if (deps.devMode) {
      deps.logger.info(`[contact] SMTP not configured; email not sent (dev).\nSubject: ${email.subject}\n${email.text}`);
      return { ok: true };
    }
    deps.logger.error('[contact] SMTP not configured; returning unavailable');
    return { ok: false, reason: 'unavailable' };
  }

  try {
    await deps.send(email);
    return { ok: true };
  } catch (error) {
    deps.logger.error('[contact] failed to send email', error instanceof Error ? error.message : error);
    return { ok: false, reason: 'send_failed' };
  }
}
