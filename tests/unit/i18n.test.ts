import { describe, expect, it } from 'vitest';
import { en } from '@/shared/i18n/en';
import { es } from '@/shared/i18n/es';
import {
  getLangFromUrl,
  isLang,
  localizedPath,
  otherLang,
  parseAcceptLanguage,
  resolvePreferredLang,
} from '@/shared/i18n/utils';

describe('parseAcceptLanguage', () => {
  it.each([
    ['es-DO,es;q=0.9,en;q=0.8', 'es'],
    ['en-US,en;q=0.9', 'en'],
    ['fr-FR,fr;q=0.9,es;q=0.5', 'es'],
    ['fr-FR,de;q=0.9', null],
    ['en;q=0.2,es;q=0.8', 'es'],
    ['es;q=0,en', 'en'],
    ['', null],
  ])('%s -> %s', (header, expected) => {
    expect(parseAcceptLanguage(header)).toBe(expected);
  });

  it('handles a missing header', () => {
    expect(parseAcceptLanguage(null)).toBeNull();
    expect(parseAcceptLanguage(undefined)).toBeNull();
  });
});

describe('resolvePreferredLang', () => {
  it('prefers a valid cookie over the browser language', () => {
    expect(resolvePreferredLang('en', 'es-ES,es')).toBe('en');
  });

  it('ignores an invalid cookie', () => {
    expect(resolvePreferredLang('fr', 'es-ES,es')).toBe('es');
  });

  it('falls back to English', () => {
    expect(resolvePreferredLang(undefined, 'de-DE')).toBe('en');
    expect(resolvePreferredLang(undefined, undefined)).toBe('en');
  });
});

describe('url helpers', () => {
  it('reads the language from the path', () => {
    expect(getLangFromUrl(new URL('https://godixy.com/es/#services'))).toBe('es');
    expect(getLangFromUrl(new URL('https://godixy.com/xx/'))).toBe('en');
  });

  it('builds localized paths and toggles languages', () => {
    expect(localizedPath('es', '#contact')).toBe('/es/#contact');
    expect(otherLang('en')).toBe('es');
    expect(isLang('es')).toBe(true);
    expect(isLang('ES')).toBe(false);
  });
});

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** Collects every leaf path, including array indexes, to compare dictionary shapes. */
function shape(value: unknown, path = ''): string[] {
  if (Array.isArray(value)) return [`${path}[${value.length}]`, ...value.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, Json>).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
  }
  return [path];
}

function leaves(value: unknown, path = ''): [string, string][] {
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, Json>).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return typeof value === 'string' ? [[path, value]] : [];
}

describe('dictionary parity (AC-03)', () => {
  it('EN and ES have identical keys and list lengths', () => {
    expect(shape(es)).toEqual(shape(en));
  });

  it('has no empty strings', () => {
    for (const [path, text] of [...leaves(en), ...leaves(es)]) {
      expect(text.trim(), path).not.toBe('');
    }
  });

  it('translates prose (ES differs from EN except for names, ids and loanwords)', () => {
    const allowedSame = /(^|\.)(id|email|legalName|name)$|tiers\[\d]\.name|plans\[\d]\.name|process\.title$/;
    const loanwords = new Set(['Cookies']);
    const esLeaves = new Map(leaves(es));
    const untranslated = leaves(en).filter(
      ([path, text]) =>
        !allowedSame.test(path) && !loanwords.has(text) && text.length > 3 && esLeaves.get(path) === text,
    );
    expect(untranslated).toEqual([]);
  });

  it('process tiers have one row per aspect', () => {
    for (const dict of [en, es]) {
      for (const tier of dict.process.tiers) expect(tier.rows).toHaveLength(dict.process.aspects.length);
    }
  });

  it('describes 10 phases and 6 services (AC-10, AC-12)', () => {
    expect(en.process.phases).toHaveLength(10);
    expect(en.services.items).toHaveLength(6);
  });

  it('shows four engagement models and three support plans (AC-16)', () => {
    expect(en.engagement.models).toHaveLength(4);
    expect(en.engagement.plans).toHaveLength(3);
  });

  it('includes the scope items from the brief (AC-11)', () => {
    const points = en.services.items.flatMap((s) => s.points).join('\n');
    for (const term of [/CMS/, /payment gateway/i, /SSL/, /training/i]) expect(points).toMatch(term);
  });
});

describe('content guardrails (AC-07, AC-17)', () => {
  it('shows no prices, uptime or response-time figures', () => {
    const text = [...leaves(en), ...leaves(es)].map(([, t]) => t).join('\n');
    expect(text).not.toMatch(/[$€]\s?\d|\d+\s?(USD|DOP|RD\$)|\d+(\.\d+)?\s?%|\b\d+\s?(hours?|horas?|business days|días hábiles)\b/i);
  });
});
