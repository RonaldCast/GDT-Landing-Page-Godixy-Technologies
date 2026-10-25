<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { isLowPowerDevice, prefersReducedMotion, supportsWebGL } from '@/shared/motion/prefers-motion';
import { logoBlocks, satelliteBlocks, toSvgRects } from './blocks';

defineProps<{ label: string }>();

const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const live = ref(false);
const rects = toSvgRects([...satelliteBlocks, ...logoBlocks]);

let cleanup: (() => void) | null = null;

onMounted(async () => {
  const container = containerRef.value;
  const canvas = canvasRef.value;
  if (!container || !canvas) return;
  if (prefersReducedMotion() || isLowPowerDevice() || !supportsWebGL()) return;

  try {
    const { createBlocksScene } = await import('./blocks-scene');
    cleanup = createBlocksScene({ container, canvas, onReady: () => (live.value = true) });
  } catch {
    live.value = false;
  }
});

onBeforeUnmount(() => cleanup?.());
</script>

<template>
  <div ref="containerRef" class="scene" :class="{ 'scene--live': live }" role="img" :aria-label="label">
    <svg class="scene__fallback" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <rect
        v-for="r in rects"
        :key="r.key"
        :x="r.x"
        :y="r.y"
        :width="r.w"
        :height="r.h"
        :rx="r.rx"
        :fill="r.fill"
      />
    </svg>
    <canvas ref="canvasRef" class="scene__canvas" aria-hidden="true"></canvas>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  max-width: 560px;
  margin-inline: auto;
}

.scene__fallback,
.scene__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: opacity 600ms var(--ease-out);
}

.scene__fallback {
  padding: 8%;
}

.scene__canvas {
  opacity: 0;
}

.scene--live .scene__canvas {
  opacity: 1;
}

.scene--live .scene__fallback {
  opacity: 0;
}
</style>
