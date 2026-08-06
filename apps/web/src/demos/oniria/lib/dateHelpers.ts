import { addMonths, format, getDay, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import type { MonthDay } from '@anank/contracts';

export const SAO_PAULO_TZ = 'America/Sao_Paulo';

export const WEEKDAY_HEADERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] as const;

/** "hoje" em Brasília, como Date à meia-noite local (só para comparação de mês/dia). */
export function todayInSaoPaulo(): Date {
  return toZonedTime(new Date(), SAO_PAULO_TZ);
}

export function monthKey(date: Date): string {
  return format(date, 'yyyy-MM');
}

export function monthLabel(monthISO: string): string {
  const date = new Date(`${monthISO}-01T12:00:00`);
  return format(date, 'MMMM \'de\' yyyy', { locale: ptBR });
}

export function shiftMonth(monthISO: string, delta: number): string {
  const date = new Date(`${monthISO}-01T12:00:00`);
  return monthKey(addMonths(date, delta));
}

/** Não permite voltar antes do mês atual (em Brasília). */
export function isBeforeCurrentMonth(monthISO: string): boolean {
  return monthISO < monthKey(todayInSaoPaulo());
}

/**
 * Monta a grade 7×N do calendário, com `null` de preenchimento antes do
 * dia 1 e depois do último dia, para o grid começar sempre no domingo.
 */
export function buildCalendarGrid(monthISO: string, days: MonthDay[]): (MonthDay | null)[] {
  const first = new Date(`${monthISO}-01T12:00:00`);
  const leading = getDay(startOfMonth(first));
  const byDate = new Map(days.map((d) => [d.date, d]));

  const cells: (MonthDay | null)[] = Array.from({ length: leading }, () => null);
  for (const day of days) cells.push(byDate.get(day.date) ?? day);

  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/** "quinta-feira, 20 de agosto de 2026" */
export function formatLongDate(dateISO: string): string {
  const date = new Date(`${dateISO}T12:00:00`);
  return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatDayNumber(dateISO: string): string {
  const date = new Date(`${dateISO}T12:00:00`);
  return format(date, 'd', { locale: ptBR });
}

export const REASON_LABEL: Record<string, string> = {
  past: 'Data passada',
  'lead-time': 'Fora da antecedência mínima',
  closed: 'Fechado aos domingos',
  holiday: 'Feriado',
  full: 'Sem vagas',
};
