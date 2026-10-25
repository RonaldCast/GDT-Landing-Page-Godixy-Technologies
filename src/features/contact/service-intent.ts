import { serviceInterests, type ServiceInterest } from '@/shared/i18n/config';

const KEY = 'godixy:service-intent';
export const SERVICE_INTENT_EVENT = 'godixy:service-intent';

function isServiceInterest(value: unknown): value is ServiceInterest {
  return typeof value === 'string' && (serviceInterests as readonly string[]).includes(value);
}

/** Lets the services explorer preselect a service in the contact form, even before it hydrates. */
export function setServiceIntent(service: ServiceInterest): void {
  try {
    sessionStorage.setItem(KEY, service);
  } catch {
    /* storage unavailable (private mode): the event below still works once hydrated */
  }
  window.dispatchEvent(new CustomEvent<ServiceInterest>(SERVICE_INTENT_EVENT, { detail: service }));
}

export function consumeServiceIntent(): ServiceInterest | null {
  try {
    const value = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return isServiceInterest(value) ? value : null;
  } catch {
    return null;
  }
}

export function onServiceIntent(handler: (service: ServiceInterest) => void): () => void {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<unknown>).detail;
    if (isServiceInterest(detail)) handler(detail);
  };
  window.addEventListener(SERVICE_INTENT_EVENT, listener);
  return () => window.removeEventListener(SERVICE_INTENT_EVENT, listener);
}
