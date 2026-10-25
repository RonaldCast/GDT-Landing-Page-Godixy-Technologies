import { describe, expect, it } from 'vitest';
import { indexFromProgress, progressForIndex } from '@/shared/motion/scroll-index';

describe('indexFromProgress', () => {
  it('splits the track into equal segments and lands on the last index at the end', () => {
    expect(indexFromProgress(0, 6)).toBe(0);
    expect(indexFromProgress(0.16, 6)).toBe(0);
    expect(indexFromProgress(1 / 6, 6)).toBe(1);
    expect(indexFromProgress(0.99, 6)).toBe(5);
    expect(indexFromProgress(1, 6)).toBe(5);
    expect(indexFromProgress(1, 10)).toBe(9);
  });

  it('clamps out-of-range progress and empty counts', () => {
    expect(indexFromProgress(-1, 6)).toBe(0);
    expect(indexFromProgress(2, 6)).toBe(5);
    expect(indexFromProgress(0.5, 1)).toBe(0);
    expect(indexFromProgress(0.5, 0)).toBe(0);
  });
});

describe('progressForIndex', () => {
  it('returns the centre of each segment', () => {
    expect(progressForIndex(0, 6)).toBeCloseTo(0.5 / 6);
    expect(progressForIndex(5, 6)).toBeCloseTo(5.5 / 6);
    expect(indexFromProgress(progressForIndex(3, 6), 6)).toBe(3);
    expect(indexFromProgress(progressForIndex(7, 10), 10)).toBe(7);
  });

  it('clamps out-of-range indexes', () => {
    expect(progressForIndex(-1, 6)).toBe(progressForIndex(0, 6));
    expect(progressForIndex(99, 6)).toBe(progressForIndex(5, 6));
    expect(progressForIndex(0, 1)).toBe(0);
  });
});
