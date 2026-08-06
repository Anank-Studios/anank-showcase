'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import type { ImageRef } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';

interface BeforeAfterProps {
  before: ImageRef;
  after: ImageRef;
  labelBefore?: string;
  labelAfter?: string;
}

/**
 * Máscara arrastável antes/depois — mesma mecânica do BeforeAfter da Aurea,
 * visual oposto: sem raio, divisor 1px bronze, alça retangular 2×48px.
 * `<input type="range">` invisível por baixo garante teclado e arrastar
 * de graça; a UI visível é só decoração por cima.
 */
export function BeforeAfterSlider({
  before,
  after,
  labelBefore = 'Antes',
  labelAfter = 'Depois',
}: BeforeAfterProps) {
  const [value, setValue] = useState(50);
  const id = useId();

  return (
    <div
      className="relative aspect-[4/5] w-full touch-none overflow-hidden select-none"
      data-cursor="ARRASTAR"
    >
      <Image
        src={after.url}
        alt={after.alt}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover"
        placeholder="blur"
        blurDataURL={BLUR.oniria}
      />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <Image
          src={before.url}
          alt={before.alt}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR.oniria}
        />
      </div>

      <span className="label-caps absolute top-3 left-3 bg-bg/70 px-2 py-1 text-ink">
        {labelBefore}
      </span>
      <span className="label-caps absolute top-3 right-3 bg-bg/70 px-2 py-1 text-ink">
        {labelAfter}
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-px bg-accent"
        style={{ left: `${value}%` }}
      >
        <span className="absolute top-1/2 left-1/2 h-12 w-2 -translate-x-1/2 -translate-y-1/2 bg-accent" />
      </div>

      <label htmlFor={id} className="sr-only">
        Arraste para comparar antes e depois
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
