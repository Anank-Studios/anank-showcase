'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, revealUp } from '@/shared/lib/motion';
import { cn } from '@/shared/lib/cn';

/**
 * Único mecanismo de animação decorativa da Aurea: fade + slide-up de 16px,
 * `once: true`, 0.5s, easing expo-out. Sob `prefers-reduced-motion`, o
 * conteúdo aparece direto no estado final — sem movimento.
 *
 * O `delay` (em segundos) é usado pelos componentes-pai para simular o
 * stagger de 60ms entre irmãos de uma mesma grade.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li';
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  /* `motion[as]` produziria um tipo de ref em união (div | li) que não aceita
     um único RefObject. Escolhemos o componente em runtime e mantemos a
     tipagem de div — o elemento renderizado continua correto. */
  const Component = (as === 'li' ? motion.li : motion.div) as typeof motion.div;

  const visible = reduced || inView;

  return (
    <Component
      ref={ref}
      className={cn(className)}
      initial={reduced ? 'visible' : 'hidden'}
      animate={visible ? 'visible' : 'hidden'}
      variants={revealUp}
      transition={{ duration: reduced ? 0 : 0.5, ease: EASE, delay: reduced ? 0 : delay }}
    >
      {children}
    </Component>
  );
}
