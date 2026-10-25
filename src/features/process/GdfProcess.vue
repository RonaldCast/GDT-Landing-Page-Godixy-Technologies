<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import type { Dictionary } from '@/shared/i18n/en';
import { animateIn } from '@/shared/motion/animate-in';
import { prefersReducedMotion } from '@/shared/motion/prefers-motion';
import { bindScrollStory, type ScrollStoryHandle } from '@/shared/motion/scroll-story';

const props = defineProps<{ t: Dictionary['process'] }>();

const active = ref(0);
const tier = ref(0);
const stepRefs = ref<HTMLButtonElement[]>([]);
const tierRefs = ref<HTMLButtonElement[]>([]);
const trackRef = ref<HTMLElement | null>(null);
const storyTrackRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const detailRef = ref<HTMLElement | null>(null);
const tierPanelRef = ref<HTMLElement | null>(null);
let story: ScrollStoryHandle | null = null;

const total = computed(() => props.t.phases.length);
const phase = computed(() => props.t.phases[active.value]);
const currentTier = computed(() => props.t.tiers[tier.value]);
const gateFor = (index: number) => (index < total.value - 1 ? `G${index + 1}` : null);

async function updateProgress(animate: boolean) {
  const track = trackRef.value;
  if (!track) return;
  const ratio = total.value > 1 ? active.value / (total.value - 1) : 0;
  if (!animate || prefersReducedMotion()) {
    track.style.setProperty('--progress', String(ratio));
    return;
  }
  const anime = await import('@/shared/motion/anime');
  const from = Number.parseFloat(track.style.getPropertyValue('--progress') || '0');
  anime.animate(track, { '--progress': [from, ratio], duration: 500, ease: 'outCubic' });
}

async function applyPhase(index: number, focus = false) {
  const next = Math.min(Math.max(index, 0), total.value - 1);
  if (next === active.value) {
    if (focus) stepRefs.value[next]?.focus();
    return;
  }
  active.value = next;
  if (focus) stepRefs.value[next]?.focus();
  await nextTick();
  void animateIn(detailRef.value ? Array.from(detailRef.value.children) : null, 30);
}

function selectPhase(index: number, focus = false) {
  void applyPhase(index, focus).then(() => story?.syncTo(active.value));
}

async function selectTier(index: number, focus = false) {
  const count = props.t.tiers.length;
  const next = (index + count) % count;
  if (next === tier.value) return;
  tier.value = next;
  if (focus) tierRefs.value[next]?.focus();
  await nextTick();
  void animateIn(tierPanelRef.value ? Array.from(tierPanelRef.value.querySelectorAll('[data-row]')) : null, 50);
}

function onStepKey(event: KeyboardEvent, index: number) {
  const map: Record<string, number> = {
    ArrowRight: index + 1,
    ArrowDown: index + 1,
    ArrowLeft: index - 1,
    ArrowUp: index - 1,
    Home: 0,
    End: total.value - 1,
  };
  const target = map[event.key];
  if (target !== undefined) {
    event.preventDefault();
    void selectPhase(target, true);
  }
}

function onTierKey(event: KeyboardEvent, index: number) {
  const map: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, ArrowDown: index + 1, ArrowUp: index - 1 };
  const target = map[event.key];
  if (target !== undefined) {
    event.preventDefault();
    void selectTier(target, true);
  }
}

watch(active, () => void updateProgress(true));
onMounted(() => {
  void updateProgress(false);
  if (!storyTrackRef.value || !stageRef.value) return;
  story = bindScrollStory({
    track: storyTrackRef.value,
    stage: stageRef.value,
    count: () => total.value,
    onIndex: (index) => {
      void applyPhase(index);
    },
  });
});
onUnmounted(() => story?.destroy());
</script>

