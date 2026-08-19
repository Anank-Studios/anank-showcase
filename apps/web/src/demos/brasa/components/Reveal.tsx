'use client';

import { motion, useReducedMotion } from 'motion/react';
import { EASE, VIEWPORT_ONCE } from '@/shared/lib/motion';

/**
 * Entrada ao entrar em quadro. O movimento da Brasa é CURTO e pesado — sobe
 * pouco e para seco, para combinar com a Archivo Black. A Oniria, que usa
 * Didone, faz o contrário: sobe muito e desacelera longo.
 *
 * `once: true` no viewport: reanimar a cada passagem transforma a rolagem de
 * volta num piscar de conteúdo.
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
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={reduced ? { duration: 0.2 } : { duration: 0.62, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
