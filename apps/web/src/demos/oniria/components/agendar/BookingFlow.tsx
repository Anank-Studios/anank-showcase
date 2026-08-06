'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import type {
  AvailabilityResponse,
  CalendarEvent,
  MonthDay,
  Practitioner,
  Service,
  Slot,
} from '@anank/contracts';
import { ApiError, createBooking, getAvailability, getMonth } from '@/shared/lib/api';
import { BLUR } from '@/shared/lib/blur';
import { cn } from '@/shared/lib/cn';
import { MonthCalendar } from '../calendar/MonthCalendar';
import { SlotPicker } from '../calendar/SlotPicker';
import { BookingSuccess } from './BookingSuccess';
import { bookingFormSchema, type BookingFormErrors } from '../../lib/bookingSchema';
import { monthKey, todayInSaoPaulo } from '../../lib/dateHelpers';
import { useReducedMotion } from '../../lib/useReducedMotion';

const STEPS = ['Protocolo', 'Profissional', 'Data e hora', 'Confirmação'] as const;

export function BookingFlow({
  services,
  practitioners,
}: {
  services: Service[];
  practitioners: Practitioner[];
}) {
  const reduced = useReducedMotion();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [protocolId, setProtocolId] = useState<string | null>(null);
  const [practitionerId, setPractitionerId] = useState<string | null>(null);
  const [month, setMonth] = useState(() => monthKey(todayInSaoPaulo()));
  const [days, setDays] = useState<MonthDay[]>([]);
  const [monthLoading, setMonthLoading] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [time, setTime] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    firstVisit: null as boolean | null,
    notes: '',
  });
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [event, setEvent] = useState<CalendarEvent | null>(null);

  const protocol = services.find((service) => service.id === protocolId) ?? null;

  /* Mês: recarrega quando muda o mês, o protocolo ou a profissional. */
  useEffect(() => {
    if (step !== 2 || !protocolId || !practitionerId) return;
    let cancelled = false;
    setMonthLoading(true);
    getMonth({ month, protocolId, practitionerId })
      .then((response) => {
        if (!cancelled) setDays(response.days);
      })
      .catch(() => {
        if (!cancelled) setDays([]);
      })
      .finally(() => {
        if (!cancelled) setMonthLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [step, month, protocolId, practitionerId]);

  /* Horários: recarrega ao escolher um dia. O skeleton aparece aqui. */
  useEffect(() => {
    if (!date || !protocolId || !practitionerId) return;
    let cancelled = false;
    setSlotsLoading(true);
    setTime(null);
    getAvailability({ date, protocolId, practitionerId })
      .then((response: AvailabilityResponse) => {
        if (!cancelled) setSlots(response.slots);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date, protocolId, practitionerId]);

  function go(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  async function submit() {
    if (!protocolId || !practitionerId || !date || !time) return;

    const parsed = bookingFormSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: BookingFormErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string' && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    try {
      const created = await createBooking({
        protocolId,
        practitionerId,
        date,
        time,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        firstVisit: parsed.data.firstVisit,
        notes: parsed.data.notes || undefined,
      });
      setEvent(created);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.fieldErrors);
        setSubmitError(error.message);
      } else {
        setSubmitError('Não foi possível concluir. Tente de novo em instantes.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (event && protocol) {
    return <BookingSuccess event={event} protocol={protocol} />;
  }

  const canAdvance =
    (step === 0 && protocolId) ||
    (step === 1 && practitionerId) ||
    (step === 2 && date && time) ||
    step === 3;

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Barra de progresso de 1px ------------------------------------- */}
      <div className="h-px w-full bg-line" aria-hidden="true">
        <div
          className="h-px bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <ol className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        {STEPS.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? 'step' : undefined}
            className={cn(
              'label-caps',
              index === step ? 'text-accent-2' : index < step ? 'text-muted' : 'text-muted opacity-45'
            )}
          >
            {String(index + 1).padStart(2, '0')} {label}
          </li>
        ))}
      </ol>

      <div className="relative mt-12 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: direction * -40 }}
            transition={{ duration: reduced ? 0.15 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 ? (
              <StepProtocol services={services} value={protocolId} onChange={setProtocolId} />
            ) : null}

            {step === 1 ? (
              <StepPractitioner
                practitioners={practitioners}
                value={practitionerId}
                onChange={setPractitionerId}
              />
            ) : null}

            {step === 2 ? (
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                <MonthCalendar
                  month={month}
                  days={days}
                  loading={monthLoading}
                  selected={date}
                  onSelect={setDate}
                  onMonthChange={(next) => {
                    setMonth(next);
                    setDate(null);
                    setSlots([]);
                  }}
                />
                <div>
                  <p className="label-caps text-accent">Horários</p>
                  <div className="mt-6">
                    {date ? (
                      <SlotPicker
                        slots={slots}
                        loading={slotsLoading}
                        selected={time}
                        onSelect={setTime}
                      />
                    ) : (
                      <p className="text-sm text-muted">Escolha uma data para ver os horários.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <StepConfirm
                form={form}
                setForm={setForm}
                errors={errors}
                protocol={protocol}
                practitioner={practitioners.find((p) => p.id === practitionerId) ?? null}
                date={date}
                time={time}
                submitting={submitting}
                submitError={submitError}
                onSubmit={submit}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-14 flex items-center justify-between border-t border-line pt-6">
        <button
          type="button"
          onClick={() => go(Math.max(0, step - 1))}
          disabled={step === 0}
          className="label-caps text-muted transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Voltar
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={() => canAdvance && go(step + 1)}
            disabled={!canAdvance}
            data-cursor="AGENDAR"
            className="border border-accent px-8 py-3 text-sm tracking-[0.18em] text-accent-2 uppercase transition-colors hover:bg-accent hover:text-bg disabled:cursor-not-allowed disabled:border-line disabled:text-muted disabled:hover:bg-transparent"
          >
            Continuar
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Etapa 1 — Protocolo                                                 */
/* ------------------------------------------------------------------ */

function StepProtocol({
  services,
  value,
  onChange,
}: {
  services: Service[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="label-caps text-accent">Escolha o protocolo</legend>
      <div className="mt-8 grid grid-cols-1 gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const selected = service.id === value;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onChange(service.id)}
              aria-pressed={selected}
              data-cursor="AGENDAR"
              className={cn(
                'group relative bg-bg p-6 text-left transition-colors',
                selected ? 'bg-surface' : 'hover:bg-surface'
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'absolute inset-y-0 left-0 w-px transition-colors',
                  selected ? 'bg-accent' : 'bg-transparent'
                )}
              />
              <h3 className="font-display text-xl leading-tight md:text-2xl">{service.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{service.summary}</p>
              <p className="label-caps mt-5 text-accent">
                {service.durationMin} min · R$ {service.priceFrom.toLocaleString('pt-BR')}
              </p>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* Etapa 2 — Profissional                                              */
/* ------------------------------------------------------------------ */

function StepPractitioner({
  practitioners,
  value,
  onChange,
}: {
  practitioners: Practitioner[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="label-caps text-accent">Com quem</legend>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {practitioners.map((practitioner) => {
          const selected = practitioner.id === value;
          return (
            <button
              key={practitioner.id}
              type="button"
              onClick={() => onChange(practitioner.id)}
              aria-pressed={selected}
              data-cursor="AGENDAR"
              className={cn(
                'border p-5 text-left transition-colors',
                selected ? 'border-accent bg-surface' : 'border-line hover:border-muted'
              )}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={practitioner.photo.url}
                  alt={practitioner.photo.alt}
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  placeholder="blur"
                  blurDataURL={BLUR.oniria}
                  className="object-cover"
                />
              </div>
              <h3 className="mt-5 font-display text-xl leading-tight">{practitioner.name}</h3>
              <p className="label-caps mt-2 text-accent">{practitioner.title}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">
                {practitioner.availabilityNote}
              </p>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* Etapa 4 — Confirmação                                               */
/* ------------------------------------------------------------------ */

function StepConfirm({
  form,
  setForm,
  errors,
  protocol,
  practitioner,
  date,
  time,
  submitting,
  submitError,
  onSubmit,
}: {
  form: { name: string; email: string; phone: string; firstVisit: boolean | null; notes: string };
  setForm: React.Dispatch<React.SetStateAction<typeof form>>;
  errors: BookingFormErrors;
  protocol: Service | null;
  practitioner: Practitioner | null;
  date: string | null;
  time: string | null;
  submitting: boolean;
  submitError: string | null;
  onSubmit: () => void;
}) {
  const field =
    'w-full border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent';

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
      {/* Resumo: acima no mobile, ao lado no desktop */}
      <aside className="border border-line p-6 lg:order-2 lg:col-span-4">
        <p className="label-caps text-accent">Resumo</p>
        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="label-caps text-muted">Protocolo</dt>
            <dd className="mt-1 font-display text-lg">{protocol?.name ?? '—'}</dd>
          </div>
          <div>
            <dt className="label-caps text-muted">Profissional</dt>
            <dd className="mt-1">{practitioner?.name ?? '—'}</dd>
          </div>
          <div>
            <dt className="label-caps text-muted">Quando</dt>
            <dd className="mt-1">
              {date
                ? new Date(`${date}T12:00:00-03:00`).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                  })
                : '—'}
              {time ? ` · ${time}` : ''}
            </dd>
          </div>
          <div>
            <dt className="label-caps text-muted">Investimento</dt>
            <dd className="mt-1">
              {protocol ? `a partir de R$ ${protocol.priceFrom.toLocaleString('pt-BR')}` : '—'}
            </dd>
          </div>
        </dl>
      </aside>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="space-y-6 lg:order-1 lg:col-span-8"
      >
        <Field label="Nome completo" name="name" error={errors.name}>
          <input
            id="name"
            className={field}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-erro' : undefined}
            autoComplete="name"
          />
        </Field>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="E-mail" name="email" error={errors.email}>
            <input
              id="email"
              type="email"
              className={field}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-erro' : undefined}
              autoComplete="email"
            />
          </Field>

          <Field label="Telefone" name="phone" error={errors.phone}>
            <input
              id="phone"
              type="tel"
              className={field}
              placeholder="(11) 90000-0000"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-erro' : undefined}
              autoComplete="tel"
            />
          </Field>
        </div>

        <fieldset>
          <legend className="label-caps text-muted">É a sua primeira vez na ONIRIA?</legend>
          <div className="mt-3 flex gap-3">
            {[
              { label: 'Sim', value: true },
              { label: 'Não', value: false },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                aria-pressed={form.firstVisit === option.value}
                onClick={() => setForm((f) => ({ ...f, firstVisit: option.value }))}
                className={cn(
                  'border px-6 py-2.5 text-sm transition-colors',
                  form.firstVisit === option.value
                    ? 'border-accent bg-accent text-bg'
                    : 'border-line text-ink hover:border-muted'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.firstVisit ? (
            <p className="mt-2 text-xs text-accent-2">{errors.firstVisit}</p>
          ) : null}
        </fieldset>

        <Field label="Observações (opcional)" name="notes" error={errors.notes}>
          <textarea
            id="notes"
            rows={4}
            className={field}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </Field>

        {submitError ? (
          <p role="alert" className="border-l border-accent pl-4 text-sm text-accent-2">
            {submitError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          data-cursor="AGENDAR"
          className="w-full border border-accent px-8 py-4 text-sm tracking-[0.18em] text-accent-2 uppercase transition-colors hover:bg-accent hover:text-bg disabled:opacity-50 md:w-auto"
        >
          {submitting ? 'Confirmando…' : 'Confirmar agendamento'}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="label-caps text-muted">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${name}-erro`} className="mt-2 text-xs text-accent-2">
          {error}
        </p>
      ) : null}
    </div>
  );
}
