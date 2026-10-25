import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { hydrated, openLanding, revealsSettled } from './helpers';

test('health endpoint and security headers', async ({ request }) => {
  const health = await request.get('/api/health');
  expect(await health.json()).toEqual({ status: 'ok' });

  const page = await request.get('/en/');
  const h = page.headers();
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(h['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(await page.text()).toContain('http-equiv="content-security-policy"');
});

test('no CSP violations or console errors while using the page', async ({ page }) => {
  const problems: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(msg.text());
  });
  page.on('pageerror', (err) => problems.push(err.message));
  await openLanding(page, '/en/');
  await hydrated(page, '#service-tab-cloud');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await hydrated(page, '#contact form');
  expect(problems).toEqual([]);
});

test('skip link moves focus to main content (AC-04)', async ({ page }) => {
  await openLanding(page, '/en/');
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur();
    document.documentElement.tabIndex = -1;
    document.documentElement.focus();
  });
  await page.keyboard.press('Tab');
  const skip = page.locator('a.skip-link');
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('the 3D hero goes live with full motion', async ({ page }) => {
  await openLanding(page, '/en/');
  await expect(page.locator('.scene')).toHaveClass(/scene--live/, { timeout: 15_000 });
});

test('reduced motion: static hero and content visible (AC-05)', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/en/');
  await hydrated(page, '.scene');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.scene')).not.toHaveClass(/scene--live/);
  await expect(page.locator('.scene__fallback')).toBeVisible();
  await page.locator('#faq').scrollIntoViewIfNeeded();
  await expect(page.locator('#faq h2')).toHaveCSS('opacity', '1');
  await context.close();
});

for (const lang of ['en', 'es']) {
  test(`axe WCAG 2.2 AA scan (${lang})`, async ({ page }) => {
    await openLanding(page, `/${lang}/`);
    await hydrated(page, '#contact form');
    await revealsSettled(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const summary = results.violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => `${n.target.join(' ')} — ${n.failureSummary ?? ''}`).join('; ')}`,
    );
    expect(summary).toEqual([]);
  });
}
