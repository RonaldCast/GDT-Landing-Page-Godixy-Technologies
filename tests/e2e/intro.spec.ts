import { expect, test } from '@playwright/test';
import { hydrated } from './helpers';

test('home shows the intro overlay and Escape reveals the hero (AC-INTRO-1, AC-INTRO-2)', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('data-intro', 'playing');
  await expect(page.locator('[data-intro-root]')).toBeVisible();
  await expect(page.getByRole('button', { name: /skip intro|saltar intro/i })).toHaveCount(0);
  await hydrated(page, '[data-intro-root] canvas');
  await page.keyboard.press('Escape');

  await expect(page.locator('html')).toHaveAttribute('data-intro', 'done');
  await expect(page.locator('[data-intro-root]')).toBeHidden();
  await expect(page.locator('#hero-title')).toBeVisible();
  await expect(page.locator('#hero-title')).toBeFocused();
});

test('reduced motion does not show the overlay (AC-INTRO-3)', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('data-intro', 'done');
  await expect(page.locator('[data-intro-root]')).toBeHidden();
  await expect(page.locator('#hero-title')).toBeVisible();
  await context.close();
});

test('privacy and 404 have no intro (AC-INTRO-4)', async ({ page }) => {
  await page.goto('/en/privacy/');
  await expect(page.locator('[data-intro-root]')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'playing');

  const res = await page.goto('/en/does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.locator('[data-intro-root]')).toHaveCount(0);
});
