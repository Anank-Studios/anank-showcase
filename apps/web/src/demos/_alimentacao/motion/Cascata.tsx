'use client';

import { motion, useReducedMotion } from 'motion/react';
import { VIEWPORT_ONCE } from '@/shared/lib/motion';

/**
 * Entrada em CASCATA, com física de mola.
 *
 * Substitui o `Reveal` de cada marca nas listas: em vez de cada item animar por
 * conta própria com um `delay` calculado à mão, o pai orquestra e os filhos
 * herdam o tempo. É o que faz a lista parecer uma coisa só entrando, e não seis
 * coisas soltas.
 *
 * DUAS RESTRIÇÕES QUE NÃO SÃO NEGOCIÁVEIS:
 *
 * 1. Pai e filhos precisam estar na MESMA árvore de client component. Se o pai
 *    for server component, `staggerChildren` não propaga e todos os itens
 *    entram juntos — a falha é silenciosa, nada quebra, só fica feio.
 * 2. Mola, não `ease`. Curva linear ou cúbica lê como CSS de 2015; mola dá peso
 *    e um leve ultrapasso, que é o que separa "animado" de "premium".
 */

const MOLA = { type: 'spring' as const, stiffness: 110, damping: 20, mass: 0.9 };

export function Cascata({
  children,
  intervalo = 0.045,
  className,
}: {
  children: React.ReactNode;
  /** Segundos entre um item e o próximo. Acima de ~0.08 vira desfile. */
  intervalo?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="oculto"
      whileInView="visivel"
      viewport={VIEWPORT_ONCE}
      variants={{
        visivel: {
          transition: { staggerChildren: reduced ? 0 : intervalo, delayChildren: 0.06 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function CascataItem({
  children,
  className,
  /** Deslocamento inicial. Positivo sobe de baixo; use negativo para descer. */
  y = 26,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        oculto: reduced ? { opacity: 0 } : { opacity: 0, y },
        visivel: {
          opacity: 1,
          y: 0,
          transition: reduced ? { duration: 0.2 } : MOLA,
        },
      }}
    >
      {children}
    </motion.div>
  );
}