<template>
  <div class="gdf">
    <ul class="principles" :aria-label="t.principlesTitle">
      <li v-for="(p, i) in t.principles" :key="p" class="principle">
        <span class="principle__n" aria-hidden="true">{{ i + 1 }}</span>
        {{ p }}
      </li>
    </ul>

    <div ref="storyTrackRef" class="story" :style="{ '--steps': total }">
      <div ref="stageRef" class="story__stage">
        <p class="story__hint">{{ t.scrollHint }}</p>
        <div class="timeline">
          <div ref="trackRef" class="track" aria-hidden="true"><span class="track__fill"></span></div>
          <div class="steps" role="tablist" :aria-label="t.title">
            <button
              v-for="(item, i) in t.phases"
              :id="`gdf-step-${i}`"
              :key="item.title"
              ref="stepRefs"
              type="button"
              role="tab"
              class="step"
              :class="{ 'step--done': i < active }"
              :aria-selected="i === active"
              aria-controls="gdf-phase-panel"
              :tabindex="i === active ? 0 : -1"
              @click="selectPhase(i)"
              @keydown="onStepKey($event, i)"
            >
              <span class="step__dot">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="step__title">{{ item.title }}</span>
            </button>
          </div>
        </div>

        <div
          v-if="phase"
          id="gdf-phase-panel"
          ref="detailRef"
          class="detail"
          role="tabpanel"
          :aria-labelledby="`gdf-step-${active}`"
        >
          <div class="detail__meta">
            <span class="badge">{{ t.phaseLabel }} {{ String(active + 1).padStart(2, '0') }}</span>
            <span class="badge badge--gate">{{ gateFor(active) ? `${t.gateLabel} ${gateFor(active)}` : t.ongoingLabel }}</span>
          </div>
          <h3>{{ phase.title }}</h3>
          <p class="detail__text">{{ phase.text }}</p>
          <div class="detail__cols">
            <div>
              <p class="mini-label">{{ t.deliverablesLabel }}</p>
              <ul class="check-list">
                <li v-for="d in phase.deliverables" :key="d">{{ d }}</li>
              </ul>
            </div>
            <div class="exit">
              <p class="mini-label">{{ t.exitLabel }}</p>
              <p>{{ phase.exit }}</p>
            </div>
          </div>
          <div class="detail__nav">
            <button type="button" class="nav-btn" :disabled="active === 0" @click="selectPhase(active - 1)">
              <span aria-hidden="true">←</span> {{ t.previous }}
            </button>
            <span class="detail__count" aria-hidden="true">{{ active + 1 }} / {{ total }}</span>
            <button type="button" class="nav-btn" :disabled="active === total - 1" @click="selectPhase(active + 1)">
              {{ t.next }} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
      <div class="story__snaps" aria-hidden="true">
        <span v-for="i in total" :key="i" class="story__snap"></span>
      </div>
    </div>

    <div class="tiers">
      <div class="tiers__head">
        <h3>{{ t.tiersTitle }}</h3>
        <p>{{ t.tiersIntro }}</p>
      </div>
      <div class="tiers__switch" role="tablist" :aria-label="t.tiersLabel">
        <button
          v-for="(item, i) in t.tiers"
          :id="`gdf-tier-${i}`"
          :key="item.name"
          ref="tierRefs"
          type="button"
          role="tab"
          class="tier-btn"
          :aria-selected="i === tier"
          aria-controls="gdf-tier-panel"
          :tabindex="i === tier ? 0 : -1"
          @click="selectTier(i)"
          @keydown="onTierKey($event, i)"
        >
          GDF {{ item.name }}
        </button>
      </div>
      <div
        v-if="currentTier"
        id="gdf-tier-panel"
        ref="tierPanelRef"
        class="tier-panel"
        role="tabpanel"
        :aria-labelledby="`gdf-tier-${tier}`"
      >
        <div class="tier-panel__intro">
          <p>{{ currentTier.when }}</p>
          <p class="tier-panel__examples">{{ currentTier.examples }}</p>
        </div>
        <dl class="tier-rows">
          <div v-for="(aspect, i) in t.aspects" :key="aspect" class="tier-row" data-row>
            <dt>{{ aspect }}</dt>
            <dd>{{ currentTier.rows[i] }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gdf {
  display: grid;
  gap: var(--space-7);
}

.story__hint {
  color: var(--color-teal);
}

.story[data-scroll-story='on'] .story__stage {
  min-height: 0;
  gap: var(--space-3);
  padding-block: var(--space-3) 0;
}

.story[data-scroll-story='on'] + .tiers {
  margin-top: calc(var(--space-3) - var(--space-7));
  padding-top: var(--space-4);
}

.story[data-scroll-story='on'] .detail {
  gap: var(--space-3);
  padding: var(--space-5);
}

.story[data-scroll-story='on'] .detail h3 {
  font-size: 1.375rem;
}

.principles {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.principle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4) var(--space-2) var(--space-2);
  border: 1px solid rgb(255 255 255 / 0.16);
  border-radius: var(--radius-pill);
  font-size: 0.875rem;
  color: var(--color-white);
}

.principle__n {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--color-teal);
  color: var(--color-navy);
  font-size: 0.75rem;
  font-weight: 700;
}

