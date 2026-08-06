'use client';

import { useEffect, useState } from 'react';
import type { CalendarEvent, Service } from '@anank/contracts';
import { buildGoogleCalendarUrl } from '../../lib/googleCalendar';
import { buildIcs, downloadIcs } from '../../lib/ics';
import { useReducedMotion } from '../../lib/useReducedMotion';
import { cn } from '@/shared/lib/cn';

function formatLongDate(dateTime: string): string {
  return new Date(dateTime).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  });
}

function formatTime(dateTime: string): string {
  return new Date(dateTime).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
}

export function BookingSuccess({ event, protocol }: { event: CalendarEvent; protocol: Service }) {
  const reduced = useReducedMotion();
  const [drawn, setDrawn] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setDrawn(true);
      return;
    }
    const id = window.requestAnimationFrame(() => setDrawn(true));
    return () => window.cancelAnimationFrame(id);
  }, [reduced]);

  const attendee = event.attendees[0];
  const googleUrl = buildGoogleCalendarUrl(event);

  function handleIcs() {
    downloadIcs(`oniria-${protocol.slug}.ics`, buildIcs(event));
  }

  return (
    <div className="mx-auto max-w-[720px]">
      {/* Check desenhado em SVG --------------------------------------- */}
      <svg viewBox="0 0 64 64" className="size-16" aria-hidden="true" fill="none">
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="var(--brand-accent)"
          strokeWidth="1.5"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: drawn ? 0 : 1,
            transition: reduced ? undefined : 'stroke-dashoffset 800ms ease-out',
          }}
        />
        <path
          d="M20 33.5 L28.5 42 L44 24"
          stroke="var(--brand-accent)"
          strokeWidth="1.5"
          strokeLinecap="square"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: drawn ? 0 : 1,
            transition: reduced ? undefined : 'stroke-dashoffset 700ms 400ms ease-out',
          }}
        />
      </svg>

      <h1 className="mt-8 font-display text-[clamp(2rem,7vw,3.75rem)] leading-[1.02]">
        Está marcado.
      </h1>
      <p className="mt-4 max-w-[48ch] text-muted">
        Enviamos os detalhes por e-mail. Se precisar remarcar, responda a mensagem — quem
        responde é a Olívia, não um robô.
      </p>

      {/* Card no estilo de evento do Google Calendar ------------------- */}
      <div className="mt-10 flex border border-line bg-surface">
        <div className="w-1 shrink-0 bg-accent" aria-hidden="true" />

        <div className="min-w-0 flex-1 p-6">
          <h2 className="font-display text-xl leading-tight md:text-2xl">{event.summary}</h2>

          {/* `capitalize` capitalizaria cada palavra ("10 De Agosto De 2026").
              Em pt-BR só a inicial da frase leva maiúscula. */}
          <p className="mt-4 text-sm first-letter:uppercase">
            {formatLongDate(event.start.dateTime)}
          </p>
          <p className="mt-1 text-sm text-muted">
            {formatTime(event.start.dateTime)} – {formatTime(event.end.dateTime)} · Horário de
            Brasília
          </p>

          <p className="mt-4 text-sm text-muted">{event.location}</p>

          <div className="mt-6 border-t border-line pt-5">
            <p className="label-caps text-muted">Participantes</p>
            <ul className="mt-3 space-y-2">
              {event.attendees.map((person) => (
                <li key={person.email} className="flex items-center gap-3 text-sm">
                  <span
                    aria-hidden="true"
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-medium text-bg"
                  >
                    {person.displayName.charAt(0)}
                  </span>
                  <span className="min-w-0 truncate">
                    {person.displayName}
                    <span className="text-muted"> · confirmado</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {attendee ? (
            <p className="mt-5 text-sm text-muted">Convite enviado para {attendee.email}</p>
          ) : null}

          {/* Aviso obrigatório. Nunca esconder, nunca abaixo de 12px. */}
          <p className="mt-6 border-t border-line pt-4 text-[12px] text-muted">
            {event.demoNotice}
          </p>
        </div>
      </div>

      {/* Ações — as únicas partes genuinamente funcionais -------------- */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="AGENDAR"
          className={cn(
            'border border-accent px-6 py-3 text-center text-sm tracking-[0.14em] text-accent-2 uppercase',
            'transition-colors hover:bg-accent hover:text-bg'
          )}
        >
          Adicionar ao Google Agenda
        </a>
        <button
          type="button"
          onClick={handleIcs}
          className="border border-line px-6 py-3 text-sm tracking-[0.14em] text-ink uppercase transition-colors hover:border-accent"
        >
          Baixar .ics
        </button>
        <button
          type="button"
          onClick={handleIcs}
          className="border border-line px-6 py-3 text-sm tracking-[0.14em] text-ink uppercase transition-colors hover:border-accent"
        >
          Adicionar ao Apple Calendar
        </button>
      </div>
    </div>
  );
}
