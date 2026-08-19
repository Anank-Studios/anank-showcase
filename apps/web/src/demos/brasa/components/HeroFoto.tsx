'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

/**
 * Herói com paralaxe curta.
 *
 * A foto sobe mais devagar que a página (12% da altura ao longo do trecho
 * inteiro). Vale a pena registrar por que é pouco: paralaxe forte em imagem de
 * comida denuncia o recorte — a borda do prato sai do enquadramento e o olho
 * lê "banner deslizando", não "profundidade".
 *
 * `scale` fixo em 1.12 para que o deslocamento nunca revele a borda de cima
 * nem a de baixo.
 */
export function HeroFoto({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y, scale: 1.12 }}>
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
