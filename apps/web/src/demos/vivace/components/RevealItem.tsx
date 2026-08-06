'use client';

import { motion, useReducedMotion } from 'motion/react';
import { EASE_VIVACE, VIEWPORT_ONCE } from '@/shared/lib/motion';

/**
 * Reveal em stagger — o ritmo de identidade da Vivace: 80ms por item,
 * 0.6s de duração, easing EASE_VIVACE. `index` decide o atraso do stagger.
 * Sob reduced-motion, aparece direto (sem transform, sem delay).
 */
export function RevealItem({
  children,
  index = 0,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  as?: 'div' | 'li';
}) {
  const reduced = useReducedMotion();
  const Comp = motion[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE_VIVACE }}
    >
      {children}
    </Comp>
  );
}
