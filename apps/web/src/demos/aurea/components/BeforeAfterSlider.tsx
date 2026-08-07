'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import type { ImageRef } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';

const STEP = 2;

/**
 * Slider antes/depois próprio, sem biblioteca. Arraste por ponteiro
 * (mouse e toque, via Pointer Events) e opera por teclado — ver
 * specs/10-demo-aurea.md §5.
 */
export function BeforeAfterSlider({
  before,
  after,
  title,
}: {
  before: ImageRef;
  after: ImageRef;
  title: string;
}) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, ratio)));
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    containerRef.current?.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(event.clientX);
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (containerRef.current?.hasPointerCapture(event.pointerId)) {
      containerRef.current.releasePointerCapture(event.pointerId);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        setPos((current) => Math.max(0, current - STEP));
        break;
      case 'ArrowRight':
        event.preventDefault();
        setPos((current) => Math.min(100, current + STEP));
        break;
      case 'Home':
        event.preventDefault();
        setPos(0);
        break;
      case 'End':
        event.preventDefault();
        setPos(100);
        break;
      default:
        break;
    }
  };

  return (
    <figure>
      <div
        ref={containerRef}
        className="relative aspect-[4/5] w-full touch-none overflow-hidden rounded-brand shadow-brand select-none lg:aspect-[4/3]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        <Image
          src={after.url}
          alt={after.alt}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          placeholder="blur"
          blurDataURL={BLUR.aurea}
          className="pointer-events-none object-cover saturate-[1.05]"
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image
            src={before.url}
            alt={before.alt}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            placeholder="blur"
            blurDataURL={BLUR.aurea}
            className="pointer-events-none object-cover saturate-[1.05]"
          />
        </div>

        <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-[rgb(42_33_28_/_0.55)] px-3 py-1 text-[11px] font-medium text-white">
          antes
        </span>
        <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-[rgb(42_33_28_/_0.55)] px-3 py-1 text-[11px] font-medium text-white">
          depois
        </span>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white"
          style={{ left: `${pos}%` }}
        />

        <div
          role="slider"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-label="Comparar antes e depois"
          onKeyDown={onKeyDown}
          className="absolute top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-accent shadow-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          style={{ left: `${pos}%` }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M8 7 3 12l5 5M16 7l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-[#75685e]">{title}</figcaption>
    </figure>
  );
}
