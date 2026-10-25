import { prefersReducedMotion } from './prefers-motion';

/**
 * Scroll reveal for `[data-reveal]` elements. Children marked `[data-reveal-item]`
 * are staggered. Elements already visible on load are left untouched so there is
 * no flash of hidden content; with reduced motion nothing is hidden at all.
 */
export async function initReveal(root: ParentNode = document): Promise<void> {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const pending = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
    (el) => el.getBoundingClientRect().top > window.innerHeight,
  );
  if (pending.length === 0) return;

  const targetsOf = (el: HTMLElement): HTMLElement[] => {
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal-item]'));
    return items.length > 0 ? items : [el];
  };

  for (const el of pending) {
    for (const target of targetsOf(el)) target.style.opacity = '0';
  }

  let anime: typeof import('./anime');
  try {
    anime = await import('./anime');
  } catch {
    for (const el of pending) for (const target of targetsOf(el)) target.style.opacity = '';
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);
        anime.animate(targetsOf(el), {
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 700,
          ease: 'outExpo',
          delay: anime.stagger(80),
          onComplete: (self) => {
            for (const t of self.targets as HTMLElement[]) t.style.transform = '';
          },
        });
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );

  for (const el of pending) observer.observe(el);
}
