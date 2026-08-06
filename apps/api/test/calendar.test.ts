import { describe, expect, it } from 'vitest';
import {
  buildSlots,
  dayBlockReason,
  HOLIDAYS_2026,
  openingWindow,
  todayInSaoPaulo,
} from '../src/services/calendar.mock.js';

/** Data-base fixa para os testes não dependerem do relógio real. */
const NOW = new Date('2026-08-06T12:00:00-03:00');
/** 2026-08-20 é uma quinta-feira, bem além da antecedência mínima. */
const THURSDAY = '2026-08-20';

const base = {
  practitionerId: 'marina-aveline',
  protocolId: 'aurora',
  durationMin: 90,
  now: NOW,
};

describe('calendar.mock', () => {
  it('é determinístico: 20 chamadas iguais devolvem o mesmo resultado', () => {
    const first = JSON.stringify(buildSlots({ dateISO: THURSDAY, ...base }));
    for (let i = 0; i < 19; i++) {
      expect(JSON.stringify(buildSlots({ dateISO: THURSDAY, ...base }))).toBe(first);
    }
  });

  it('domingo é fechado', () => {
    expect(openingWindow(0)).toBeNull();
    // 2026-08-23 é um domingo.
    expect(dayBlockReason('2026-08-23', 'marina-aveline', NOW)).toBe('closed');
  });

  it('feriado nacional de 2026 é marcado como holiday', () => {
    expect(HOLIDAYS_2026['09-07']).toBe('Independência do Brasil');
    expect(dayBlockReason('2026-09-07', 'marina-aveline', NOW)).toBe('holiday');
  });

  it('hoje, D+1 e D+2 caem na antecedência mínima', () => {
    const today = todayInSaoPaulo(NOW);
    expect(today).toBe('2026-08-06');
    expect(dayBlockReason('2026-08-06', 'marina-aveline', NOW)).toBe('lead-time');
    expect(dayBlockReason('2026-08-07', 'marina-aveline', NOW)).toBe('lead-time');
    expect(dayBlockReason('2026-08-08', 'marina-aveline', NOW)).toBe('lead-time');
    // D+3 já é ofertável (sexta-feira 2026-08-09 é domingo? não: é domingo -> closed)
    expect(dayBlockReason('2026-08-10', 'marina-aveline', NOW)).toBeNull();
  });

  it('data passada é past', () => {
    expect(dayBlockReason('2026-08-01', 'marina-aveline', NOW)).toBe('past');
  });

  it('almoço 12:30 e 13:00 nunca ficam disponíveis', () => {
    const slots = buildSlots({ dateISO: THURSDAY, ...base, durationMin: 30 });
    for (const time of ['12:30', '13:00']) {
      const slot = slots.find((s) => s.time === time);
      expect(slot, `slot ${time} deveria existir`).toBeDefined();
      expect(slot?.available, `slot ${time} deveria estar bloqueado`).toBe(false);
    }
  });

  it('protocolo de 120min não oferta slot que ultrapasse o fechamento', () => {
    // Quinta fecha às 19:00 → o último início possível é 17:00.
    const slots = buildSlots({ dateISO: THURSDAY, ...base, durationMin: 120 });
    const last = slots.at(-1);
    expect(last?.time).toBe('17:00');
    expect(slots.some((s) => s.time > '17:00')).toBe(false);
  });

  it('sábado fecha às 14:00 e a Helena não atende', () => {
    // 2026-08-22 é um sábado.
    expect(dayBlockReason('2026-08-22', 'helena-kruger', NOW)).toBe('closed');
    const slots = buildSlots({ dateISO: '2026-08-22', ...base, durationMin: 60 });
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.at(-1)?.time).toBe('13:00');
  });

  it('remaining fica entre 1 e 3 nos slots livres, e 0 nos ocupados', () => {
    const slots = buildSlots({ dateISO: THURSDAY, ...base });
    expect(slots.length).toBeGreaterThan(0);
    for (const slot of slots) {
      if (slot.available) {
        expect(slot.remaining).toBeGreaterThanOrEqual(1);
        expect(slot.remaining).toBeLessThanOrEqual(3);
      } else {
        expect(slot.remaining).toBe(0);
      }
    }
  });

  it('a Helena tem a agenda mais cheia que a Marina', () => {
    const dates = ['2026-08-10', '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14'];
    const free = (practitionerId: string) =>
      dates
        .flatMap((dateISO) =>
          buildSlots({ dateISO, practitionerId, protocolId: 'aurora', durationMin: 60, now: NOW })
        )
        .filter((s) => s.available).length;

    expect(free('helena-kruger')).toBeLessThan(free('marina-aveline'));
  });
});
