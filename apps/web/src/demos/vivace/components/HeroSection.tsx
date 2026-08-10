'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { ImageRef } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { CredentialBadge } from './CredentialBadge';

/**
 * Hero da home. Parallax suave: a imagem translada no máximo 40px conforme
 * o scroll do próprio hero — nunca mais. Desligado sob reduced-motion.
 */
export function HeroSection({ image }: { image: ImageRef }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 40]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[88svh] items-center justify-center overflow-hidden md:min-h-[92vh]"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          priority
          quality={62}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR.vivace}
          className="object-cover"
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgb(31 42 36 / .30), rgb(31 42 36 / .68))',
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center text-white">
        <h1 className="text-display text-white">Doze anos cuidando de pele com método.</h1>
        <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-white/85 md:text-lg">
          Avaliação individual, protocolo escrito e acompanhamento. Em Curitiba, Joinville e
          Florianópolis.
        </p>
        <CredentialBadge className="mt-8 border-white/60 text-white">
          RT: Dra. Carolina Bettega · CRM-PR 28.114
        </CredentialBadge>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.span
          aria-hidden="true"
          className="block h-8 w-px bg-white/70"
          style={{ transformOrigin: 'top' }}
          animate={reduced ? undefined : { scaleY: [1, 0.15, 1] }}
          transition={reduced ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </section>
  );
}
