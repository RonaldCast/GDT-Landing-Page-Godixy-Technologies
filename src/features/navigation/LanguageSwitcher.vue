<script setup lang="ts">
import { LANG_COOKIE, languages, languageNames, type Lang } from '@/shared/i18n/config';

const props = defineProps<{
  current: Lang;
  label: string;
  tone?: 'light' | 'dark';
  /** Sub-page path below the locale, e.g. `privacy/`. */
  path?: string;
}>();

const ONE_YEAR = 60 * 60 * 24 * 365;

/** The section under the sticky header, so the other language opens at the same place. */
function currentSectionHash(): string {
  const offset = window.innerHeight * 0.35;
  const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
  const inView = sections.filter((s) => s.getBoundingClientRect().top <= offset).pop();
  return inView ? `#${inView.id}` : '';
}

function choose(event: MouseEvent, lang: Lang) {
  event.preventDefault();
  const secure = window.location.protocol === 'https:' ? '; secure' : '';
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${ONE_YEAR}; samesite=lax${secure}`;
  if (lang === props.current) return;
  window.location.assign(`/${lang}/${props.path ?? ''}${currentSectionHash()}`);
}
</script>

<template>
  <nav class="lang" :class="`lang--${tone ?? 'light'}`" :aria-label="label">
    <a
      v-for="lang in languages"
      :key="lang"
      :href="`/${lang}/${path ?? ''}`"
      :hreflang="lang"
      :lang="lang"
      :aria-current="lang === current ? 'true' : undefined"
      :title="languageNames[lang]"
      class="lang__option"
      @click="choose($event, lang)"
    >
      <span aria-hidden="true">{{ lang.toUpperCase() }}</span>
      <span class="visually-hidden">{{ languageNames[lang] }}</span>
    </a>
  </nav>
</template>

<style scoped>
.lang {
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-white);
}

.lang__option {
  min-width: 40px;
  min-height: 32px;
  display: inline-grid;
  place-items: center;
  padding: 0 var(--space-3);
  border-radius: var(--radius-pill);
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-decoration: none;
  color: var(--color-muted);
  transition:
    background-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);
}

.lang__option:hover {
  color: var(--color-navy);
}

.lang__option[aria-current='true'] {
  background: var(--color-navy);
  color: var(--color-white);
}

.lang--dark {
  background: transparent;
  border-color: rgb(255 255 255 / 0.25);
}

.lang--dark .lang__option {
  color: var(--color-on-navy-muted);
}

.lang--dark .lang__option[aria-current='true'] {
  background: var(--color-teal);
  color: var(--color-navy);
}
</style>
