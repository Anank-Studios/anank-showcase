'use client';

import { motion, useReducedMotion } from 'motion/react';
import { EASE, VIEWPORT_ONCE } from '@/shared/lib/motion';

/**
 * Entrada ao entrar em quadro.
 *
 * O ritmo do Forno fica entre os outros dois do nicho: sobe mais que a Kaiseki
 * e para menos seco que a Brasa, acompanhando a serifa de display. Marcas
 * diferentes precisam se MOVER diferente — senao a identidade fica so na
 * paleta, e duas demos do mesmo nicho voltam a parecer a mesma casa.
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
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={reduced ? { duration: 0.2 } : { duration: 0.78, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
