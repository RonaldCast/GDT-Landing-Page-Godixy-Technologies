import { expect, test, type Page } from '@playwright/test';
import { hydrated } from './helpers';

async function openForm(page: Page, lang = 'en') {
  await page.goto(`/${lang}/#contact`);
  await hydrated(page, '#contact form');
}

async function fillValid(page: Page) {
  await page.fill('#name', 'QA Tester');
  await page.fill('#email', 'qa@example.com');
  await page.selectOption('#companySize', 'small');
  await page.selectOption('#service', 'support');
  await page.fill('#message', 'Automated end-to-end test of the contact form.');
  await page.check('#consent');
}

test('invalid submission shows localized errors and focuses the first field (AC-20)', async ({ page }) => {
  await openForm(page, 'es');
  await page.getByRole('button', { name: 'Enviar' }).click();
  await expect(page.locator('#name')).toBeFocused();
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#name')).toHaveAttribute('aria-describedby', /name-error/);
  await expect(page.locator('#contact [role="alert"]')).toBeVisible();
  await expect(page.locator('#email-error')).toBeVisible();
});

test('server failure keeps the data and offers a mailto fallback (AC-22, AC-23)', async ({ page }) => {
  await openForm(page);
  await fillValid(page);
  await page.getByRole('button', { name: /send/i }).click();

  const alert = page.locator('#contact [role="alert"]');
  await expect(alert).toBeFocused();
  const mailto = alert.locator('a[href^="mailto:hello@godixy.com"]');
  await expect(mailto).toBeVisible();
  expect(decodeURIComponent((await mailto.getAttribute('href')) ?? '')).toContain('Automated end-to-end test');
  await expect(page.locator('#message')).toHaveValue('Automated end-to-end test of the contact form.');
  await expect(page.getByRole('button', { name: /send/i })).toBeEnabled();
});

test('submit is disabled while sending (AC-19)', async ({ page }) => {
  await openForm(page);
  await page.route('**/_actions/**', async (route) => {
    await new Promise((r) => setTimeout(r, 800));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await fillValid(page);
  await page.locator('#contact button[type="submit"]').click();
  await expect(page.locator('#contact button[type="submit"]')).toBeDisabled();
});

test('rejects cross-origin action calls', async ({ request }) => {
  const res = await request.post('/_actions/contact.send', {
    headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' },
    data: {
      name: 'Mallory',
      email: 'mallory@example.com',
      companySize: 'small',
      service: 'other',
      message: 'Cross-origin request that must be refused.',
      consent: true,
    },
  });
  expect(res.status()).toBe(403);
});
