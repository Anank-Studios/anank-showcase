'use client';

import { useId, useState } from 'react';
import type { Service } from '@anank/contracts';
import { ApiError, createLead } from '@/shared/lib/api';
import { formatPhoneBR } from '../lib/format';
import { CheckIcon, SpinnerIcon } from './icons';

type Status = 'idle' | 'loading' | 'success' | 'error';

const NO_PREFERENCE = 'Ainda não sei';

/**
 * Único formulário da demo. `POST /api/leads` com `source: 'contato'`.
 * Três estados reais + erros de campo mapeados a partir do 422 do servidor.
 */
export function ContactForm({ services }: { services: Service[] }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState(NO_PREFERENCE);
  const [status, setStatus] = useState<Status>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const nameId = useId();
  const phoneId = useId();
  const interestId = useId();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setFieldErrors({});

    try {
      await createLead({
        demo: 'aurea',
        name,
        phone,
        interest,
        source: 'contato',
      });
      setStatus('success');
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) {
        setFieldErrors(error.fieldErrors);
        setStatus('idle');
        return;
      }
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-brand bg-[color:var(--brand-accent-2)] p-7">
        <CheckIcon className="size-7 text-ink" />
        <p className="mt-3 text-base leading-relaxed text-ink">
          Recebemos seu contato. A Bruna responde em até 1 dia útil.
        </p>
      </div>
    );
  }

  const disabled = status === 'loading';

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor={nameId} className="text-sm font-medium text-ink">
          Nome
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          disabled={disabled}
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? `${nameId}-error` : undefined}
          className="mt-1.5 w-full rounded-brand border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors duration-250 focus:border-accent disabled:opacity-60"
        />
        {fieldErrors.name && (
          <p id={`${nameId}-error`} className="mt-1.5 text-[13px] text-[#A6402B]">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={phoneId} className="text-sm font-medium text-ink">
          Telefone
        </label>
        <input
          id={phoneId}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(00) 00000-0000"
          disabled={disabled}
          value={phone}
          onChange={(event) => setPhone(formatPhoneBR(event.target.value))}
          aria-invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? `${phoneId}-error` : undefined}
          className="mt-1.5 w-full rounded-brand border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors duration-250 focus:border-accent disabled:opacity-60"
        />
        {fieldErrors.phone && (
          <p id={`${phoneId}-error`} className="mt-1.5 text-[13px] text-[#A6402B]">
            {fieldErrors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={interestId} className="text-sm font-medium text-ink">
          Serviço de interesse
        </label>
        <select
          id={interestId}
          name="interest"
          disabled={disabled}
          value={interest}
          onChange={(event) => setInterest(event.target.value)}
          className="mt-1.5 w-full rounded-brand border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors duration-250 focus:border-accent disabled:opacity-60"
        >
          <option value={NO_PREFERENCE}>{NO_PREFERENCE}</option>
          {services.map((service) => (
            <option key={service.id} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {status === 'error' && (
        <p role="alert" className="text-sm text-[#A6402B]">
          Não conseguimos enviar seu contato agora. Tente de novo.
        </p>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex w-full items-center justify-center gap-2 rounded-brand bg-accent px-6 py-3.5 text-sm font-medium text-bg transition-[transform,box-shadow] duration-250 hover:-translate-y-0.5 hover:shadow-brand disabled:pointer-events-none disabled:opacity-70"
      >
        {status === 'loading' && <SpinnerIcon className="size-4 animate-spin" />}
        {status === 'loading' ? 'Enviando…' : status === 'error' ? 'Tentar de novo' : 'Enviar'}
      </button>
    </form>
  );
}
