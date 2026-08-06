'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { ensureGsap, gsap } from './gsapClient';
import { useReducedMotion } from './useReducedMotion';

/**
 * Scroll suave da Oniria. `lerp: 0.075`, integrado ao ticker do GSAP —
 * ver specs/12-demo-oniria.md §3. Desligado sob reduced-motion.
 */
export function useOniriaLenis() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    ensureGsap();
    const lenis = new Lenis({ lerp: 0.075 });

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [reduced]);
}
