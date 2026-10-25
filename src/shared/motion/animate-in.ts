import { prefersReducedMotion } from './prefers-motion';

/** Small entrance animation for content swapped by an island (tabs, steppers). */
export async function animateIn(target: Element | Element[] | null | undefined, stagger = 40): Promise<void> {
  if (!target || prefersReducedMotion()) return;
  const targets = Array.isArray(target) ? target : [target];
  if (targets.length === 0) return;
  const anime = await import('./anime');
  anime.animate(targets, {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 600,
    ease: 'outQuint',
    delay: anime.stagger(stagger),
  });
}
