'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import type { TeamMember } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

/**
 * Carrossel 2 — Corpo clínico. Deliberadamente diferente do carrossel 1:
 * cards retrato, 4 visíveis no desktop, SEM autoplay, SEM dots — só arraste
 * e setas. Foto em grayscale que vira colorida no hover/focus.
 */
export function TeamCarousel({ team }: { team: TeamMember[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const dragState = useRef<{ startX: number; startScroll: number; dragging: boolean } | null>(null);
  const count = team.length;

  const scrollByCards = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[0] as HTMLElement | undefined;
    const step = card ? card.offsetWidth + 16 : track.clientWidth * 0.3;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  }, []);

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
    <div role="region" aria-roledescription="carrossel" aria-label="Corpo clínico">
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
          {team.map((member) => (
            <article
              key={member.id}
              className="w-[70%] shrink-0 snap-start sm:w-[38%] lg:w-[calc((100%-3*1rem)/4)]"
            >
              <div className="group relative aspect-[3/4] overflow-hidden rounded-brand bg-line">
                <Image
                  src={member.photo.url}
                  alt={member.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 38vw, 70vw"
                  placeholder="blur"
                  blurDataURL={BLUR.vivace}
                  className="object-cover grayscale transition-[filter] duration-[400ms] ease-out group-hover:grayscale-0 group-focus-within:grayscale-0"
                  draggable={false}
                />
              </div>
              <h3 className="text-display mt-4 text-[19px]">{member.name}</h3>
              <p className="mt-1 text-sm text-[#636e67]">{member.role}</p>
              {member.registry ? (
                <p className="label-caps mt-1 text-[10px] text-[#636e67]">{member.registry}</p>
              ) : null}
            </article>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            aria-label="Ver profissional anterior"
            onClick={() => scrollByCards(-1)}
            className="rounded-full border border-line p-2 text-ink transition-colors hover:border-accent"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Ver próximo profissional"
            onClick={() => scrollByCards(1)}
            className="rounded-full border border-line p-2 text-ink transition-colors hover:border-accent"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
