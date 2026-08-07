'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const AUTOPLAY_MS = 5000;

/**
 * Carrossel 1 — Tratamentos. O comportamento "principal": slide com
 * scroll-snap nativo, 3 visíveis no desktop / 1.2 no mobile, setas, dots,
 * arrasto por pointer, autoplay de 5s (pausa em hover/focus/aba oculta) e
 * loop (volta ao início ao passar do fim).
 */
export function TreatmentsCarousel({ services }: { services: Service[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragState = useRef<{ startX: number; startScroll: number; dragging: boolean } | null>(null);

  const count = services.length;

  const scrollToIndex = useCallback((next: number, behavior: ScrollBehavior = 'smooth') => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[next] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft, behavior });
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const wrapped = (next + count) % count;
      setIndex(wrapped);
      scrollToIndex(wrapped);
    },
    [count, scrollToIndex]
  );

  const goNext = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (atEnd) {
      setIndex(0);
      scrollToIndex(0);
    } else {
      goTo(index + 1);
    }
  }, [goTo, index, scrollToIndex]);

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  /* Autoplay — pausa no hover, no focus-within e com a aba oculta. */
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      goNext();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, goNext]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  /* Sincroniza o índice ativo com a posição real do scroll (arrasto manual). */
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;
    let closest = 0;
    let min = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const distance = Math.abs(el.offsetLeft - track.scrollLeft);
      if (distance < min) {
        min = distance;
        closest = i;
      }
    });
    setIndex(closest);
  }, []);

  function onPointerDown(event: React.PointerEvent) {
    const track = trackRef.current;
    if (!track) return;
    dragState.current = { startX: event.clientX, startScroll: track.scrollLeft, dragging: true };
    track.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent) {
    const track = trackRef.current;
    const state = dragState.current;
    if (!track || !state?.dragging) return;
    const delta = event.clientX - state.startX;
    track.scrollLeft = state.startScroll - delta;
  }

  function onPointerUp() {
    if (dragState.current) dragState.current.dragging = false;
  }

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label="Tratamentos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div aria-live="polite" className="sr-only">
        Slide {index + 1} de {count}
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
          style={{ cursor: 'grab' }}
        >
          {services.map((service) => (
            <article
              key={service.id}
              className="w-[83%] shrink-0 snap-start sm:w-[45%] lg:w-[calc((100%-2*1rem)/3)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-brand bg-line">
                <Image
                  src={service.image.url}
                  alt={service.image.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 83vw"
                  placeholder="blur"
                  blurDataURL={BLUR.vivace}
                  className="object-cover"
                  draggable={false}
                />
              </div>
              <h3 className="text-display mt-4 text-[22px]">{service.name}</h3>
              <p className="label-caps mt-1 text-[#636e67]">{service.durationMin} min</p>
              <p className="mt-2 text-sm leading-relaxed text-[#636e67]">{service.summary}</p>
              <Link
                href={`/demo/vivace/servicos#${service.slug}`}
                className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
              >
                Saiba mais →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-6 hidden items-center justify-between md:flex">
          {/*
            O ponto continua com 8px, mas o botão tem 24×24 de área clicável.
            Um alvo de toque de 8px reprova em `target-size` e é péssimo no
            dedo — o ponto é a decoração, não o alvo.
          */}
          <div className="flex">
            {services.map((service, i) => (
              <button
                key={service.id}
                type="button"
                aria-label={`Ir para o slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className="flex size-6 items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={`block size-2 rounded-full transition-colors ${
                    i === index ? 'bg-accent' : 'bg-line'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Tratamento anterior"
              onClick={goPrev}
              className="rounded-full border border-line p-2 text-ink transition-colors hover:border-accent"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Próximo tratamento"
              onClick={goNext}
              className="rounded-full border border-line p-2 text-ink transition-colors hover:border-accent"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
