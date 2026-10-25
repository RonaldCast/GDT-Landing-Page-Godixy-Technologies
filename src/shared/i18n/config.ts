export const languages = ['en', 'es'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'en';
export const LANG_COOKIE = 'lang';

export const languageNames: Record<Lang, string> = {
  en: 'English',
  es: 'Español',
};

export const htmlLang: Record<Lang, string> = {
  en: 'en',
  es: 'es',
};

export const ogLocale: Record<Lang, string> = {
  en: 'en_US',
  es: 'es_DO',
};

export const companySizes = ['small', 'medium', 'large', 'enterprise'] as const;
export type CompanySize = (typeof companySizes)[number];

export const serviceIds = [
  'custom-software',
  'integration',
  'support',
  'consulting',
  'automation',
  'cloud',
] as const;
export type ServiceId = (typeof serviceIds)[number];

export const serviceInterests = [...serviceIds, 'other'] as const;
export type ServiceInterest = (typeof serviceInterests)[number];
