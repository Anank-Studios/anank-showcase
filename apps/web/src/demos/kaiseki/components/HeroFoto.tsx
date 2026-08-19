'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

/**
 * Herói com entrada lenta e paralaxe curta.
 *
 * Duas coisas diferentes acontecem aqui, e vale distinguir: a ENTRADA é a foto
 * assentando de 1.16 para 1.08 em dois segundos — é o gesto de abertura. A
 * PARALAXE é o deslocamento de 10% preso à rolagem.
 *
 * A paralaxe é curta de propósito. Forte, ela denuncia o recorte: a borda do
 * prato sai do enquadramento e o olho lê "banner deslizando", não
 * profundidade. E o `scale` nunca desce de 1.08 para que o deslocamento não
 * revele a borda de cima nem a de baixo.
 *
 * Com `prefers-reduced-motion`, nem uma nem outra: a foto entra parada.
 */
export function HeroFoto({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y }}
        initial={reduced ? { scale: 1 } : { scale: 1.16 }}
        animate={reduced ? { scale: 1 } : { scale: 1.08 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          quality={62}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
