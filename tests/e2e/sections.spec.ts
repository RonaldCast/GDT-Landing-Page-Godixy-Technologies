import { expect, test } from '@playwright/test';
import { hydrated } from './helpers';

test('hero CTAs point to contact and services (AC-08)', async ({ page }) => {
  await page.goto('/en/');
  const hero = page.locator('main section').first();
  await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(hero.locator('a[href="#contact"]')).toBeVisible();
  await expect(hero.locator('a[href="#services"]')).toBeVisible();
});

test('trust pillars show the three values (AC-09)', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('.pillar__value')).toHaveText(['Precision', 'Continuity', 'Clarity']);
  await page.goto('/es/');
  await expect(page.locator('.pillar__value')).toHaveText(['Precisión', 'Continuidad', 'Claridad']);
});

test('services tabs work with the keyboard (AC-10, AC-11)', async ({ page }) => {
  await page.goto('/en/#services');
  const first = await hydrated(page, '#service-tab-custom-software');
  await expect(page.getByRole('tab', { selected: true }).first()).toHaveId('service-tab-custom-software');

  await first.focus();
  await page.keyboard.press('ArrowDown');
  const second = page.locator('#service-tab-integration');
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#service-panel-integration')).toBeVisible();

  await page.keyboard.press('End');
  await expect(page.locator('#service-tab-cloud')).toHaveAttribute('aria-selected', 'true');
});

test('service CTA preselects the service in the contact form', async ({ page }) => {
  await page.goto('/en/#services');
  await (await hydrated(page, '#service-tab-automation')).click();
  await page.locator('#service-panel-automation a[href="#contact"]').click();
  await hydrated(page, '#service');
  await expect(page.locator('#service')).toHaveValue('automation');
});

test('GDF timeline shows 10 phases with gates (AC-12)', async ({ page }) => {
  await page.goto('/en/#process');
  const step1 = await hydrated(page, '#gdf-step-0');
  await expect(page.locator('#process [role="tablist"]').first().getByRole('tab')).toHaveCount(10);

  await step1.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#gdf-step-1')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#gdf-phase-panel')).toContainText('G2');

  await page.keyboard.press('End');
  await expect(page.locator('#gdf-phase-panel')).toContainText('Ongoing');
  await expect(page.locator('#gdf-phase-panel').getByRole('button', { name: /next/i })).toBeDisabled();
});

test('GDF tiers switch content (AC-13)', async ({ page }) => {
  await page.goto('/en/#process');
  const lite = await hydrated(page, '#gdf-tier-0');
  await lite.click();
  const before = await page.locator('#gdf-tier-panel').innerText();
  await page.locator('#gdf-tier-2').click();
  await expect(page.locator('#gdf-tier-2')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#gdf-tier-panel')).not.toHaveText(before);
  await expect(page.locator('#gdf-tier-panel dl > div')).toHaveCount(5);
});

test('FAQ works with the keyboard (AC-18)', async ({ page }) => {
  await page.goto('/en/#faq');
  const summaries = page.locator('#faq summary');
  await expect(summaries.first()).toBeVisible();
  const second = page.locator('#faq details').nth(1);
  await expect(second).not.toHaveAttribute('open');
  await summaries.nth(1).focus();
  await page.keyboard.press('Enter');
  await expect(second).toHaveAttribute('open', '');
  await expect(page.locator('#faq details[open]')).toHaveCount(1);
});

test('values, mission and vision are present in both languages', async ({ page }) => {
  await page.goto('/en/#about');
  for (const value of ['Precision', 'Continuity', 'Clarity']) {
    await expect(page.locator('#about')).toContainText(value);
  }
  await page.goto('/es/#about');
  for (const value of ['Precisión', 'Continuidad', 'Claridad']) {
    await expect(page.locator('#about')).toContainText(value);
  }
});

test('footer shows the contact email and legal name (AC-24)', async ({ page }) => {
  await page.goto('/es/');
  const footer = page.locator('footer');
  await expect(footer.locator('a[href="mailto:hello@godixy.com"]')).toBeVisible();
  await expect(footer).toContainText('Godixy');
  await expect(footer).toContainText('Godixy Technologies EIRL');
  await expect(footer).toContainText(String(new Date().getFullYear()));
  await expect(footer.locator('.lang')).toBeVisible();

  await footer.locator('a[href="/es/privacy/"]').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Aviso de privacidad');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/en\/privacy\/$/);
  await expect(page.locator('header .lang a[hreflang="en"]')).toHaveAttribute('href', '/en/privacy/');
});

test('unknown paths render the 404 page', async ({ page }) => {
  const res = await page.goto('/en/does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.locator('a[href="/en/"]').first()).toBeVisible();
});
