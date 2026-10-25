<script setup lang="ts">
import { actions, isInputError } from 'astro:actions';
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { companySizes, serviceInterests, type CompanySize, type Lang, type ServiceInterest } from '@/shared/i18n/config';
import type { Dictionary } from '@/shared/i18n/en';
import { buildMailto } from './mailto';
import { MESSAGE_MAX, contactFields, contactSchema, fieldErrors, type ContactData, type ContactField } from './schema';
import { consumeServiceIntent, onServiceIntent } from './service-intent';

const props = defineProps<{ t: Dictionary['contact']; lang: Lang }>();

type Status = 'idle' | 'submitting' | 'success' | 'failure';
type Failure = 'generic' | 'rate_limited' | 'unavailable';

const form = reactive({
  name: '',
  email: '',
  company: '',
  companySize: '' as CompanySize | '',
  service: '' as ServiceInterest | '',
  message: '',
  consent: false,
  website: '',
});

const errors = ref<Partial<Record<ContactField, string>>>({});
const touched = reactive(new Set<ContactField>());
const status = ref<Status>('idle');
const failure = ref<Failure>('generic');
const showSummary = ref(false);
const summaryRef = ref<HTMLElement | null>(null);
const successRef = ref<HTMLElement | null>(null);
const formRef = ref<HTMLFormElement | null>(null);

const f = computed(() => props.t.form);
const messageCount = computed(() => form.message.trim().length);

const payload = () => ({
  ...form,
  companySize: form.companySize || undefined,
  service: form.service || undefined,
  locale: props.lang,
});

function validate(): ContactData | null {
  const result = contactSchema.safeParse(payload());
  errors.value = result.success ? {} : fieldErrors(result.error);
  return result.success ? result.data : null;
}

function errorFor(field: ContactField): string | undefined {
  if (!touched.has(field) && !showSummary.value) return undefined;
  return errors.value[field] ? f.value.errors[field] : undefined;
}

function onBlur(field: ContactField) {
  touched.add(field);
  validate();
}

function onInput(field: ContactField) {
  if (touched.has(field) || showSummary.value) validate();
}

async function focusFirstInvalid() {
  await nextTick();
  const first = contactFields.find((field) => errors.value[field]);
  if (first) formRef.value?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
}

async function onSubmit() {
  if (status.value === 'submitting') return;
  const data = validate();
  if (!data) {
    showSummary.value = true;
    await focusFirstInvalid();
    return;
  }

  status.value = 'submitting';
  const { error } = await actions.contact.send(data);
  if (!error) {
    status.value = 'success';
    await nextTick();
    successRef.value?.focus();
    return;
  }

  if (isInputError(error)) {
    errors.value = Object.fromEntries(
      Object.keys(error.fields).filter((k): k is ContactField => (contactFields as readonly string[]).includes(k)).map((k) => [k, k]),
    );
    showSummary.value = true;
    status.value = 'idle';
    await focusFirstInvalid();
    return;
  }

  failure.value =
    error.code === 'TOO_MANY_REQUESTS' ? 'rate_limited' : error.code === 'SERVICE_UNAVAILABLE' ? 'unavailable' : 'generic';
  status.value = 'failure';
  await nextTick();
  summaryRef.value?.focus();
}

function reset() {
  Object.assign(form, { name: '', email: '', company: '', companySize: '', service: '', message: '', consent: false, website: '' });
  errors.value = {};
  touched.clear();
  showSummary.value = false;
  status.value = 'idle';
}

const failureText = computed(() =>
  failure.value === 'rate_limited'
    ? f.value.failureRateLimit
    : failure.value === 'unavailable'
      ? f.value.failureUnavailable
      : f.value.failureGeneric,
);

const mailtoHref = computed(() => buildMailto(props.t.email, f.value, payload()));

const describedBy = (field: ContactField, extra?: string) =>
  [errorFor(field) ? `${field}-error` : null, extra].filter(Boolean).join(' ') || undefined;

let stopIntent: (() => void) | null = null;
onMounted(() => {
  const intent = consumeServiceIntent();
  if (intent) form.service = intent;
  stopIntent = onServiceIntent((service) => {
    form.service = service;
    consumeServiceIntent();
  });
});
onBeforeUnmount(() => stopIntent?.());
</script>

