import { expect, test } from '@playwright/test';
import { dismissIntro, hydrated, openLanding, scrolledTo } from './helpers';

test.describe('language negotiation (AC-01)', () => {
  test('Spanish browser lands on /es/', async ({ request }) => {
    const res = await request.get('/', { headers: { 'Accept-Language': 'es-DO,es;q=0.9' }, maxRedirects: 0 });
    expect(res.status()).toBe(302);
    expect(res.headers()['location']).toBe('/es/');
    expect(res.headers()['vary']).toContain('Accept-Language');
  });

  test('other browsers land on /en/', async ({ request }) => {
    const res = await request.get('/', { headers: { 'Accept-Language': 'fr-FR' }, maxRedirects: 0 });
    expect(res.headers()['location']).toBe('/en/');
  });

  test('a saved choice overrides the browser language', async ({ request }) => {
    const res = await request.get('/', {
      headers: { 'Accept-Language': 'es', Cookie: 'lang=en' },
      maxRedirects: 0,
    });
    expect(res.headers()['location']).toBe('/en/');
  });

  test('pages declare their language', async ({ page }) => {
    await openLanding(page, '/es/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await openLanding(page, '/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

test('switching language keeps the section and persists (AC-02)', async ({ page, context }) => {
  await openLanding(page, '/en/');
  const es = await hydrated(page, 'header .lang a[hreflang="es"]');
  await page.evaluate(() => document.getElementById('process')?.scrollIntoView({ behavior: 'instant' }));
  await scrolledTo(page, '#process');
  await expect(es).toBeVisible();
  // click() would first scroll the sticky header link "into view", moving the page.
  await es.dispatchEvent('click');
  await page.waitForURL(/\/es\//);
  await dismissIntro(page);
  expect(new URL(page.url()).hash).toBe('#process');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');

  const cookies = await context.cookies();
  expect(cookies.find((c) => c.name === 'lang')?.value).toBe('es');

  await page.goto('/');
  await expect(page).toHaveURL(/\/es\/$/);
  await dismissIntro(page);
});

test('hreflang alternates and canonical (AC-25)', async ({ page }) => {
  await openLanding(page, '/en/');
  const alternates = page.locator('link[rel="alternate"][hreflang]');
  await expect(alternates).toHaveCount(3);
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', /\/es\/$/);
  // x-default is the negotiating root, which redirects by cookie / Accept-Language.
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', /^https?:\/\/[^/]+\/$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/$/);
});
