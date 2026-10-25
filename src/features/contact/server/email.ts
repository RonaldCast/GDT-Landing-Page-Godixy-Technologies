import { getDictionary } from '@/shared/i18n/utils';
import type { ContactData } from '../schema';

export interface ContactEmail {
  subject: string;
  text: string;
  html: string;
  replyTo: string;
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Removes CR/LF so user input can never inject extra mail headers. */
const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

export function buildContactEmail(data: ContactData): ContactEmail {
  // Internal notification is always in English; the visitor's language is reported.
  const labels = getDictionary('en').contact.form;
  const rows: [string, string][] = [
    ['Name', singleLine(data.name)],
    ['Email', singleLine(data.email)],
    ['Company', singleLine(data.company) || '-'],
    ['Company size', labels.companySizes[data.companySize]],
    ['Service', labels.services[data.service]],
    ['Language', data.locale.toUpperCase()],
  ];

  const subject = singleLine(`[godixy.com] ${labels.services[data.service]} - ${data.name}`).slice(0, 180);

  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', 'Message:', data.message].join('\n');

  const html = `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;color:#101E38">
<h2 style="margin:0 0 16px">New project request</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#4A5668">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
    .join('')}</table>
<h3 style="margin:24px 0 8px">Message</h3>
<p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(data.message)}</p>
</body></html>`;

  return { subject, text, html, replyTo: singleLine(data.email) };
}
