export const INTRO_DONE_EVENT = 'godixy:intro-done';
export const INTRO_EXIT_MS = 500;

export function isIntroBlocking(): boolean {
  if (typeof document === 'undefined') return false;
  const state = document.documentElement.dataset.intro;
  return state === 'playing' || state === 'exiting';
}

export function finishIntro(): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.intro = 'done';
  const overlay = document.querySelector<HTMLElement>('[data-intro-root]');
  overlay?.setAttribute('inert', '');
  overlay?.setAttribute('aria-hidden', 'true');
  root.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

export function beginIntroExit(): void {
  if (typeof document === 'undefined') return;
  if (document.documentElement.dataset.intro === 'done') return;
  document.documentElement.dataset.intro = 'exiting';
}

/** Resolves immediately when the intro is absent, skipped, or already done. */
export function waitForIntroDone(): Promise<void> {
  if (typeof document === 'undefined' || !isIntroBlocking()) return Promise.resolve();
  return new Promise((resolve) => {
    document.documentElement.addEventListener(INTRO_DONE_EVENT, () => resolve(), { once: true });
  });
}
