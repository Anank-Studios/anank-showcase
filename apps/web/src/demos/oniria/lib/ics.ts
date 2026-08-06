/**
 * Gerador de .ics no cliente — RFC 5545 mínimo, mas real: o arquivo
 * precisa abrir de fato num app de calendário. Linhas terminadas em \r\n.
 */
import type { CalendarEvent } from '@anank/contracts';

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** "2026-08-20T14:30:00-03:00" -> "20260820T143000" (hora local, sem offset — o TZID já diz o fuso). */
function toIcsLocalDateTime(isoWithOffset: string): string {
  const [datePart = '', rest = ''] = isoWithOffset.split('T');
  const timePart = rest.replace(/[+-]\d{2}:\d{2}$/, '').replace(/Z$/, '');
  return `${datePart.replace(/-/g, '')}T${timePart.replace(/:/g, '')}`;
}

/** DTSTAMP exige UTC com sufixo Z. */
function toIcsUtcStamp(isoDate: string): string {
  const stamp = new Date(isoDate).toISOString().replace(/[-:]/g, '');
  const [withoutMillis = stamp] = stamp.split('.');
  return `${withoutMillis}Z`;
}

export function buildIcs(event: CalendarEvent): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ONIRIA Clinic//Agendamento//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@oniriaclinic.com.br`,
    `DTSTAMP:${toIcsUtcStamp(event.created)}`,
    `DTSTART;TZID=America/Sao_Paulo:${toIcsLocalDateTime(event.start.dateTime)}`,
    `DTEND;TZID=America/Sao_Paulo:${toIcsLocalDateTime(event.end.dateTime)}`,
    `SUMMARY:${escapeIcsText(event.summary)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Lembrete — ONIRIA Clinic',
    'TRIGGER:-PT2H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}

/** Dispara o download via Blob + object URL, revogando a URL depois. */
export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
