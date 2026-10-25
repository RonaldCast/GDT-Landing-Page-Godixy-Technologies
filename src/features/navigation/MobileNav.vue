<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { NavItem } from './nav-items';

defineProps<{
  items: NavItem[];
  ctaLabel: string;
  openLabel: string;
  closeLabel: string;
  navLabel: string;
}>();

const open = ref(false);
const ready = ref(false);
const toggleRef = ref<HTMLButtonElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);

onMounted(() => {
  ready.value = true;
});

function close(returnFocus = true) {
  open.value = false;
  if (returnFocus) void nextTick(() => toggleRef.value?.focus());
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value) return;
  if (event.key === 'Escape') {
    close();
    return;
  }
  if (event.key !== 'Tab' || !panelRef.value) return;
  const focusable = Array.from(panelRef.value.querySelectorAll<HTMLElement>('a, button'));
  const elements = [toggleRef.value, ...focusable].filter((el): el is HTMLElement => el !== null);
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

watch(open, (isOpen) => {
  document.documentElement.style.overflow = isOpen ? 'hidden' : '';
  if (isOpen) {
    document.addEventListener('keydown', onKeydown);
    void nextTick(() => panelRef.value?.querySelector<HTMLElement>('a')?.focus());
  } else {
    document.removeEventListener('keydown', onKeydown);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
  document.documentElement.style.overflow = '';
});
</script>

<template>
  <div class="mobile-nav">
    <button
      ref="toggleRef"
      type="button"
      class="mobile-nav__toggle"
      :aria-expanded="open"
      aria-controls="mobile-nav-panel"
      :aria-label="open ? closeLabel : openLabel"
      @click="open = !open"
    >
      <span class="bar" :class="{ 'bar--open': open }" aria-hidden="true"></span>
    </button>

    <Teleport v-if="ready" to="body">
      <div id="mobile-nav-panel" ref="panelRef" :hidden="!open" class="mobile-nav__panel">
        <nav :aria-label="navLabel">
          <ul>
            <li v-for="item in items" :key="item.id">
              <a :href="item.href" @click="close(false)">{{ item.label }}</a>
            </li>
          </ul>
        </nav>
        <a class="mobile-nav__cta" href="#contact" @click="close(false)">{{ ctaLabel }}</a>
        <slot />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.mobile-nav__toggle {
  position: relative;
  z-index: 2;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-panel);
  background: var(--color-white);
  cursor: pointer;
}

.bar,
.bar::before,
.bar::after {
  display: block;
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: var(--color-navy);
  transition: transform var(--duration-base) var(--ease-out), background-color var(--duration-base);
}

.bar {
  position: relative;
}

.bar::before,
.bar::after {
  content: '';
  position: absolute;
  left: 0;
}

.bar::before {
  top: -6px;
}

.bar::after {
  top: 6px;
}

.bar--open {
  background: transparent;
}

.bar--open::before {
  transform: translateY(6px) rotate(45deg);
}

.bar--open::after {
  transform: translateY(-6px) rotate(-45deg);
}

.mobile-nav__panel {
  position: fixed;
  inset: var(--header-height) 0 0 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-6) var(--space-5);
  background: var(--color-white);
  border-top: 1px solid var(--color-border);
  overflow-y: auto;
}

.mobile-nav__panel[hidden] {
  display: none;
}

.mobile-nav__panel ul {
  list-style: none;
  display: grid;
  gap: var(--space-1);
}

.mobile-nav__panel nav a {
  display: block;
  padding: var(--space-3) 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-navy);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border);
}

.mobile-nav__cta {
  display: inline-flex;
  justify-content: center;
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-pill);
  background: var(--color-navy);
  color: var(--color-white);
  font-weight: 600;
  text-decoration: none;
}
</style>
