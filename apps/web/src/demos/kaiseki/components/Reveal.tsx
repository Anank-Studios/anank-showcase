'use client';

import { motion, useReducedMotion } from 'motion/react';
import { EASE, VIEWPORT_ONCE } from '@/shared/lib/motion';

/**
 * Entrada ao entrar em quadro.
 *
 * O ritmo da Kaiseki e LONGO e leve — sobe pouco e desacelera devagar, para
 * acompanhar a mincho. E o oposto do da Brasa, que para seco junto com a
 * Archivo Black. Marcas diferentes precisam se mover diferente, senao a
 * identidade fica so na paleta.
 *
 * `once: true`: reanimar a cada passagem transforma a rolagem de volta num
 * piscar de conteudo.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={reduced ? { duration: 0.2 } : { duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
