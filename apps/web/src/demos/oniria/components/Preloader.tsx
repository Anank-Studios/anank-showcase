'use client';

import { useEffect, useRef } from 'react';
import { ensureGsap, gsap } from '../lib/gsapClient';
import { useReducedMotion } from '../lib/useReducedMotion';

/**
 * Só na primeira visita da sessão (controlado via Context no OniriaShell,
 * nunca sessionStorage). Contador 00→100, barra de 1px, saída em cortina.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (reduced) {
      const timer = window.setTimeout(() => {
        gsap.to(root, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => onDoneRef.current(),
        });
      }, 300);
      return () => window.clearTimeout(timer);
    }

    ensureGsap();
    const proxy = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(root, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => onDoneRef.current(),
        });
      },
    });

    tl.to(
      proxy,
      {
        value: 100,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = String(Math.round(proxy.value)).padStart(2, '0');
          }
        },
      },
      0
    );
    tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'power2.out' }, 0);

    return () => {
      tl.kill();
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Carregando ONIRIA Clinic"
      className="fixed inset-0 z-[200] flex flex-col justify-end bg-bg px-6 pb-6 sm:px-10 sm:pb-10"
    >
      <span
        ref={counterRef}
        className="font-display leading-none text-ink tabular-nums"
        style={{ fontSize: 'clamp(4rem, 22vw, 12rem)' }}
      >
        00
      </span>
      <div className="mt-4 h-px w-full bg-line">
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-accent"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </div>
  );
}
