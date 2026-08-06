/**
 * Camada acima do calendar.mock: resolve protocolo/profissional e monta
 * as respostas de disponibilidade e o "evento" no formato Google Calendar.
 */

import type {
  AvailabilityResponse,
  CalendarEvent,
  MonthResponse,
  Practitioner,
  Slot,
} from '@anank/contracts';
import { DEMO_NOTICE_BOOKING, SAO_PAULO_TZ } from '@anank/contracts';
import { oniria } from '../data/oniria.js';
import { buildMonth, buildSlots, mergeSlots, parseISODate } from './calendar.mock.js';

export const ONIRIA_LOCATION = 'Rua Bela Cintra, 1842 · Jardins · São Paulo · SP';
export const ONIRIA_ORGANIZER = {
  email: 'agenda@oniriaclinic.com.br',
  displayName: 'ONIRIA Clinic',
  self: true as const,
};

export function getPractitioners(): Practitioner[] {
  return oniria.practitioners ?? [];
}

export function findPractitioner(id: string): Practitioner | undefined {
  return getPractitioners().find((p) => p.id === id);
}

/** Duração do protocolo. Cai em 60min quando o id é desconhecido. */
export function protocolDuration(protocolId: string): number {
  return (
    oniria.services.find((s) => s.id === protocolId || s.slug === protocolId)?.durationMin ?? 60
  );
}

export function protocolName(protocolId: string): string | undefined {
  return oniria.services.find((s) => s.id === protocolId || s.slug === protocolId)?.name;
}

function slotsFor(
  dateISO: string,
  practitionerId: string,
  protocolId: string,
  durationMin: number
): Slot[] {
  if (practitionerId === 'any') {
    return mergeSlots(
      buildSlots({ dateISO, practitionerId: 'helena-kruger', protocolId, durationMin }),
      buildSlots({ dateISO, practitionerId: 'marina-aveline', protocolId, durationMin })
    );
  }
  return buildSlots({ dateISO, practitionerId, protocolId, durationMin });
}

export function getAvailability(params: {
  date: string;
  practitionerId?: string;
  protocolId?: string;
}): AvailabilityResponse {
  const practitionerId = params.practitionerId || 'any';
  const protocolId = params.protocolId || 'aurora';
  const durationMin = protocolDuration(protocolId);

  return {
    date: params.date,
    timeZone: SAO_PAULO_TZ,
    slots: slotsFor(params.date, practitionerId, protocolId, durationMin),
  };
}

export function getMonth(params: {
  month: string;
  practitionerId?: string;
  protocolId?: string;
}): MonthResponse {
  const practitionerId = params.practitionerId || 'any';
  const protocolId = params.protocolId || 'aurora';

  return {
    month: params.month,
    timeZone: SAO_PAULO_TZ,
    days: buildMonth(params.month, practitionerId, protocolId, protocolDuration(protocolId)),
  };
}

/** O horário ainda está livre? Revalidação server-side do POST /booking. */
export function isSlotAvailable(
  dateISO: string,
  time: string,
  practitionerId: string,
  protocolId: string
): boolean {
  const slots = slotsFor(dateISO, practitionerId, protocolId, protocolDuration(protocolId));
  return slots.some((s) => s.time === time && s.available);
}

/* ------------------------------------------------------------------ */
/* Montagem do "evento"                                                */
/* ------------------------------------------------------------------ */

const BASE32 = 'abcdefghijklmnopqrstuvwxyz234567';

/** Id de 26 chars em base32 lowercase, no estilo dos ids do Google. */
function eventId(...parts: string[]): string {
  const source = parts.join('|');
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < source.length; i++) {
    h1 = Math.imul(h1 ^ source.charCodeAt(i), 16777619) >>> 0;
    h2 = Math.imul(h2 + source.charCodeAt(i) * (i + 7), 2246822519) >>> 0;
  }
  let out = '';
  let a = h1;
  let b = h2;
  for (let i = 0; i < 26; i++) {
    const bits = (a ^ (b >>> 3)) & 31;
    out += BASE32[bits];
    a = (Math.imul(a, 1664525) + 1013904223) >>> 0;
    b = (Math.imul(b, 22695477) + 1) >>> 0;
  }
  return out;
}

function base64Url(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function addMinutes(time: string, minutes: number): string {
  const [h = '0', m = '0'] = time.split(':');
  const total = Number(h) * 60 + Number(m) + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/**
 * Monta o evento em memória. NUNCA persiste — não existe store.
 * O offset -03:00 é o de São Paulo (o Brasil não usa horário de verão desde 2019).
 */
export function buildCalendarEvent(input: {
  protocolId: string;
  practitionerId: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  firstVisit: boolean;
  notes?: string;
}): CalendarEvent {
  const duration = protocolDuration(input.protocolId);
  const endTime = addMinutes(input.time, duration);
  const protocol = protocolName(input.protocolId) ?? 'Protocolo';
  const practitioner = findPractitioner(input.practitionerId);
  const practitionerName = practitioner?.name ?? 'Equipe ONIRIA';

  const id = eventId(input.date, input.time, input.protocolId, input.practitionerId, input.email);

  const descriptionLines = [
    `${protocol} — duração de ${duration} minutos.`,
    `Profissional: ${practitionerName}.`,
    `Primeira visita: ${input.firstVisit ? 'sim' : 'não'}.`,
    `Contato: ${input.phone}.`,
  ];
  if (input.notes?.trim()) descriptionLines.push(`Observações: ${input.notes.trim()}`);
  descriptionLines.push('', DEMO_NOTICE_BOOKING);

  return {
    kind: 'calendar#event',
    id,
    status: 'confirmed',
    htmlLink: `https://calendar.google.com/calendar/event?eid=${base64Url(id)}`,
    created: new Date().toISOString(),
    summary: `${protocol} · ONIRIA Clinic`,
    description: descriptionLines.join('\n'),
    location: ONIRIA_LOCATION,
    colorId: '6',
    start: { dateTime: `${input.date}T${input.time}:00-03:00`, timeZone: SAO_PAULO_TZ },
    end: { dateTime: `${input.date}T${endTime}:00-03:00`, timeZone: SAO_PAULO_TZ },
    attendees: [
      { email: input.email, displayName: input.name, responseStatus: 'accepted' },
      {
        email: `${input.practitionerId}@oniriaclinic.com.br`,
        displayName: practitionerName,
        responseStatus: 'accepted',
        organizer: false,
      },
    ],
    organizer: ONIRIA_ORGANIZER,
    conferenceData: {
      conferenceId: id.slice(0, 10),
      conferenceSolution: { key: { type: 'addOn' }, name: 'ONIRIA Concierge' },
      entryPoints: [
        {
          entryPointType: 'phone',
          uri: 'tel:+551130629040',
          label: '(11) 3062-9040',
        },
      ],
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 1440 },
        { method: 'popup', minutes: 120 },
      ],
    },
    demoNotice: DEMO_NOTICE_BOOKING,
  };
}

export { parseISODate };
