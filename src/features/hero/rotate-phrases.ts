import { waitForIntroDone } from '@/features/intro/intro-state';
import { prefersReducedMotion } from '@/shared/motion/prefers-motion';

const HOLD_MS = 4000;

/** Cycles stacked hero phrases after the intro, and pauses while the tab is hidden. */
export function startHeroPhrases(root: HTMLElement): void {
  if (prefersReducedMotion()) return;

  const phrases = [...root.querySelectorAll<HTMLElement>('[data-hero-phrase]')];
  if (phrases.length < 2) return;

  let index = phrases.findIndex((el) => el.hasAttribute('data-active'));
  if (index < 0) index = 0;
  let timer = 0;

  const show = (next: number) => {
    phrases[index]?.removeAttribute('data-active');
    index = next;
    phrases[index]?.setAttribute('data-active', '');
  };

  const stop = () => {
    window.clearInterval(timer);
    timer = 0;
  };

  const arm = () => {
    stop();
    if (document.hidden) return;
    timer = window.setInterval(() => {
      if (document.hidden) return;
      show((index + 1) % phrases.length);
    }, HOLD_MS);
  };

  document.addEventListener('visibilitychange', arm);
  void waitForIntroDone().then(arm);
}
