'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import type { Testimonial } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';

const INTERVAL_MS = 6000;

/**
 * Carrossel 3 — Depoimentos. Terceiro comportamento distinto: crossfade puro
 * (opacity 0↔1, 500ms), SEM movimento lateral. Avança sozinho a cada 6s,
 * pausa em hover/focus. Navegação por traços, não por dots redondos.
 */
export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;
  const current = testimonials[index];

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  if (!current) return null;

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label="Depoimentos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="mx-auto max-w-2xl text-center"
    >
      <div aria-live="polite" className="sr-only">
        Slide {index + 1} de {count}
      </div>

      <div className="relative min-h-[220px] sm:min-h-[180px]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <blockquote
              className="text-display mx-auto max-w-[46ch]"
              style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)' }}
            >
              &ldquo;{current.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center justify-center gap-3">
              <span className="relative h-12 w-12 overflow-hidden rounded-full bg-line">
                <Image
                  src={current.avatar.url}
                  alt={current.avatar.alt}
                  fill
                  sizes="48px"
                  placeholder="blur"
                  blurDataURL={BLUR.vivace}
                  className="object-cover"
                />
              </span>
              <span className="text-left text-sm">
                <span className="block text-ink">{current.name}</span>
                <span className="block text-[#636e67]">
                  {current.city ? `${current.city} · ` : ''}
                  {current.service}
                </span>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((testimonial, i) => (
          <button
            key={testimonial.id}
            type="button"
            aria-label={`Ver depoimento de ${testimonial.name}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`h-0.5 w-6 rounded-full transition-colors ${
              i === index ? 'bg-accent' : 'bg-line'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
