'use client';

import type { Slot } from '@anank/contracts';
import { cn } from '@/shared/lib/cn';

/**
 * Grade de horários. Enquanto carrega, mostra o skeleton shimmer — a API tem
 * latência artificial de 400–700ms de propósito, para o estado de carregamento
 * ser visível de verdade em vez de piscar.
 */
export function SlotPicker({
  slots,
  loading,
  selected,
  onSelect,
}: {
  slots: Slot[];
  loading: boolean;
  selected: string | null;
  onSelect: (time: string) => void;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4" aria-busy="true" aria-live="polite">
        <span className="sr-only">Carregando horários…</span>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="oniria-shimmer h-11 w-full" aria-hidden="true" />
        ))}
      </div>
    );
  }

  const available = slots.filter((slot) => slot.available);

  if (available.length === 0) {
    return (
      <p className="border border-line px-4 py-6 text-sm text-muted">
        Não há horário livre neste dia para o protocolo escolhido. Tente outra data.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
      {slots.map((slot) => {
        const isSelected = slot.time === selected;
        const scarce = slot.available && slot.remaining <= 2;

        return (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            aria-disabled={!slot.available}
            aria-pressed={isSelected}
            onClick={() => onSelect(slot.time)}
            data-cursor={slot.available ? 'AGENDAR' : undefined}
            className={cn(
              'relative border px-2 py-3 text-sm transition-colors',
              !slot.available && 'cursor-not-allowed border-line text-muted opacity-30',
              slot.available && !isSelected && 'border-line text-ink hover:border-accent',
              isSelected && 'border-accent bg-accent text-bg'
            )}
          >
            {slot.time}
            {scarce && !isSelected ? (
              <span className="mt-1 block text-[9px] tracking-[0.12em] text-accent uppercase">
                Últimas {slot.remaining} vagas
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
