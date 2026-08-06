'use client';

import { useId, useState, type FormEvent } from 'react';
import { createLead, ApiError } from '@/shared/lib/api';
import { newsletterSchema, type NewsletterFieldErrors } from '../lib/newsletterSchema';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Newsletter do rodapé — POST /api/leads com source: 'newsletter'.
 * Os 3 estados reais: idle/loading, success (recibo), error (mensagem).
 */
export function NewsletterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<NewsletterFieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = newsletterSchema.safeParse({ name, email, phone });

    if (!parsed.success) {
      const nextErrors: NewsletterFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof NewsletterFieldErrors;
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      const firstField = parsed.error.issues[0]?.path[0];
      document.getElementById(`vivace-newsletter-${String(firstField)}`)?.focus();
      return;
    }

    setErrors({});
    setStatus('loading');

    try {
      await createLead({
        demo: 'vivace',
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        source: 'newsletter',
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof ApiError ? error.message : 'Não foi possível enviar. Tente novamente.'
      );
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-ink" role="status">
        Recebemos seu contato. Em breve você recebe novidades da Vivace por e-mail.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <div>
        <label htmlFor="vivace-newsletter-name" className="sr-only">
          Nome
        </label>
        <input
          id="vivace-newsletter-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nome"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${nameId}-error` : undefined}
          className="w-full rounded-brand border border-line bg-transparent px-3 py-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
        />
        {errors.name ? (
          <p id={`${nameId}-error`} className="mt-1 text-xs text-[#B3492F]">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="vivace-newsletter-email" className="sr-only">
          E-mail
        </label>
        <input
          id="vivace-newsletter-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="E-mail"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${emailId}-error` : undefined}
          className="w-full rounded-brand border border-line bg-transparent px-3 py-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
        />
        {errors.email ? (
          <p id={`${emailId}-error`} className="mt-1 text-xs text-[#B3492F]">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="vivace-newsletter-phone" className="sr-only">
          Telefone
        </label>
        <input
          id="vivace-newsletter-phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Telefone com DDD"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
          className="w-full rounded-brand border border-line bg-transparent px-3 py-2 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
        />
        {errors.phone ? (
          <p id={`${phoneId}-error`} className="mt-1 text-xs text-[#B3492F]">
            {errors.phone}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-brand bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === 'loading' ? 'Enviando…' : 'Quero receber novidades'}
      </button>

      {status === 'error' ? (
        <p role="alert" className="text-xs text-[#B3492F]">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
