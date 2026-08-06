/**
 * Mock determinístico de agenda. Espelha specs/02-api-contract.md.
 *
 * A mesma combinação (data, profissional, protocolo) devolve SEMPRE os mesmos horários.
 * Nada é persistido: não existe estado global de eventos.
 */

import type { MonthDay, Slot, UnavailableReason } from '@anank/contracts';

/* ------------------------------------------------------------------ */
/* PRNG com seed (mulberry32 sobre FNV-1a)                             */
/* ------------------------------------------------------------------ */

export function seed(...parts: string[]): () => number {
  let h = 2166136261;
  for (const p of parts) {
    for (let i = 0; i < p.length; i++) {
      h ^= p.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* Calendário                                                          */
/* ------------------------------------------------------------------ */

/** Feriados nacionais de 2026 (MM-DD). */
export const HOLIDAYS_2026: Record<string, string> = {
  '01-01': 'Confraternização Universal',
  '02-16': 'Carnaval',
  '02-17': 'Carnaval',
  '04-03': 'Sexta-feira Santa',
  '04-21': 'Tiradentes',
  '05-01': 'Dia do Trabalho',
  '06-04': 'Corpus Christi',
  '09-07': 'Independência do Brasil',
  '10-12': 'Nossa Senhora Aparecida',
  '11-02': 'Finados',
  '11-15': 'Proclamação da República',
  '11-20': 'Consciência Negra',
  '12-25': 'Natal',
};

/** Antecedência mínima: hoje + os próximos 2 dias são indisponíveis. */
export const LEAD_TIME_DAYS = 3;

/** Almoço 12:30–13:30, sempre bloqueado. */
const LUNCH_START = 12 * 60 + 30;
const LUNCH_END_MIN = 13 * 60 + 30;

interface OpeningWindow {
  openMin: number;
  closeMin: number;
}

/** Domingo = 0. Retorna null quando fechado. */
export function openingWindow(weekday: number): OpeningWindow | null {
  if (weekday === 0) return null; // domingo
  if (weekday === 6) return { openMin: 9 * 60, closeMin: 14 * 60 }; // sábado
  return { openMin: 9 * 60, closeMin: 19 * 60 }; // seg–sex
}

/** Taxa de ocupação por profissional. */
export function occupancyRate(practitionerId: string): number {
  if (practitionerId === 'helena-kruger') return 0.55;
  if (practitionerId === 'marina-aveline') return 0.3;
  return 0.35;
}

/** Helena não atende aos sábados. */
export function worksOnWeekday(practitionerId: string, weekday: number): boolean {
  if (practitionerId === 'helena-kruger' && weekday === 6) return false;
  return true;
}

/* ------------------------------------------------------------------ */
/* Datas — tratadas como civis (sem fuso), o que é correto para grade   */
/* de agenda expressa em America/Sao_Paulo.                             */
/* ------------------------------------------------------------------ */

export function parseISODate(iso: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (probe.getUTCMonth() !== m - 1 || probe.getUTCDate() !== d) return null;
  return { y, m, d };
}

function toUTCDate(iso: string): Date | null {
  const parts = parseISODate(iso);
  if (!parts) return null;
  return new Date(Date.UTC(parts.y, parts.m - 1, parts.d));
}

/** "Hoje" no fuso de São Paulo, como YYYY-MM-DD. */
export function todayInSaoPaulo(now: Date = new Date()): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(now);
}

function daysBetween(fromISO: string, toISO: string): number {
  const a = toUTCDate(fromISO);
  const b = toUTCDate(toISO);
  if (!a || !b) return Number.NaN;
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function weekdayOf(iso: string): number {
  const d = toUTCDate(iso);
  return d ? d.getUTCDay() : -1;
}

function minutesToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/* Motivo de indisponibilidade de um dia                               */
/* ------------------------------------------------------------------ */

export function dayBlockReason(
  dateISO: string,
  practitionerId: string,
  now: Date = new Date()
): UnavailableReason | null {
  const today = todayInSaoPaulo(now);
  const delta = daysBetween(today, dateISO);

  if (Number.isNaN(delta)) return 'closed';
  if (delta < 0) return 'past';
  if (delta < LEAD_TIME_DAYS) return 'lead-time';

  const mmdd = dateISO.slice(5);
  if (dateISO.startsWith('2026-') && HOLIDAYS_2026[mmdd]) return 'holiday';

  const weekday = weekdayOf(dateISO);
  if (openingWindow(weekday) === null) return 'closed';
  if (!worksOnWeekday(practitionerId, weekday)) return 'closed';

  return null;
}

/* ------------------------------------------------------------------ */
/* Slots de um dia                                                     */
/* ------------------------------------------------------------------ */

export interface SlotOptions {
  dateISO: string;
  practitionerId: string;
  protocolId: string;
  /** Duração do protocolo em minutos — bloqueia os slots seguintes. */
  durationMin: number;
  now?: Date;
}

/**
 * Gera a grade de 30 em 30 minutos.
 * Um slot só é ofertado se o atendimento inteiro couber antes do fechamento
 * e não atravessar o almoço.
 */
export function buildSlots(opts: SlotOptions): Slot[] {
  const { dateISO, practitionerId, protocolId, durationMin } = opts;
  const now = opts.now ?? new Date();

  if (dayBlockReason(dateISO, practitionerId, now) !== null) return [];

  const weekday = weekdayOf(dateISO);
  const window = openingWindow(weekday);
  if (!window) return [];

  const rand = seed(dateISO, practitionerId, protocolId);
  const rate = occupancyRate(practitionerId);
  const slots: Slot[] = [];

  for (let start = window.openMin; start + durationMin <= window.closeMin; start += 30) {
    const end = start + durationMin;

    // Atravessa o almoço 12:30–13:30?
    const overlapsLunch = start < LUNCH_END_MIN && end > LUNCH_START;

    // Consome os mesmos números do PRNG independentemente do resultado,
    // para que a sequência não dependa dos desvios acima.
    const occupiedRoll = rand();
    const remainingRoll = rand();

    if (overlapsLunch) {
      slots.push({ time: minutesToTime(start), available: false, remaining: 0 });
      continue;
    }

    const occupied = occupiedRoll < rate;
    const remaining = occupied ? 0 : 1 + Math.floor(remainingRoll * 3);

    slots.push({
      time: minutesToTime(start),
      available: !occupied,
      remaining,
    });
  }

  return slots;
}

/** União de duas agendas: livre se qualquer profissional tiver o horário. */
export function mergeSlots(a: Slot[], b: Slot[]): Slot[] {
  const byTime = new Map<string, Slot>();
  for (const slot of [...a, ...b]) {
    const existing = byTime.get(slot.time);
    if (!existing) {
      byTime.set(slot.time, { ...slot });
      continue;
    }
    byTime.set(slot.time, {
      time: slot.time,
      available: existing.available || slot.available,
      remaining: Math.max(existing.remaining, slot.remaining),
    });
  }
  return [...byTime.values()].sort((x, y) => x.time.localeCompare(y.time));
}

/* ------------------------------------------------------------------ */
/* Mês                                                                 */
/* ------------------------------------------------------------------ */

export function buildMonth(
  month: string,
  practitionerId: string,
  protocolId: string,
  durationMin: number,
  now: Date = new Date()
): MonthDay[] {
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) return [];
  const year = Number(match[1]);
  const mon = Number(match[2]);
  const daysInMonth = new Date(Date.UTC(year, mon, 0)).getUTCDate();

  const days: MonthDay[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateISO = `${year}-${String(mon).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const reason = dayBlockReason(dateISO, practitionerId, now);

    if (reason) {
      days.push({ date: dateISO, hasAvailability: false, reason });
      continue;
    }

    const slots =
      practitionerId === 'any'
        ? mergeSlots(
            buildSlots({ dateISO, practitionerId: 'helena-kruger', protocolId, durationMin, now }),
            buildSlots({ dateISO, practitionerId: 'marina-aveline', protocolId, durationMin, now })
          )
        : buildSlots({ dateISO, practitionerId, protocolId, durationMin, now });

    const hasAvailability = slots.some((s) => s.available);
    days.push(
      hasAvailability
        ? { date: dateISO, hasAvailability: true }
        : { date: dateISO, hasAvailability: false, reason: 'full' }
    );
  }

  return days;
}

/* ------------------------------------------------------------------ */
/* Latência artificial — dá função ao skeleton shimmer do front         */
/* ------------------------------------------------------------------ */

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 400–700ms, determinístico pela data. */
export function availabilityLatency(dateISO: string): number {
  return 400 + Math.floor(seed('latency', dateISO)() * 300);
}
