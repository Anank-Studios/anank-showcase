'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Service } from '@anank/contracts';
import { cn } from '@/shared/lib/cn';
import { ServiceAccordionCard } from './ServiceAccordionCard';

const CATEGORIES = ['Todos', 'Facial', 'Corporal', 'Depilação'] as const;

const HASH_TO_CATEGORY: Record<string, (typeof CATEGORIES)[number]> = {
  facial: 'Facial',
  corporal: 'Corporal',
  depilacao: 'Depilação',
};

export function ServicesFilterGrid({ services }: { services: Service[] }) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Todos');
  const reduced = useReducedMotion();

  /* Âncoras do rodapé (#facial, #corporal, #depilacao) pré-selecionam a categoria. */
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const match = HASH_TO_CATEGORY[hash];
    if (match) setCategory(match);
  }, []);

  const filtered =
    category === 'Todos' ? services : services.filter((s) => s.category === category);

  const resultsMessage =
    category === 'Todos'
      ? `Mostrando todos os ${filtered.length} serviços.`
      : `${filtered.length} serviço${filtered.length === 1 ? '' : 's'} em ${category}.`;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={category === cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'rounded-brand px-4 py-2 text-sm font-medium transition-colors',
              category === cat
                ? 'bg-accent text-bg'
                : 'border border-line text-ink hover:border-accent'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="sr-only">
        {resultsMessage}
      </div>

      <motion.div
        layout={!reduced}
        className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((service) => (
            <ServiceAccordionCard key={service.id} service={service} animated={!reduced} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-[#636e67]">Nenhum serviço nessa categoria no momento.</p>
      ) : null}
    </div>
  );
}
