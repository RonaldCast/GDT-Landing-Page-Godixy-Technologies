import nodemailer, { type Transporter } from 'nodemailer';
import { CONTACT_FROM, CONTACT_TO, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_SECURE, SMTP_USER } from 'astro:env/server';
import type { ContactEmail } from './email';

let transporter: Transporter | null = null;

/** Returns a sender bound to the configured SMTP transport, or null when SMTP is not configured. */
export function getMailSender(): ((email: ContactEmail) => Promise<void>) | null {
  if (!SMTP_HOST) return null;

  transporter ??= nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  const from = CONTACT_FROM ?? SMTP_USER ?? CONTACT_TO;
  const mailer = transporter;

  return async (email) => {
    await mailer.sendMail({
      from,
      to: CONTACT_TO,
      replyTo: email.replyTo,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  };
}
