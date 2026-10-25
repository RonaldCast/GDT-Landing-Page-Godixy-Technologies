/** Maps 0–1 scroll progress onto equal tab segments. The last index is reached at 1. */
export function indexFromProgress(progress: number, count: number): number {
  if (count <= 1) return 0;
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(count - 1, Math.floor(clamped * count));
}

/** Progress at the centre of a segment, so a click does not sit on a boundary. */
export function progressForIndex(index: number, count: number): number {
  if (count <= 1) return 0;
  const i = Math.min(count - 1, Math.max(0, index));
  return (i + 0.5) / count;
}
