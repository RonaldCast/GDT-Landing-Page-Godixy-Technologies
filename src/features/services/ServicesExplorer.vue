<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import type { Dictionary } from '@/shared/i18n/en';
import { icons } from '@/shared/ui/icons';
import { animateIn } from '@/shared/motion/animate-in';
import { setServiceIntent } from '@/features/contact/service-intent';

const props = defineProps<{ t: Dictionary['services'] }>();

const active = ref(0);
const tabRefs = ref<HTMLButtonElement[]>([]);
const panelRef = ref<HTMLElement | null>(null);
const current = computed(() => props.t.items[active.value] ?? props.t.items[0]);

async function select(index: number, focus = false) {
  const count = props.t.items.length;
  const next = (index + count) % count;
  const changed = next !== active.value;
  active.value = next;
  if (focus) tabRefs.value[next]?.focus();
  if (changed) {
    await nextTick();
    void animateIn(panelRef.value ? Array.from(panelRef.value.children) : null);
  }
}

function onKeydown(event: KeyboardEvent, index: number) {
  const keys: Record<string, () => void> = {
    ArrowDown: () => select(index + 1, true),
    ArrowRight: () => select(index + 1, true),
    ArrowUp: () => select(index - 1, true),
    ArrowLeft: () => select(index - 1, true),
    Home: () => select(0, true),
    End: () => select(props.t.items.length - 1, true),
  };
  const action = keys[event.key];
  if (action) {
    event.preventDefault();
    action();
  }
}

function talkAboutService() {
  if (current.value) setServiceIntent(current.value.id);
}
</script>

<template>
  <div class="explorer">
    <div class="explorer__tabs" role="tablist" :aria-label="t.listLabel" aria-orientation="vertical">
      <button
        v-for="(item, i) in t.items"
        :id="`service-tab-${item.id}`"
        :key="item.id"
        ref="tabRefs"
        type="button"
        role="tab"
        class="tab"
        :aria-selected="i === active"
        :aria-controls="`service-panel-${item.id}`"
        :tabindex="i === active ? 0 : -1"
        @click="select(i)"
        @keydown="onKeydown($event, i)"
      >
        <span class="tab__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path v-for="d in icons[item.id]" :key="d" :d="d" />
          </svg>
        </span>
        <span class="tab__text">
          <span class="tab__index">0{{ i + 1 }}</span>
          <span class="tab__title">{{ item.title }}</span>
        </span>
      </button>
    </div>

    <div
      v-if="current"
      :id="`service-panel-${current.id}`"
      ref="panelRef"
      class="panel"
      role="tabpanel"
      :aria-labelledby="`service-tab-${current.id}`"
      tabindex="0"
    >
      <h3>{{ current.title }}</h3>
      <p class="panel__summary">{{ current.summary }}</p>
      <ul class="check-list">
        <li v-for="point in current.points" :key="point">{{ point }}</li>
      </ul>
      <div class="panel__outcome">
        <p class="panel__outcome-label">{{ t.outcomeLabel }}</p>
        <p>{{ current.outcome }}</p>
      </div>
      <a class="panel__cta" href="#contact" @click="talkAboutService">
        {{ t.cta }}
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path v-for="d in icons.arrow" :key="d" :d="d" />
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
.explorer {
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) 1.1fr;
  gap: var(--space-5);
  align-items: start;
}

.explorer__tabs {
  display: grid;
  gap: var(--space-2);
}

.tab {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  width: 100%;
  padding: var(--space-4);
  text-align: left;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-panel);
  cursor: pointer;
  transition:
    border-color var(--duration-base) var(--ease-out),
    background-color var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out);
}

.tab:hover {
  border-color: var(--color-border-strong);
}

.tab[aria-selected='true'] {
  border-color: var(--color-navy);
  background: var(--color-navy);
  box-shadow: var(--shadow-md);
}

.tab__icon {
  flex: none;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-card);
  background: var(--color-soft-teal);
  color: var(--color-teal-text);
}

.tab[aria-selected='true'] .tab__icon {
  background: rgb(78 172 196 / 0.18);
  color: var(--color-teal);
}

.tab__text {
  display: grid;
  gap: 2px;
}

.tab__index {
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-muted);
}

.tab__title {
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-navy);
}

.tab[aria-selected='true'] .tab__index {
  color: var(--color-teal);
}

.tab[aria-selected='true'] .tab__title {
  color: var(--color-white);
}

.panel {
  position: sticky;
  top: calc(var(--header-height) + var(--space-5));
  display: grid;
  gap: var(--space-5);
  padding: var(--space-7) var(--space-6);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.panel h3 {
  font-size: 1.625rem;
}

.panel__summary {
  font-size: var(--text-lead);
  color: var(--color-muted);
}

.panel__outcome {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-5);
  border-left: 3px solid var(--color-teal);
  border-radius: var(--radius-card);
  background: var(--color-soft-teal);
}

.panel__outcome-label {
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-teal-text);
}

.panel__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  width: fit-content;
  font-weight: 600;
  color: var(--color-navy);
  text-decoration: none;
  border-bottom: 2px solid var(--color-teal);
  padding-bottom: 2px;
}

.panel__cta:hover {
  color: var(--color-teal-text);
}

@media (max-width: 860px) {
  .explorer {
    grid-template-columns: 1fr;
  }

  .explorer__tabs {
    grid-auto-flow: column;
    grid-auto-columns: minmax(220px, 1fr);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: var(--space-2);
  }

  .tab {
    scroll-snap-align: start;
  }

  .panel {
    position: static;
    padding: var(--space-6) var(--space-5);
  }
}
</style>
