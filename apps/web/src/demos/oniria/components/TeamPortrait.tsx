'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import type { ImageRef } from '@anank/contracts';
import { useFinePointer } from '../lib/useReducedMotion';
import { BLUR } from '@/shared/lib/blur';

const RADIUS = 110;

/**
 * Retrato B&W com máscara circular que revela a versão colorida seguindo o
 * cursor. Em touch, sem `hover`, mostra a cor direto (sem a camada B&W).
 */
export function TeamPortrait({ photo, alt }: { photo: ImageRef; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const finePointer = useFinePointer();

  function handleMove(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  if (!finePointer) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface">
        <Image
          src={photo.url}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR.oniria}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] w-full overflow-hidden bg-surface"
      onPointerMove={handleMove}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Image
        src={photo.url}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, 50vw"
        className="object-cover grayscale"
        placeholder="blur"
        blurDataURL={BLUR.oniria}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-[clip-path] duration-300 ease-out"
        style={{
          clipPath: `circle(${hover ? RADIUS : 0}px at ${pos.x}px ${pos.y}px)`,
        }}
      >
        <Image
          src={photo.url}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR.oniria}
        />
      </div>
    </div>
  );
}
