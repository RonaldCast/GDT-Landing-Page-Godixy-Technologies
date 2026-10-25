import { z } from 'astro/zod';
import { companySizes, languages, serviceInterests } from '@/shared/i18n/config';

export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 2000;

/** Error messages are field keys; the UI maps them to localized copy. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'name').max(100, 'name'),
  email: z.string().trim().pipe(z.email('email').max(254, 'email')),
  company: z.string().trim().max(200, 'company').optional().default(''),
  companySize: z.enum(companySizes, 'companySize'),
  service: z.enum(serviceInterests, 'service'),
  message: z.string().trim().min(MESSAGE_MIN, 'message').max(MESSAGE_MAX, 'message'),
  consent: z.literal(true, 'consent'),
  /** Honeypot: humans never see it. A filled value is accepted but silently dropped by the action. */
  website: z.string().max(500).optional().default(''),
  locale: z.enum(languages).default('en'),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactField = Exclude<keyof ContactData, 'website' | 'locale'>;

export const contactFields: readonly ContactField[] = [
  'name',
  'email',
  'company',
  'companySize',
  'service',
  'message',
  'consent',
];

/** Returns the first error key per field, e.g. { email: 'email' }. */
export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const result: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && (contactFields as readonly string[]).includes(field)) {
      const key = field as ContactField;
      result[key] ??= key;
    }
  }
  return result;
}
