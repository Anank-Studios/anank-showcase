'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

const nf = new Intl.NumberFormat('pt-BR');

/**
 * Contador animado — anima de 0 ao valor real uma única vez, ao entrar na
 * viewport. `value` é o texto cru vindo da API ("40.000"); extraímos os
 * dígitos para animar e reformatamos com Intl.NumberFormat('pt-BR').
 * Sob reduced-motion, mostra o valor final direto (sem RAF).
 */
export function Counter({ value, label }: { value: string; label: string }) {
  const target = Number(value.replace(/\D/g, '')) || 0;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(target);
      return;
    }
    let raf = 0;
    const duration = 1600;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, target]);

  return (
    <div ref={ref} className="px-4 py-8 text-center md:px-6 md:py-10">
      <p className="text-display" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)' }}>
        {nf.format(display)}
      </p>
      <p className="label-caps mt-2 text-[#636e67]">{label}</p>
    </div>
  );
}
