import { defaultLang, languages, type Lang } from './config';
import { en, type Dictionary } from './en';
import { es } from './es';

const dictionaries: Record<Lang, Dictionary> = { en, es };

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (languages as readonly string[]).includes(value);
}

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang];
}

export function getLangFromUrl(url: URL): Lang {
  const [, segment] = url.pathname.split('/');
  return isLang(segment) ? segment : defaultLang;
}

export function localizedPath(lang: Lang, hash = ''): string {
  return `/${lang}/${hash}`;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'es' : 'en';
}

/**
 * Picks the best supported language from an Accept-Language header,
 * honouring q-values (e.g. "es-DO,es;q=0.9,en;q=0.8").
 */
export function parseAcceptLanguage(header: string | null | undefined): Lang | null {
  if (!header) return null;
  const candidates = header
    .split(',')
    .map((part, index) => {
      const [tag = '', ...params] = part.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
      return { base: tag.toLowerCase().split('-')[0] ?? '', q: Number.isNaN(q) ? 0 : q, index };
    })
    .filter((c) => c.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  return candidates.map((c) => c.base).find(isLang) ?? null;
}

/** Resolution order: explicit cookie choice, then browser preference, then default. */
export function resolvePreferredLang(
  cookieValue: string | null | undefined,
  acceptLanguage: string | null | undefined,
): Lang {
  if (isLang(cookieValue)) return cookieValue;
  return parseAcceptLanguage(acceptLanguage) ?? defaultLang;
}
