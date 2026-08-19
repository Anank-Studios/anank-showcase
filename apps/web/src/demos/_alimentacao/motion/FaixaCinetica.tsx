'use client';

import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  useVelocity,
  wrap,
} from 'motion/react';

/**
 * Faixa de texto infinita cuja velocidade responde à rolagem.
 *
 * Anda sozinha devagar; quando a página rola, acelera na direção da rolagem —
 * e inverte se o visitante sobe. É o tipo de detalhe que faz a página parecer
 * viva sem pedir nada de quem lê.
 *
 * NADA DISSO PASSA POR `useState` NEM POR `addEventListener('scroll')`. A
 * posição vive num `MotionValue` atualizado dentro de `useAnimationFrame`, ou
 * seja: escreve direto no estilo, uma vez por quadro, fora do ciclo de render
 * do React. Com estado, seriam ~60 renders por segundo da árvore inteira.
 *
 * O texto é repetido quatro vezes de propósito. `wrap` devolve a posição ao
 * início quando ela passa de -25%, e só com quatro cópias a emenda cai fora da
 * área visível — com duas, o vão aparece em telas largas.
 *
 * Com `prefers-reduced-motion` a faixa fica PARADA, mas continua legível: o
 * conteúdo não depende do movimento para existir.
 */
export function FaixaCinetica({
  texto,
  /** Velocidade de base, em % da largura por segundo. */
  base = -1.6,
  className,
}: {
  texto: string;
  base?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const direcao = useRef(1);

  const { scrollY } = useScroll();
  const velocidade = useVelocity(scrollY);
  /* A rolagem só EMPURRA a faixa; sozinha ela nunca para. Sem o teto, um
     gesto brusco de trackpad manda o texto para o infinito. */
  const empurrao = useTransform(velocidade, [-2000, 0, 2000], [-4, 0, 4], { clamp: true });

  const xPct = useTransform(x, (v) => `${v}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;

    const v = velocidade.get();
    if (v < 0) direcao.current = -1;
    else if (v > 0) direcao.current = 1;

    /* `delta` em ms: o avanço fica igual em 60Hz e em 120Hz. Usar um passo
       fixo por quadro faria a faixa correr ao dobro em tela de 120Hz. */
    const avanco = direcao.current * base * (delta / 1000) + empurrao.get() * (delta / 1000);
    x.set(wrap(-25, 0, x.get() + avanco));
  });

  return (
    /*
      Sem `role="marquee"` e sem `aria-label` no contêiner: `marquee` é região
      viva (conteúdo que muda sozinho), e não é o caso — aqui o texto é fixo, só
      a POSIÇÃO se move. Pior, um `aria-label` no pai substituiria o conteúdo
      para o leitor de tela.

      A solução é mais simples: a primeira cópia é lida normalmente, as três
      restantes existem só para a emenda não aparecer e ficam `aria-hidden`.
    */
    <div className={className}>
      <div className="flex overflow-hidden select-none">
        <motion.div className="flex whitespace-nowrap" style={{ x: xPct }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} aria-hidden={i > 0} className="block shrink-0 pr-[0.35em]">
              {texto}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
