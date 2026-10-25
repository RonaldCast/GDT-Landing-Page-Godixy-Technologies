import type { Dictionary } from '@/shared/i18n/en';

export const navSectionIds = ['services', 'process', 'audience', 'about', 'engagement', 'faq'] as const;
export type NavSectionId = (typeof navSectionIds)[number];

export interface NavItem {
  id: NavSectionId;
  label: string;
  href: string;
}

export function buildNavItems(nav: Dictionary['nav']): NavItem[] {
  return navSectionIds.map((id) => ({ id, label: nav.links[id], href: `#${id}` }));
}
