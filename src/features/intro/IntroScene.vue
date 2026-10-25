<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { isLowPowerDevice, prefersReducedMotion, supportsWebGL } from '@/shared/motion/prefers-motion';
import { beginIntroExit, finishIntro, INTRO_EXIT_MS } from './intro-state';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const stageRef = ref<HTMLDivElement | null>(null);
const overlayRef = ref<HTMLDivElement | null>(null);
const lit = ref(false);

const disposers: Array<() => void> = [];
let finished = false;

function disposeAll() {
  while (disposers.length) disposers.pop()?.();
}

function releaseOverlay() {
  if (finished) return;
  finished = true;
  disposeAll();
  beginIntroExit();
  window.setTimeout(() => {
    finishIntro();
    document.getElementById('hero-title')?.focus({ preventScroll: true });
  }, INTRO_EXIT_MS);
}

function skipIntro() {
  lit.value = true;
  releaseOverlay();
}

onMounted(async () => {
  if (prefersReducedMotion() || document.documentElement.dataset.intro === 'done') {
    finishIntro();
    return;
  }

  await nextTick();
  overlayRef.value?.focus({ preventScroll: true });

  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || finished) return;
    event.preventDefault();
    skipIntro();
  };
  const onFocusIn = (event: FocusEvent) => {
    if (finished) return;
    const overlay = document.querySelector('[data-intro-root]');
    if (overlay && event.target instanceof Node && !overlay.contains(event.target)) {
      overlayRef.value?.focus({ preventScroll: true });
    }
  };
  window.addEventListener('keydown', onKey);
  document.addEventListener('focusin', onFocusIn);
  disposers.push(() => {
    window.removeEventListener('keydown', onKey);
    document.removeEventListener('focusin', onFocusIn);
  });

  if (isLowPowerDevice() || !supportsWebGL()) {
    lit.value = true;
    window.setTimeout(releaseOverlay, 400);
    return;
  }

  const container = stageRef.value;
  const canvas = canvasRef.value;
  if (!container || !canvas) {
    finishIntro();
    return;
  }

  try {
    const { createLogoScene } = await import('./logo-scene');
    const dispose = createLogoScene({
      container,
      canvas,
      onAssembled: () => {
        lit.value = true;
      },
      onComplete: releaseOverlay,
    });
    disposers.push(dispose);
  } catch {
    lit.value = true;
    releaseOverlay();
  }
});

onBeforeUnmount(disposeAll);
</script>

<template>
  <div ref="overlayRef" class="intro-scene" tabindex="-1">
    <div ref="stageRef" class="intro-scene__stage" :class="{ 'intro-scene__stage--lit': lit }">
      <canvas ref="canvasRef" class="intro-scene__canvas" aria-hidden="true"></canvas>
    </div>
  </div>
</template>

<style scoped>
.intro-scene {
  position: relative;
  width: 100%;
  min-height: 100dvh;
}

.intro-scene__stage {
  position: absolute;
  inset: 0;
  overflow: visible;
}

.intro-scene__stage::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(42vw, 260px);
  height: min(42vw, 260px);
  border-radius: 50%;
  background: radial-gradient(circle, rgb(78 172 196 / 0.34), rgb(78 172 196 / 0.04) 46%, transparent 72%);
  filter: blur(28px);
  opacity: 0.35;
  transform: translate(-50%, -50%) scale(0.86);
  transition:
    opacity 700ms var(--ease-out),
    transform 700ms var(--ease-out);
}

.intro-scene__stage--lit::before {
  opacity: 0.9;
  transform: translate(-50%, -50%) scale(1);
}

.intro-scene:focus {
  outline: none;
}

.intro-scene__canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  animation: intro-canvas-in 700ms var(--ease-out) both;
}

@keyframes intro-canvas-in {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
