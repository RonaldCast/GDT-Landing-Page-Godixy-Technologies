import { prefersReducedMotion } from './prefers-motion';
import { indexFromProgress, progressForIndex } from './scroll-index';

export const SCROLL_STORY_MIN_WIDTH = 861;

export type ScrollStoryHandle = {
  syncTo: (index: number) => void;
  destroy: () => void;
};

type Options = {
  track: HTMLElement;
  stage: HTMLElement;
  count: number | (() => number);
  onIndex: (index: number) => void;
};

function headerOffset(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 72;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function setPageSnap(active: boolean): void {
  const root = document.documentElement;
  const next = Number(root.dataset.scrollSnapCount || '0') + (active ? 1 : -1);
  if (next > 0) {
    root.dataset.scrollSnapCount = String(next);
    root.dataset.scrollSnap = 'story';
    return;
  }
  delete root.dataset.scrollSnapCount;
  delete root.dataset.scrollSnap;
}

/**
 * Pins `stage` while the user scrolls through `track` and reports the active segment.
 * Off below `SCROLL_STORY_MIN_WIDTH` and when reduced motion is requested.
 */
export function bindScrollStory(options: Options): ScrollStoryHandle {
  const { track, stage, onIndex } = options;
  const countOf = () => {
    const n = typeof options.count === 'function' ? options.count() : options.count;
    return Math.max(1, n);
  };

  const wide = window.matchMedia(`(min-width: ${SCROLL_STORY_MIN_WIDTH}px)`);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let attached = false;
  let frame = 0;
  let lastIndex = -1;
  let locked = false;
  let lockTimer = 0;
  let scrollAnim: { pause: () => void } | null = null;

  const travel = () => Math.max(1, track.offsetHeight - stage.offsetHeight);

  const progress = () => clamp01((headerOffset() - track.getBoundingClientRect().top) / travel());

  const emit = () => {
    const next = indexFromProgress(progress(), countOf());
    if (next === lastIndex) return;
    lastIndex = next;
    onIndex(next);
  };

  const onScroll = () => {
    if (locked || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      emit();
    });
  };

  const stopScrollAnim = () => {
    scrollAnim?.pause();
    scrollAnim = null;
    document.documentElement.style.scrollBehavior = '';
    document.documentElement.style.scrollSnapType = '';
  };

  const clearLock = () => {
    locked = false;
    if (lockTimer) {
      window.clearTimeout(lockTimer);
      lockTimer = 0;
    }
    window.removeEventListener('wheel', releaseScroll);
    window.removeEventListener('touchstart', releaseScroll);
  };

  const releaseScroll = () => {
    stopScrollAnim();
    clearLock();
  };

  const attach = () => {
    if (attached) return;
    attached = true;
    track.dataset.scrollStory = 'on';
    setPageSnap(true);
    window.addEventListener('scroll', onScroll, { passive: true });
    lastIndex = -1;
    emit();
  };

  const detach = () => {
    if (!attached) return;
    attached = false;
    delete track.dataset.scrollStory;
    setPageSnap(false);
    window.removeEventListener('scroll', onScroll);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    releaseScroll();
  };

  const applyMode = () => {
    if (wide.matches && !motion.matches && !prefersReducedMotion()) attach();
    else detach();
  };

  const syncTo = (index: number) => {
    if (!attached) return;
    const count = countOf();
    lastIndex = Math.min(count - 1, Math.max(0, index));
    const top =
      window.scrollY +
      track.getBoundingClientRect().top -
      headerOffset() +
      progressForIndex(lastIndex, count) * travel();
    const from = window.scrollY;
    if (Math.abs(from - top) < 2) return;

    locked = true;
    if (lockTimer) window.clearTimeout(lockTimer);
    window.removeEventListener('wheel', releaseScroll);
    window.removeEventListener('touchstart', releaseScroll);
    window.addEventListener('wheel', releaseScroll, { passive: true });
    window.addEventListener('touchstart', releaseScroll, { passive: true });
    lockTimer = window.setTimeout(releaseScroll, 1100);
    void animateScroll(from, top);
  };

  const animateScroll = async (from: number, top: number) => {
    stopScrollAnim();
    const root = document.documentElement;
    root.style.scrollBehavior = 'auto';
    root.style.scrollSnapType = 'none';
    const anime = await import('./anime');
    const proxy = { y: from };
    scrollAnim = anime.animate(proxy, {
      y: top,
      duration: 900,
      ease: 'outQuint',
      onUpdate: () => {
        window.scrollTo(0, proxy.y);
      },
      onComplete: () => {
        scrollAnim = null;
        root.style.scrollBehavior = '';
        root.style.scrollSnapType = '';
        clearLock();
      },
    });
  };

  wide.addEventListener('change', applyMode);
  motion.addEventListener('change', applyMode);
  applyMode();

  return {
    syncTo,
    destroy() {
      wide.removeEventListener('change', applyMode);
      motion.removeEventListener('change', applyMode);
      detach();
    },
  };
}
