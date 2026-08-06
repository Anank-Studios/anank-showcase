'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { DemoSlug } from '@anank/contracts';
import { GridIcon } from './AnankMark';
import { useDemoChrome } from './DemoChromeProvider';
import { cn } from '@/shared/lib/cn';

const SEGMENTS: { slug: DemoSlug; index: string; label: string }[] = [
  { slug: 'aurea', index: '01', label: 'Aurea' },
  { slug: 'vivace', index: '02', label: 'Vivace' },
  { slug: 'oniria', index: '03', label: 'Oniria' },
];

const HINT_MS = 3500;

/**
 * Pílula flutuante presente em todas as rotas /demo/*.
 * Visual NEUTRO Anank — nunca herda a marca da demo em que está.
 * Ver specs/00-arquitetura.md e o item 5.2 do briefing.
 */
export function DemoToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const { hintSeen, markHintSeen } = useDemoChrome();

  const active = SEGMENTS.find((segment) => pathname.startsWith(`/demo/${segment.slug}`))?.slug;

  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showHint, setShowHint] = useState(!hintSeen);
  const lastScrollY = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  /* Rótulo de dica — uma vez por sessão, via Context (nunca sessionStorage). */
  useEffect(() => {
    if (hintSeen) return;
    const id = window.setTimeout(() => {
      setShowHint(false);
      markHintSeen();
    }, HINT_MS);
    return () => window.clearTimeout(id);
  }, [hintSeen, markHintSeen]);

  /* Auto-hide: some ao rolar para baixo, volta ao rolar para cima. */
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;
      if (Math.abs(delta) > 6) {
        setVisible(delta < 0 || current < 80);
        lastScrollY.current = current;
      }
    };

    /* ...e volta quando o mouse entra no terço inferior da tela. */
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      if (event.clientY > window.innerHeight * (2 / 3)) setVisible(true);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  /* Navegação por setas dentro do tablist. */
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();

      const currentIndex = SEGMENTS.findIndex((segment) => segment.slug === active);
      const offset = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (currentIndex + offset + SEGMENTS.length) % SEGMENTS.length;
      const next = SEGMENTS[nextIndex];
      if (!next) return;

      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      buttons?.[nextIndex]?.focus();
      router.push(`/demo/${next.slug}`);
    },
    [active, router]
  );

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-6 z-90 flex flex-col items-center gap-2 px-4',
        'transition-[transform,opacity] duration-300 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0'
      )}
    >
      <AnimatePresence>
        {showHint && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: reduced ? 0.01 : 0.35 }}
            className="rounded-full bg-[rgb(6_11_8_/_0.82)] px-3 py-1 text-[11px] text-[#F7F7F7] backdrop-blur-[20px]"
          >
            Alterne entre as versões
          </motion.p>
        )}
      </AnimatePresence>

      <div
        ref={listRef}
        role="tablist"
        aria-label="Alternar entre as demonstrações"
        onKeyDown={onKeyDown}
        className={cn(
          'flex items-center gap-1 rounded-full border p-1',
          'border-[rgb(255_255_255_/_0.12)] bg-[rgb(6_11_8_/_0.82)] text-[#F7F7F7]',
          'shadow-[0_8px_32px_-8px_rgb(0_0_0_/_0.5)] backdrop-blur-[20px]',
          // Fontes da Anank, não da demo em que o toggle está flutuando.
          'font-[family-name:var(--font-poppins)]'
        )}
      >
        <Link
          href="/"
          aria-label="Voltar para o hub da Anank Studios"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#F7F7F7]/70 transition-colors hover:bg-white/10 hover:text-[#F7F7F7]"
        >
          <GridIcon />
        </Link>

        <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-white/12" />

        {SEGMENTS.map((segment) => {
          const isActive = segment.slug === active;
          /* Mobile: só os números, a menos que o usuário expanda. */
          const showLabel = expanded || isActive;

          return (
            <button
              key={segment.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={isActive ? 0 : -1}
              onClick={() => {
                if (!expanded) setExpanded(true);
                router.push(`/demo/${segment.slug}`);
              }}
              className="relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="demo-toggle-pill"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-[rgb(47_174_128_/_0.45)] bg-[rgb(47_174_128_/_0.20)]"
                  transition={
                    reduced
                      ? { duration: 0.01 }
                      : { type: 'spring', stiffness: 420, damping: 34 }
                  }
                />
              )}
              <span
                className={cn(
                  'relative font-[family-name:var(--font-jetbrains-mono)] font-bold',
                  isActive ? 'text-[#54C99A]' : 'opacity-55'
                )}
              >
                {segment.index}
              </span>
              <span
                className={cn(
                  'relative overflow-hidden transition-[max-width,opacity] duration-300',
                  showLabel ? 'max-w-24 opacity-100' : 'max-w-0 opacity-0 sm:max-w-24 sm:opacity-70'
                )}
              >
                {segment.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
