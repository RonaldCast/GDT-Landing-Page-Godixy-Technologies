import { expect, test } from '@playwright/test';
import { hydrated, openLanding } from './helpers';

test('mobile menu opens, traps Escape and closes on navigation', async ({ page }) => {
  await openLanding(page, '/es/');
  const toggle = await hydrated(page, 'button[aria-controls="mobile-nav-panel"]');
  await expect(page.locator('header nav.desktop-nav')).toBeHidden();

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const panel = page.locator('#mobile-nav-panel');
  await expect(panel).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();

  await toggle.click();
  await panel.locator('a[href="#services"]').click();
  await expect(panel).toBeHidden();
  await expect(page).toHaveURL(/#services$/);
});

test('no horizontal overflow on a phone', async ({ page }) => {
  await openLanding(page, '/en/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
