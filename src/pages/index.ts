import type { APIRoute } from 'astro';
import { LANG_COOKIE } from '@/shared/i18n/config';
import { localizedPath, resolvePreferredLang } from '@/shared/i18n/utils';

export const prerender = false;

/** Sends visitors to /en/ or /es/: saved choice first, then browser language. */
export const GET: APIRoute = ({ cookies, request }) => {
  const lang = resolvePreferredLang(cookies.get(LANG_COOKIE)?.value, request.headers.get('accept-language'));
  return new Response(null, {
    status: 302,
    headers: {
      Location: localizedPath(lang),
      Vary: 'Accept-Language, Cookie',
      'Cache-Control': 'private, no-store',
    },
  });
};
