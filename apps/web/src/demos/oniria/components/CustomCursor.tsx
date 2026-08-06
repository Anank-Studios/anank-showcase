'use client';

import { useEffect, useRef, useState } from 'react';
import { useFinePointer, useReducedMotion } from '../lib/useReducedMotion';
import { cn } from '@/shared/lib/cn';

/**
 * Cursor customizado — ponto de 8px sem lag + anel de 32px com lag (lerp .15),
 * que expande para 64px com rótulo sobre elementos `data-cursor="…"`.
 * Desativado em touch (`hover: hover` e `pointer: fine`).
 */
export function CustomCursor() {
  const finePointer = useFinePointer();
  const reduced = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!finePointer) return;

    document.body.style.cursor = 'none';

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: mouse.x, y: mouse.y };
    let raf = 0;

    function onMove(event: PointerEvent) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }
      const target = (event.target as HTMLElement | null)?.closest?.('[data-cursor]');
      setLabel((target as HTMLElement | null)?.dataset.cursor ?? null);
    }

    function tick() {
      const lerpAmount = reduced ? 1 : 0.15;
      ring.x += (mouse.x - ring.x) * lerpAmount;
      ring.y += (mouse.y - ring.y) * lerpAmount;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [finePointer, reduced]);

  if (!finePointer) return null;

  const expanded = Boolean(label);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[100] size-2 rounded-full bg-accent-2 will-change-transform"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed top-0 left-0 z-[100] flex items-center justify-center rounded-full border will-change-transform transition-[width,height,background-color,border-color] duration-300 ease-out',
          expanded
            ? 'size-16 border-accent/60 bg-accent/15'
            : 'size-8 border-ink/40 bg-transparent mix-blend-difference'
        )}
      >
        {label && (
          <span className="label-caps whitespace-nowrap text-[10px] text-ink">{label}</span>
        )}
      </div>
    </>
  );
}
