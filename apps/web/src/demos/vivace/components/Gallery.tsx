'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import type { ImageRef } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons';

const FOCUSABLE = 'a[href], button:not([disabled])';

export function Gallery({ images }: { images: ImageRef[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const open = (index: number) => {
    lastFocused.current = document.activeElement as HTMLElement;
    setOpenIndex(index);
  };

  const close = () => {
    const index = openIndex;
    setOpenIndex(null);
    if (index !== null) thumbRefs.current[index]?.focus();
    else lastFocused.current?.focus();
  };

  const next = () => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
  const prev = () => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));

  useEffect(() => {
    if (openIndex === null) return;

    const dialog = dialogRef.current;
    const focusables = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusables?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
      if (event.key === 'Tab' && focusables && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  const current = openIndex !== null ? images[openIndex] : null;

  return (
    <div>
      <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
        {images.map((image, i) => (
          <button
            key={image.url}
            type="button"
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            onClick={() => open(i)}
            className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-brand bg-line"
            aria-label={`Ampliar imagem: ${image.alt}`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              width={800}
              height={i % 3 === 0 ? 1000 : 600}
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw"
              placeholder="blur"
              blurDataURL={BLUR.vivace}
              className="h-auto w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {current ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Galeria ampliada"
          ref={dialogRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button
            type="button"
            aria-label="Fechar galeria"
            onClick={close}
            className="absolute right-6 top-6 rounded-full border border-white/30 p-2 text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Imagem anterior"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 p-2 text-white md:left-8"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <div className="relative h-[70vh] w-full max-w-4xl">
            <Image
              src={current.url}
              alt={current.alt}
              fill
              sizes="90vw"
              className="object-contain"
              placeholder="blur"
              blurDataURL={BLUR.vivace}
            />
          </div>

          <button
            type="button"
            aria-label="Próxima imagem"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 p-2 text-white md:right-8"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </motion.div>
      ) : null}
    </div>
  );
}
