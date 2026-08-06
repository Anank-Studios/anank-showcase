'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Monta o Lenis (scroll suave) enquanto o componente que chama este hook
 * estiver montado, e o destrói no unmount. Desativado inteiramente sob
 * `prefers-reduced-motion: reduce` — inclusive reagindo a mudanças ao vivo.
 *
 * Ver specs/11-demo-vivace.md: `new Lenis({ lerp: 0.1 })`.
 */
export function useLenis(): void {
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;
    let frameId = 0;

    function start() {
      lenis = new Lenis({ lerp: 0.1 });
      const raf = (time: number) => {
        lenis?.raf(time);
        frameId = requestAnimationFrame(raf);
      };
      frameId = requestAnimationFrame(raf);
    }

    function stop() {
      if (frameId) cancelAnimationFrame(frameId);
      lenis?.destroy();
      lenis = null;
    }

    if (!mql.matches) start();

    const onChange = () => {
      stop();
      if (!mql.matches) start();
    };
    mql.addEventListener('change', onChange);

    return () => {
      mql.removeEventListener('change', onChange);
      stop();
    };
  }, []);
}
