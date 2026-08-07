'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { ImageRef } from '@anank/contracts';
import { SplitText } from './SplitText';
import { useReducedMotion } from '../lib/useReducedMotion';
import { BLUR } from '@/shared/lib/blur';
import { cn } from '@/shared/lib/cn';

/**
 * Hero da home. A máscara `clip-path` abre ao carregar (0.9s) e a imagem faz
 * um Ken Burns lento. O scroll dos primeiros 60vh reduz a escala de 1.08 a 1.
 *
 * Sob `prefers-reduced-motion`: sem máscara, sem Ken Burns, sem scroll-driven.
 */
export function KenBurnsHero({ image }: { image: ImageRef }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1.08);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) {
      setOpen(true);
      setScale(1);
      return;
    }
    const id = window.requestAnimationFrame(() => setOpen(true));
    return () => window.cancelAnimationFrame(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const progress = Math.min(1, window.scrollY / (window.innerHeight * 0.6));
      setScale(1.08 - progress * 0.08);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced]);

  return (
    <section ref={sectionRef} className="relative h-[92svh] min-h-[520px] w-full overflow-hidden">
      <div
        className={cn(
          'absolute inset-0',
          !reduced && 'transition-[clip-path] duration-900 ease-out'
        )}
        style={{ clipPath: open ? 'inset(0%)' : 'inset(12%)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${scale})`,
            transition: reduced ? undefined : 'transform 200ms linear',
          }}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR.oniria}
            className={cn(
              'object-cover',
              !reduced && 'motion-safe:animate-[oniria-kenburns_18s_ease-in-out_infinite_alternate]'
            )}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(10_10_11_/_0.35)] via-transparent to-[rgb(10_10_11_/_0.85)]" />
      </div>

      <div className="absolute inset-x-0 bottom-0 px-5 pb-16 md:px-10 md:pb-20 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <SplitText
            text="A pele tem memória."
            as="h1"
            trigger="mount"
            active={open}
            delay={0.35}
            className="max-w-[12ch] font-display text-[clamp(2.75rem,15vw,11rem)] leading-[0.88] tracking-[-0.04em]"
          />
          <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-muted md:text-base">
            Instituto de estética avançada e longevidade. Jardins, São Paulo.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes oniria-kenburns {
          from { transform: scale(1); }
          to   { transform: scale(1.06); }
        }
      `}</style>
    </section>
  );
}
