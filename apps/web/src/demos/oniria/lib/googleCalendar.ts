/** Link real para a pré-criação de evento no Google Agenda. */
import type { CalendarEvent } from '@anank/contracts';

/** "2026-08-20T14:30:00-03:00" -> "20260820T143000" (local, o `ctz` já informa o fuso). */
function toGoogleDateTime(isoWithOffset: string): string {
  const [datePart = '', rest = ''] = isoWithOffset.split('T');
  const timePart = rest.replace(/[+-]\d{2}:\d{2}$/, '').replace(/Z$/, '');
  return `${datePart.replace(/-/g, '')}T${timePart.replace(/:/g, '')}`;
}

export function buildGoogleCalendarUrl(event: CalendarEvent): string {
  const dates = `${toGoogleDateTime(event.start.dateTime)}/${toGoogleDateTime(event.end.dateTime)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.summary,
    dates,
    ctz: 'America/Sao_Paulo',
    details: event.description,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
