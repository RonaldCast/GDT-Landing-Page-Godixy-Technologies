import { expect, type Locator, type Page } from '@playwright/test';

/** Closes the home intro so the rest of the page is usable. */
export async function dismissIntro(page: Page): Promise<void> {
  const state = await page.locator('html').getAttribute('data-intro');
  if (state !== 'playing' && state !== 'exiting') return;

  await page
    .waitForFunction(() => {
      const island = document.querySelector('[data-intro-root] astro-island');
      return Boolean(island && !island.hasAttribute('ssr'));
    })
    .catch(() => undefined);
  await page.keyboard.press('Escape');

  await expect(page.locator('html')).toHaveAttribute('data-intro', 'done', { timeout: 8_000 });
  await expect(page.locator('[data-intro-root]')).toBeHidden();

  const hash = new URL(page.url()).hash;
  if (hash) await page.locator(hash).scrollIntoViewIfNeeded();
}

export async function openLanding(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await dismissIntro(page);
}

/**
 * Scrolls to `selector` (client:visible islands only hydrate in view) and waits until the
 * enclosing Astro island has hydrated, which Astro signals by removing its `ssr` attribute.
 */
export async function hydrated(page: Page, selector: string): Promise<Locator> {
  const target = page.locator(selector).first();
  await target.scrollIntoViewIfNeeded();
  await page.waitForFunction((sel) => {
    const island = document.querySelector(sel)?.closest('astro-island');
    return Boolean(island && !island.hasAttribute('ssr'));
  }, selector);
  return target;
}

/** Waits until no reveal animation is mid-flight (partial opacity skews contrast checks). */
export async function revealsSettled(page: Page): Promise<void> {
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll('[data-reveal], [data-reveal-item]')).every((el) => {
      const opacity = Number(getComputedStyle(el).opacity);
      return opacity === 0 || opacity === 1;
    }),
  );
}

/** Waits until a smooth anchor scroll has brought `selector` near the top of the viewport. */
export async function scrolledTo(page: Page, selector: string): Promise<void> {
  await page.waitForFunction((sel) => {
    const top = document.querySelector(sel)?.getBoundingClientRect().top ?? Infinity;
    return Math.abs(top) < 120;
  }, selector);
}
