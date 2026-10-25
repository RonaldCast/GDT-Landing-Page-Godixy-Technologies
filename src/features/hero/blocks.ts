export type BlockTone = 'navy' | 'teal' | 'soft';

export interface Block {
  /** Center position in scene units. */
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  tone: BlockTone;
}

export const toneColor: Record<BlockTone, string> = {
  navy: '#101E38',
  teal: '#4EACC4',
  soft: '#BFE6EE',
};

/** Modular composition echoing the Godixy logo icon: navy frame with teal inner blocks. */
export const logoBlocks: Block[] = [
  { x: -0.35, y: 1.15, z: 0, w: 2.3, h: 0.7, d: 0.7, tone: 'navy' },
  { x: -1.15, y: 0.05, z: 0, w: 0.7, h: 1.0, d: 0.7, tone: 'navy' },
  { x: 0.05, y: 0.12, z: 0.15, w: 0.72, h: 0.72, d: 0.72, tone: 'teal' },
  { x: 1.05, y: -0.3, z: 0.05, w: 0.75, h: 1.6, d: 0.75, tone: 'teal' },
  { x: -0.45, y: -1.05, z: 0, w: 2.1, h: 0.7, d: 0.7, tone: 'navy' },
];

/** Small satellites orbiting the composition. */
export const satelliteBlocks: Block[] = [
  { x: 2.3, y: 1.5, z: -0.8, w: 0.4, h: 0.4, d: 0.4, tone: 'teal' },
  { x: -2.4, y: 1.6, z: -1.2, w: 0.32, h: 0.32, d: 0.32, tone: 'soft' },
  { x: -2.2, y: -1.5, z: 0.6, w: 0.45, h: 0.45, d: 0.45, tone: 'soft' },
  { x: 2.1, y: -1.75, z: 0.9, w: 0.3, h: 0.3, d: 0.3, tone: 'navy' },
  { x: 0.9, y: 2.1, z: 0.4, w: 0.26, h: 0.26, d: 0.26, tone: 'navy' },
  { x: -1.0, y: -2.1, z: -0.6, w: 0.34, h: 0.34, d: 0.34, tone: 'teal' },
];

/** Projects blocks onto a 2D viewBox for the static SVG fallback. */
export function toSvgRects(blocks: Block[], size = 400, unit = 70) {
  const c = size / 2;
  return blocks.map((b, i) => ({
    key: i,
    x: c + (b.x - b.w / 2) * unit,
    y: c - (b.y + b.h / 2) * unit,
    w: b.w * unit,
    h: b.h * unit,
    fill: toneColor[b.tone],
    rx: Math.min(b.w, b.h) * unit * 0.28,
  }));
}
