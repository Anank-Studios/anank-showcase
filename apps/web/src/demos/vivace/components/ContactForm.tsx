'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import type { ImageRef, Service } from '@anank/contracts';
import { ApiError, createLead } from '@/shared/lib/api';
import { BLUR } from '@/shared/lib/blur';
import { contactSchema, type ContactFieldErrors } from '../lib/contactSchema';
import { VIVACE_UNITS } from '../lib/units';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormState {
  name: string;
  email: string;
  phone: string;
  unit: string;
  interest: string;
  message: string;
  consent: boolean;
}

const INITIAL: FormState = {
  name: '',
  email: '',
  phone: '',
  unit: VIVACE_UNITS[0]?.slug ?? '',
  interest: '',
  message: '',
  consent: false,
};

export function ContactForm({
  services,
  images,
}: {
  services: Service[];
  images: Record<string, ImageRef>;
}) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const ids = {
    name: useId(),
    email: useId(),
    phone: useId(),
    unit: useId(),
    interest: useId(),
    message: useId(),
    consent: useId(),
  };

  const selectedUnit = VIVACE_UNITS.find((u) => u.slug === form.unit) ?? VIVACE_UNITS[0];
  const mapImage = selectedUnit ? images[selectedUnit.imageKey] : undefined;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function focusField(field: string) {
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`);
    el?.focus();
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const parsed = contactSchema.safeParse({
      name: form.name,
      email: form.email,
      phone: form.phone,
      unit: form.unit,
      interest: form.interest,
      message: form.message,
      consent: form.consent,
    });

    if (!parsed.success) {
      const nextErrors: ContactFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ContactFieldErrors;
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      const firstField = String(parsed.error.issues[0]?.path[0] ?? '');
      focusField(firstField);
      return;
    }

    setErrors({});
    setStatus('loading');

    try {
      await createLead({
        demo: 'vivace',
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || undefined,
        interest: parsed.data.interest,
        message: `Unidade de interesse: ${selectedUnit?.city}.${
          parsed.data.message ? ` ${parsed.data.message}` : ''
        }`,
        source: 'contato',
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      if (error instanceof ApiError) {
        setServerMessage(error.message);
        const firstErrorField = Object.keys(error.fieldErrors)[0];
        if (firstErrorField) {
          setErrors(error.fieldErrors as ContactFieldErrors);
          focusField(firstErrorField);
        }
      } else {
        setServerMessage('Não foi possível enviar sua mensagem. Tente novamente.');
      }
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-brand border border-line bg-surface p-8">
        <p className="text-display text-[22px]">Recebemos sua mensagem.</p>
        <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-muted">
          Nossa equipe da unidade {selectedUnit?.city} entra em contato para confirmar sua
          avaliação. Demonstração — nenhum lead foi armazenado de fato.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <div>
          <label htmlFor={ids.name} className="label-caps text-muted">
            Nome
          </label>
          <input
            id={ids.name}
            name="name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${ids.name}-error` : undefined}
            className="mt-2 w-full rounded-brand border border-line bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
          />
          {errors.name ? (
            <p id={`${ids.name}-error`} className="mt-1 text-xs text-[#B3492F]">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.email} className="label-caps text-muted">
              E-mail
            </label>
            <input
              id={ids.email}
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${ids.email}-error` : undefined}
              className="mt-2 w-full rounded-brand border border-line bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
            {errors.email ? (
              <p id={`${ids.email}-error`} className="mt-1 text-xs text-[#B3492F]">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor={ids.phone} className="label-caps text-muted">
              Telefone
            </label>
            <input
              id={ids.phone}
              name="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="(41) 90000-0000"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `${ids.phone}-error` : undefined}
              className="mt-2 w-full rounded-brand border border-line bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
            {errors.phone ? (
              <p id={`${ids.phone}-error`} className="mt-1 text-xs text-[#B3492F]">
                {errors.phone}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.unit} className="label-caps text-muted">
              Unidade
            </label>
            <select
              id={ids.unit}
              name="unit"
              value={form.unit}
              onChange={(e) => update('unit', e.target.value)}
              aria-invalid={Boolean(errors.unit)}
              aria-describedby={errors.unit ? `${ids.unit}-error` : undefined}
              className="mt-2 w-full rounded-brand border border-line bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
            >
              {VIVACE_UNITS.map((unit) => (
                <option key={unit.slug} value={unit.slug}>
                  {unit.city}
                </option>
              ))}
            </select>
            {errors.unit ? (
              <p id={`${ids.unit}-error`} className="mt-1 text-xs text-[#B3492F]">
                {errors.unit}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor={ids.interest} className="label-caps text-muted">
              Serviço de interesse
            </label>
            <select
              id={ids.interest}
              name="interest"
              value={form.interest}
              onChange={(e) => update('interest', e.target.value)}
              aria-invalid={Boolean(errors.interest)}
              aria-describedby={errors.interest ? `${ids.interest}-error` : undefined}
              className="mt-2 w-full rounded-brand border border-line bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
            >
              <option value="">Selecione um serviço</option>
              {services.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
            {errors.interest ? (
              <p id={`${ids.interest}-error`} className="mt-1 text-xs text-[#B3492F]">
                {errors.interest}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor={ids.message} className="label-caps text-muted">
            Mensagem (opcional)
          </label>
          <textarea
            id={ids.message}
            name="message"
            rows={4}
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${ids.message}-error` : undefined}
            className="mt-2 w-full resize-none rounded-brand border border-line bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
          />
          {errors.message ? (
            <p id={`${ids.message}-error`} className="mt-1 text-xs text-[#B3492F]">
              {errors.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={ids.consent} className="flex items-start gap-3 text-sm text-muted">
            <input
              id={ids.consent}
              name="consent"
              type="checkbox"
              checked={form.consent}
              onChange={(e) => update('consent', e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? `${ids.consent}-error` : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--brand-accent)]"
            />
            <span>
              Concordo com o uso dos meus dados para contato sobre esta avaliação, conforme a
              LGPD.
            </span>
          </label>
          {errors.consent ? (
            <p id={`${ids.consent}-error`} className="mt-1 text-xs text-[#B3492F]">
              {errors.consent}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="mt-2 rounded-brand bg-accent px-6 py-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === 'loading' ? 'Enviando…' : 'Enviar e agendar avaliação'}
        </button>

        {status === 'error' ? (
          <p role="alert" className="text-sm text-[#B3492F]">
            {serverMessage}
          </p>
        ) : null}
      </form>

      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-brand bg-line">
          {mapImage ? (
            <Image
              src={mapImage.url}
              alt={mapImage.alt}
              fill
              sizes="(min-width: 1024px) 42vw, 92vw"
              placeholder="blur"
              blurDataURL={BLUR.vivace}
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-line pt-6 text-sm">
          <p className="text-display text-[20px]">
            {selectedUnit?.city}
            {selectedUnit?.matriz ? <span className="ml-2 text-sm text-muted">(matriz)</span> : null}
          </p>
          <p className="text-muted">{selectedUnit?.address}</p>
          <p className="text-muted">{selectedUnit?.phone}</p>
          <p className="text-muted">{selectedUnit?.hours}</p>
          {selectedUnit ? (
            <a
              href={`https://wa.me/${selectedUnit.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block w-fit text-accent hover:underline"
            >
              Falar no WhatsApp →
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
