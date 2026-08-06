/**
 * Constantes de movimento compartilhadas. Cada marca tem um ritmo próprio —
 * ver a matriz de diferenciação em specs/01-design-tokens.md.
 */

/** Easing padrão do projeto (expo-out suave). */
export const EASE = [0.16, 1, 0.3, 1] as const;
/** Easing da Vivace — um pouco mais curto. */
export const EASE_VIVACE = [0.22, 1, 0.36, 1] as const;

/** Reveal on-scroll padrão: fade + slide-up curto. */
export const revealUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
} as const;

export const VIEWPORT_ONCE = { once: true, margin: '-80px' } as const;

/**
 * Leitura síncrona de `prefers-reduced-motion`.
 * Em SSR devolve `false` — os componentes devem reavaliar no efeito.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