<template>
  <div class="contact-form">
    <div v-if="status === 'success'" ref="successRef" class="result result--success" role="status" tabindex="-1">
      <p class="result__title">{{ f.successTitle }}</p>
      <p>{{ f.successText }}</p>
      <button type="button" class="link-btn" @click="reset">{{ f.sendAnother }}</button>
    </div>

    <form v-else ref="formRef" novalidate @submit.prevent="onSubmit">
      <div v-if="status === 'failure'" ref="summaryRef" class="result result--error" role="alert" tabindex="-1">
        <p class="result__title">{{ f.failureTitle }}</p>
        <p>{{ failureText }}</p>
        <a :href="mailtoHref" class="result__mailto">{{ f.mailtoFallback }}</a>
      </div>
      <p v-else-if="showSummary && Object.keys(errors).length > 0" class="result result--error" role="alert">
        {{ f.errorSummary }}
      </p>

      <div class="grid">
        <div class="field">
          <label for="name">{{ f.name }}</label>
          <input
            id="name"
            v-model="form.name"
            name="name"
            type="text"
            autocomplete="name"
            required
            maxlength="100"
            :aria-invalid="Boolean(errorFor('name'))"
            :aria-describedby="describedBy('name')"
            @blur="onBlur('name')"
            @input="onInput('name')"
          />
          <p v-if="errorFor('name')" id="name-error" class="error">{{ errorFor('name') }}</p>
        </div>

        <div class="field">
          <label for="email">{{ f.email }}</label>
          <input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            inputmode="email"
            required
            maxlength="254"
            :aria-invalid="Boolean(errorFor('email'))"
            :aria-describedby="describedBy('email')"
            @blur="onBlur('email')"
            @input="onInput('email')"
          />
          <p v-if="errorFor('email')" id="email-error" class="error">{{ errorFor('email') }}</p>
        </div>

        <div class="field">
          <label for="company">
            {{ f.company }} <span class="optional">({{ f.optional }})</span>
          </label>
          <input
            id="company"
            v-model="form.company"
            name="company"
            type="text"
            autocomplete="organization"
            maxlength="200"
            :aria-invalid="Boolean(errorFor('company'))"
            :aria-describedby="describedBy('company')"
            @blur="onBlur('company')"
            @input="onInput('company')"
          />
          <p v-if="errorFor('company')" id="company-error" class="error">{{ errorFor('company') }}</p>
        </div>

        <div class="field">
          <label for="companySize">{{ f.companySize }}</label>
          <select
            id="companySize"
            v-model="form.companySize"
            name="companySize"
            required
            :aria-invalid="Boolean(errorFor('companySize'))"
            :aria-describedby="describedBy('companySize')"
            @blur="onBlur('companySize')"
            @change="onInput('companySize')"
          >
            <option value="" disabled>{{ f.companySizePlaceholder }}</option>
            <option v-for="size in companySizes" :key="size" :value="size">{{ f.companySizes[size] }}</option>
          </select>
          <p v-if="errorFor('companySize')" id="companySize-error" class="error">{{ errorFor('companySize') }}</p>
        </div>

        <div class="field field--full">
          <label for="service">{{ f.service }}</label>
          <select
            id="service"
            v-model="form.service"
            name="service"
            required
            :aria-invalid="Boolean(errorFor('service'))"
            :aria-describedby="describedBy('service')"
            @blur="onBlur('service')"
            @change="onInput('service')"
          >
            <option value="" disabled>{{ f.servicePlaceholder }}</option>
            <option v-for="service in serviceInterests" :key="service" :value="service">{{ f.services[service] }}</option>
          </select>
          <p v-if="errorFor('service')" id="service-error" class="error">{{ errorFor('service') }}</p>
        </div>

        <div class="field field--full">
          <label for="message">{{ f.message }}</label>
          <textarea
            id="message"
            v-model="form.message"
            name="message"
            rows="5"
            required
            :maxlength="MESSAGE_MAX"
            :aria-invalid="Boolean(errorFor('message'))"
            :aria-describedby="describedBy('message', 'message-hint')"
            @blur="onBlur('message')"
            @input="onInput('message')"
          ></textarea>
          <div class="field__meta">
            <p id="message-hint" class="hint">{{ f.messageHint }}</p>
            <p class="hint" aria-hidden="true">{{ messageCount }} / {{ MESSAGE_MAX }}</p>
          </div>
          <p v-if="errorFor('message')" id="message-error" class="error">{{ errorFor('message') }}</p>
        </div>

        <div class="honeypot" aria-hidden="true">
          <label for="website">{{ f.honeypot }}</label>
          <input id="website" v-model="form.website" name="website" type="text" tabindex="-1" autocomplete="off" />
        </div>

        <div class="field field--full">
          <div class="consent">
            <input
              id="consent"
              v-model="form.consent"
              name="consent"
              type="checkbox"
              required
              :aria-invalid="Boolean(errorFor('consent'))"
              :aria-describedby="describedBy('consent')"
              @change="onBlur('consent')"
            />
            <label for="consent">
              {{ f.consent }}
              <a class="consent__privacy" :href="`/${lang}/privacy/`">{{ f.consentPrivacy }}</a>
            </label>
          </div>
          <p v-if="errorFor('consent')" id="consent-error" class="error">{{ errorFor('consent') }}</p>
        </div>
      </div>

      <button type="submit" class="submit" :disabled="status === 'submitting'" :aria-busy="status === 'submitting'">
        <span v-if="status === 'submitting'" class="spinner" aria-hidden="true"></span>
        {{ status === 'submitting' ? f.sending : f.submit }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.contact-form {
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  box-shadow: var(--shadow-lg);
  color: var(--color-navy);
}

form {
  display: grid;
  gap: var(--space-5);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.field {
  display: grid;
  gap: var(--space-2);
  align-content: start;
}

.field--full {
  grid-column: 1 / -1;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
}

.optional {
  font-weight: 400;
  color: var(--color-muted);
}

input[type='text'],
input[type='email'],
select,
textarea {
  width: 100%;
  min-height: 46px;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-card);
  background: var(--color-white);
  transition:
    border-color var(--duration-fast),
    box-shadow var(--duration-fast);
}

textarea {
  resize: vertical;
  min-height: 132px;
}

input:hover,
select:hover,
textarea:hover {
  border-color: var(--color-muted);
}

input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  border-color: var(--color-teal-text);
  box-shadow: 0 0 0 3px rgb(78 172 196 / 0.35);
  border-radius: var(--radius-card);
}

