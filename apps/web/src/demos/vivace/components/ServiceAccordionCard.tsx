'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import type { Service } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { EASE_VIVACE } from '@/shared/lib/motion';
import { formatPriceFrom } from '../lib/format';
import { PlusIcon } from './icons';

/**
 * `animated` controla o comportamento no GRID de /servicos (layout + entrada/
 * saída do filtro). É desligado pelo pai sob reduced-motion — a troca vira
 * instantânea. O acordeão interno (abrir/fechar detalhes) é sempre animado
 * com Motion, como pede a spec, mas usa `transition-duration: .01ms` global
 * do CSS de reduced-motion como rede de segurança.
 */
export function ServiceAccordionCard({
  service,
  animated = true,
}: {
  service: Service;
  animated?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const reduced = useReducedMotion();

  return (
    <motion.div
      layout={animated}
      initial={animated ? { opacity: 0, scale: 0.96 } : undefined}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      exit={animated ? { opacity: 0, scale: 0.96 } : undefined}
      transition={animated ? { type: 'spring', stiffness: 260, damping: 30 } : { duration: 0 }}
      id={service.slug}
      className="scroll-mt-24 overflow-hidden rounded-brand border border-line bg-surface"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={service.image.url}
          alt={service.image.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw"
          placeholder="blur"
          blurDataURL={BLUR.vivace}
          className="object-cover"
        />
      </div>

      <div className="p-6">
        <p className="label-caps text-accent">{service.category}</p>
        {/* h2, não h3: os cards são o conteúdo de primeiro nível sob o h1 da
            página, e pular de h1 para h3 reprova em `heading-order`. */}
        <h2 className="text-display mt-2 text-[22px]">{service.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#636e67]">{service.summary}</p>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <div>
            <p className="text-sm font-medium text-ink">{formatPriceFrom(service.priceFrom)}</p>
            <p className="text-xs text-[#636e67]">{service.durationMin} min</p>
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-brand border border-line px-3 py-2 text-xs font-medium text-ink transition-colors hover:border-accent"
          >
            <PlusIcon className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-45' : ''}`} />
            {open ? 'Fechar detalhes' : 'Ver detalhes'}
          </button>
        </div>

        {open ? (
          <motion.div
            id={panelId}
            initial={reduced ? undefined : { height: 0, opacity: 0 }}
            animate={reduced ? undefined : { height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_VIVACE }}
            style={{ overflow: 'hidden' }}
          >
            <div className="mt-4 flex flex-col gap-4 border-t border-line pt-4 text-sm">
              <p className="leading-relaxed text-[#636e67]">{service.description}</p>

              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {service.sessions ? (
                  <div>
                    <dt className="label-caps text-[#636e67]">Sessões</dt>
                    <dd className="mt-1">{service.sessions}</dd>
                  </div>
                ) : null}
                {service.interval ? (
                  <div>
                    <dt className="label-caps text-[#636e67]">Intervalo</dt>
                    <dd className="mt-1">{service.interval}</dd>
                  </div>
                ) : null}
                {service.recovery ? (
                  <div>
                    <dt className="label-caps text-[#636e67]">Recuperação</dt>
                    <dd className="mt-1">{service.recovery}</dd>
                  </div>
                ) : null}
              </dl>

              {service.indications?.length ? (
                <div>
                  <p className="label-caps text-[#636e67]">Indicado para</p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {service.indications.map((item) => (
                      <li key={item} className="text-[#636e67]">
                        · {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {service.contraindications?.length ? (
                <div>
                  <p className="label-caps text-[#B3492F]">Contraindicações</p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {service.contraindications.map((item) => (
                      <li key={item} className="text-[#636e67]">
                        · {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}
