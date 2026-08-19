'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';

/**
 * Botão magnético: o elemento é puxado na direção do cursor.
 *
 * O deslocamento vive em `useMotionValue`, NUNCA em `useState`. Com estado do
 * React, cada `pointermove` dispararia um render — dezenas por segundo, com a
 * árvore inteira reconciliando — e o efeito que deveria dar sensação de
 * qualidade viraria travamento no celular. `MotionValue` escreve direto no
 * estilo, fora do ciclo de render.
 *
 * A mola é o que separa isto de um `translate` seco: o elemento tem peso,
 * ultrapassa um pouco e volta, em vez de grudar no cursor.
 *
 * Sem ponteiro fino (celular) e com `prefers-reduced-motion`, o componente não
 * escuta nada — vira um wrapper inerte.
 */
export function Magnetico({
  children,
  forca = 0.35,
  className,
}: {
  children: React.ReactNode;
  /** Fração da distância até o cursor. Acima de ~0.5 o efeito vira brinquedo. */
  forca?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mola = { stiffness: 260, damping: 18, mass: 0.6 };
  const sx = useSpring(x, mola);
  const sy = useSpring(y, mola);

  /* Rotação derivada do MESMO valor, sem estado extra: o elemento inclina
     levemente para o lado que está sendo puxado. */
  const rotate = useTransform(sx, [-40, 40], [-2.5, 2.5]);

  function aoMover(evento: React.PointerEvent<HTMLDivElement>) {
    /* `pointerType` grosso é dedo: não existe "seguir o cursor" no toque, e
       tentar isso faz o botão fugir do dedo no momento do tap. */
    if (reduced || evento.pointerType !== 'mouse') return;
    const caixa = ref.current?.getBoundingClientRect();
    if (!caixa) return;
    x.set((evento.clientX - (caixa.left + caixa.width / 2)) * forca);
    y.set((evento.clientY - (caixa.top + caixa.height / 2)) * forca);
  }

  function aoSair() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={aoMover}
      onPointerLeave={aoSair}
      style={reduced ? undefined : { x: sx, y: sy, rotate }}
      /* `scale` no toque/clique: feedback tátil de 0.97, dentro da faixa que
         as diretrizes de plataforma pedem, e sem mexer no layout. */
      whileTap={reduced ? undefined : { scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