.timeline {
  position: relative;
  overflow-x: auto;
  padding-bottom: var(--space-3);
  scrollbar-width: thin;
  scrollbar-color: rgb(255 255 255 / 0.25) transparent;
}

.track {
  --progress: 0;
  position: absolute;
  top: 21px;
  left: 22px;
  right: 22px;
  min-width: calc(960px - 44px);
  height: 2px;
  background: rgb(255 255 255 / 0.15);
}

.track__fill {
  position: absolute;
  inset: 0;
  background: var(--color-teal);
  transform-origin: left center;
  transform: scaleX(var(--progress));
}

.steps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(10, minmax(96px, 1fr));
  min-width: 960px;
}

.step {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-1) var(--space-2);
  background: none;
  border: 0;
  border-radius: var(--radius-card);
  color: var(--color-on-navy-muted);
  cursor: pointer;
  text-align: center;
}

.step__dot {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 2px solid rgb(255 255 255 / 0.25);
  background: var(--color-navy);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-white);
  transition:
    background-color var(--duration-base) var(--ease-out),
    border-color var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out);
}

.step__title {
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.3;
}

.step:hover .step__dot {
  border-color: var(--color-teal);
}

.step--done .step__dot {
  border-color: var(--color-teal);
  background: var(--color-navy-800);
}

.step[aria-selected='true'] .step__dot {
  background: var(--color-teal);
  border-color: var(--color-teal);
  color: var(--color-navy);
  transform: scale(1.1);
}

.step[aria-selected='true'] .step__title {
  color: var(--color-white);
  font-weight: 600;
}

.step:focus-visible {
  box-shadow: 0 0 0 3px var(--color-teal);
}

.detail {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  color: var(--color-navy);
  box-shadow: var(--shadow-lg);
}

.detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.badge {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.badge--gate {
  background: var(--color-soft-teal);
  border-color: transparent;
  color: var(--color-teal-text);
}

.detail h3 {
  font-size: 1.625rem;
}

.detail__text {
  max-width: 760px;
  font-size: var(--text-lead);
  color: var(--color-muted);
}

.detail__cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
}

.mini-label {
  margin-bottom: var(--space-3);
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-teal-text);
}

.exit {
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-panel);
  background: var(--color-surface);
}

.detail__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.detail__count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-muted);
}

.nav-btn {
  min-height: 40px;
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
  background: var(--color-white);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
}

.nav-btn:hover:not(:disabled) {
  border-color: var(--color-navy);
}

.nav-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.tiers {
  display: grid;
  gap: var(--space-5);
  padding-top: var(--space-6);
  border-top: 1px solid rgb(255 255 255 / 0.12);
}

.tiers__head {
  display: grid;
  gap: var(--space-2);
  max-width: 720px;
}

.tiers__head h3 {
  color: var(--color-white);
}

.tiers__head p {
  color: var(--color-on-navy-muted);
}

.tiers__switch {
  display: inline-flex;
  width: fit-content;
  padding: 4px;
  border-radius: var(--radius-pill);
  background: rgb(255 255 255 / 0.08);
}

.tier-btn {
  min-height: 40px;
  padding: var(--space-2) var(--space-5);
  border: 0;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-on-navy-muted);
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition:
    background-color var(--duration-base) var(--ease-out),
    color var(--duration-base) var(--ease-out);
}

.tier-btn[aria-selected='true'] {
  background: var(--color-teal);
  color: var(--color-navy);
}

.tier-btn:focus-visible {
  box-shadow: 0 0 0 3px var(--color-white);
}

.tier-panel {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: var(--space-6);
  padding: var(--space-6);
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: var(--radius-lg);
  background: rgb(255 255 255 / 0.04);
}

.tier-panel__intro {
  display: grid;
  gap: var(--space-3);
  align-content: start;
  color: var(--color-white);
  font-size: var(--text-lead);
}

.tier-panel__examples {
  font-size: 0.9375rem;
  color: var(--color-on-navy-muted);
}

.tier-rows {
  margin: 0;
  display: grid;
  gap: var(--space-2);
}

.tier-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-card);
  background: rgb(255 255 255 / 0.06);
}

.tier-row dt {
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-teal);
  align-self: center;
}

.tier-row dd {
  margin: 0;
  color: var(--color-white);
}

@media (max-width: 860px) {
  .detail__cols,
  .tier-panel {
    grid-template-columns: 1fr;
  }

  .tier-row {
    grid-template-columns: 1fr;
    gap: var(--space-1);
  }

  .detail {
    padding: var(--space-5);
  }
}
</style>