[aria-invalid='true'] {
  border-color: var(--color-error);
}

.field__meta {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
}

.hint {
  font-size: 0.8125rem;
  color: var(--color-muted);
}

.hint[aria-hidden='true'] {
  flex: none;
  white-space: nowrap;
}

.error {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-error);
}

.consent {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}

.consent input {
  flex: none;
  width: 20px;
  height: 20px;
  margin-top: 2px;
  accent-color: var(--color-navy);
}

.consent label {
  font-weight: 400;
  color: var(--color-muted);
}

.consent__privacy {
  display: inline;
  margin-left: 0.35em;
  font-weight: 600;
  color: var(--color-teal-text);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.honeypot {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 52px;
  padding: var(--space-4) var(--space-6);
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--color-navy);
  color: var(--color-white);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--duration-base);
}

.submit:hover:not(:disabled) {
  background: var(--color-navy-800);
}

.submit:disabled {
  opacity: 0.75;
  cursor: progress;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgb(255 255 255 / 0.35);
  border-top-color: var(--color-white);
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.result {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-panel);
}

.result--success {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.result--error {
  background: var(--color-error-bg);
  color: var(--color-error);
}

.result__title {
  font-weight: 700;
}

.result__mailto {
  font-weight: 600;
  color: var(--color-navy);
}

.link-btn {
  width: fit-content;
  padding: 0;
  border: 0;
  background: none;
  font-weight: 600;
  color: var(--color-navy);
  text-decoration: underline;
  cursor: pointer;
}

@media (max-width: 640px) {
  .contact-form {
    padding: var(--space-5);
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
