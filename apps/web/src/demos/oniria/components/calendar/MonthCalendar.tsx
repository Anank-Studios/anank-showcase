'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MonthDay } from '@anank/contracts';
import {
  REASON_LABEL,
  WEEKDAY_HEADERS,
  buildCalendarGrid,
  formatDayNumber,
  isBeforeCurrentMonth,
  monthLabel,
  shiftMonth,
} from '../../lib/dateHelpers';
import { cn } from '@/shared/lib/cn';

/**
 * Calendário mensal próprio. Nunca `<input type="date">` — o controle nativo
 * não permite esmaecer dias sem vaga nem explicar o motivo.
 *
 * Teclado: setas navegam entre os dias, `Enter`/`Espaço` seleciona.
 * `role="grid"` com `gridcell` em cada dia.
 */
export function MonthCalendar({
  month,
  days,
  loading,
  selected,
  onSelect,
  onMonthChange,
}: {
  month: string;
  days: MonthDay[];
  loading: boolean;
  selected: string | null;
  onSelect: (dateISO: string) => void;
  onMonthChange: (month: string) => void;
}) {
  const grid = buildCalendarGrid(month, days);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const canGoBack = !isBeforeCurrentMonth(shiftMonth(month, -1));

  useEffect(() => {
    if (focusedIndex === null) return;
    cellRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const deltas: Record<string, number> = {
        ArrowRight: 1,
        ArrowLeft: -1,
        ArrowDown: 7,
        ArrowUp: -7,
      };
      const delta = deltas[event.key];
      if (delta === undefined) return;
      event.preventDefault();

      const from = focusedIndex ?? grid.findIndex((day) => day?.date === selected) ?? 0;
      let next = from + delta;
      // pula as células vazias do início/fim do mês
      while (next >= 0 && next < grid.length && grid[next] === null) next += delta;
      if (next < 0 || next >= grid.length) return;

      setFocusedIndex(next);
    },
    [focusedIndex, grid, selected]
  );

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line pb-4">
        <button
          type="button"
          onClick={() => canGoBack && onMonthChange(shiftMonth(month, -1))}
          disabled={!canGoBack}
          aria-label="Mês anterior"
          className="px-3 py-1 text-lg text-accent transition-opacity disabled:cursor-not-allowed disabled:opacity-25"
        >
          ‹
        </button>
        <p aria-live="polite" className="font-display text-lg first-letter:uppercase md:text-xl">
          {monthLabel(month)}
        </p>
        <button
          type="button"
          onClick={() => onMonthChange(shiftMonth(month, 1))}
          aria-label="Próximo mês"
          className="px-3 py-1 text-lg text-accent"
        >
          ›
        </button>
      </div>

      <div role="grid" aria-label="Escolha uma data" onKeyDown={onKeyDown} className="mt-4">
        <div role="row" className="grid grid-cols-7">
          {WEEKDAY_HEADERS.map((day, i) => (
            <span
              key={`${day}-${i}`}
              role="columnheader"
              className="label-caps py-2 text-center text-muted"
            >
              {day}
            </span>
          ))}
        </div>

        <div className={cn('grid grid-cols-7 gap-y-1', loading && 'opacity-40')}>
          {grid.map((day, index) => {
            if (!day) return <span key={`vazio-${index}`} role="gridcell" aria-hidden="true" />;

            const isSelected = day.date === selected;
            const disabled = !day.hasAvailability;
            const reason = day.reason ? REASON_LABEL[day.reason] : undefined;

            return (
              <button
                key={day.date}
                ref={(el) => {
                  cellRefs.current[index] = el;
                }}
                role="gridcell"
                type="button"
                disabled={disabled}
                aria-disabled={disabled}
                aria-selected={isSelected}
                aria-label={
                  disabled ? `${formatDayNumber(day.date)} — ${reason ?? 'sem vaga'}` : undefined
                }
                title={disabled ? reason : undefined}
                tabIndex={isSelected || focusedIndex === index ? 0 : -1}
                onClick={() => !disabled && onSelect(day.date)}
                data-cursor={disabled ? undefined : 'AGENDAR'}
                className={cn(
                  'aspect-square w-full text-sm transition-colors',
                  disabled && 'cursor-not-allowed text-muted opacity-28',
                  !disabled && !isSelected && 'text-ink hover:bg-surface',
                  isSelected && 'bg-accent font-medium text-bg'
                )}
              >
                {formatDayNumber(day.date)}
              </button>
            );
          })}
        </div>
      </div>

      <p className="label-caps mt-5 text-muted">Horários em Brasília (America/Sao_Paulo)</p>
    </div>
  );
}
