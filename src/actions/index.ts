import { ActionError, defineAction } from 'astro:actions';
import { TRUST_PROXY } from 'astro:env/server';
import { contactSchema } from '@/features/contact/schema';
import { handleContact } from '@/features/contact/server/handle-contact';
import { getMailSender } from '@/features/contact/server/mailer';
import { createRateLimiter } from '@/features/contact/server/rate-limit';

const rateLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const errorCodes = {
  rate_limited: 'TOO_MANY_REQUESTS',
  unavailable: 'SERVICE_UNAVAILABLE',
  send_failed: 'INTERNAL_SERVER_ERROR',
} as const;

function clientKey(request: Request, clientAddress: string): string {
  if (TRUST_PROXY) {
    const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    if (forwarded) return forwarded;
  }
  return clientAddress;
}

/** Astro's checkOrigin only covers form posts; JSON requests are checked here. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export const server = {
  contact: {
    send: defineAction({
      accept: 'json',
      input: contactSchema,
      handler: async (input, context) => {
        if (!isSameOrigin(context.request)) {
          throw new ActionError({ code: 'FORBIDDEN', message: 'cross_origin' });
        }
        const result = await handleContact(input, clientKey(context.request, context.clientAddress), {
          rateLimiter,
          send: getMailSender(),
          logger: console,
          devMode: import.meta.env.DEV,
        });
        if (!result.ok) {
          throw new ActionError({ code: errorCodes[result.reason], message: result.reason });
        }
        return { sent: true };
      },
    }),
  },
};
