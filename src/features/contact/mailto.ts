import type { CompanySize, ServiceInterest } from '@/shared/i18n/config';
import type { Dictionary } from '@/shared/i18n/en';

export interface MailtoDraft {
  name: string;
  email: string;
  company?: string | undefined;
  companySize?: CompanySize | undefined;
  service?: ServiceInterest | undefined;
  message: string;
}

/** Builds a prefilled mailto: link so a visitor never loses their message if sending fails. */
export function buildMailto(to: string, form: Dictionary['contact']['form'], data: MailtoDraft): string {
  const lines = [
    `${form.name}: ${data.name}`,
    `${form.email}: ${data.email}`,
    `${form.company}: ${data.company ?? ''}`,
    `${form.companySize}: ${data.companySize ? form.companySizes[data.companySize] : ''}`,
    `${form.service}: ${data.service ? form.services[data.service] : ''}`,
    '',
    data.message,
  ];
  const subject = `${form.mailtoSubject} - ${data.name}`.trim();
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}
