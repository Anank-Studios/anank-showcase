'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { IntentLink } from '@/shared/components/IntentLink';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { DemoSlug } from '@anank/contracts';
import { GridIcon } from './AnankMark';
import { useDemoChrome } from './DemoChromeProvider';
import { cn } from '@/shared/lib/cn';

/*
  Rótulos por NÍVEL, não por marca fictícia — o mesmo critério do hub. Quem
  está navegando quer saber em que degrau está, e "Aurea" não dizia isso.

  O numeral solto (01/02/03) saiu junto: com "Demo 1" escrito por extenso ele
  virava repetição. Os três rótulos novos somam 18 caracteres contra os 26 do
  arranjo anterior ("01 Aurea" + "02 Vivace" + "03 Oniria"), então cabem
  sempre — o colapso para só-números no mobile deixou de ser necessário.
*/
const SEGMENTS: { slug: DemoSlug; label: string }[] = [
  { slug: 'aurea', label: 'Demo 1' },
  { slug: 'vivace', label: 'Demo 2' },
  { slug: 'oniria', label: 'Demo 3' },
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
      {/*
        O rótulo anima só `y`, nunca `opacity`. Um fade deixa o texto em
        opacidade parcial por ~350ms, e nesse intervalo o contraste real fica
        abaixo do mínimo — a auditoria pegava isso de forma intermitente,
        dependendo de quando amostrava a página. Movimento sem fade resolve e
        continua discreto.
      */}
      <AnimatePresence>
        {showHint && (
          <motion.p
            initial={{ y: 8 }}
            animate={{ y: 0 }}
            exit={{ y: 8 }}
            transition={{ duration: reduced ? 0.01 : 0.35 }}
            /* Fundo totalmente opaco: é um rótulo pequeno e efêmero, e com
               qualquer translucidez o contraste passa a depender da página
               atrás — reprovava sobre as demos claras. */
            className="rounded-full bg-[#0B1410] px-3 py-1 text-[11px] text-[#E8ECEA]"
          >
            Alterne entre as versões
          </motion.p>
        )}
      </AnimatePresence>

      {/*
        O `role="tablist"` só pode conter filhos com `role="tab"` — por isso o
        link de volta e o divisor ficam FORA dele, neste container externo.
        Com eles dentro, a auditoria `aria-required-children` reprovava em
        todas as 12 rotas de demo de uma vez.

        A pílula é quase opaca (0.95) de propósito: com 0.82 o fundo da página
        atravessava o blur e o contraste do texto virava loteria — reprovava em
        `color-contrast` sobre as demos claras e passava sobre a Oniria.
      */}
      <div
        className={cn(
          'flex items-center gap-1 rounded-full border p-1',
          'border-[rgb(255_255_255_/_0.12)] bg-[rgb(6_11_8_/_0.95)] text-[#E8ECEA]',
          'shadow-[0_8px_32px_-8px_rgb(0_0_0_/_0.5)] backdrop-blur-[20px]',
          // Fontes da Anank, não da demo em que o toggle está flutuando.
          'font-[family-name:var(--font-poppins)]'
        )}
      >
        <IntentLink
          href="/"
          aria-label="Voltar para o hub da Anank Studios"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#C9CFCC] transition-colors hover:bg-white/10 hover:text-[#F7F7F7]"
        >
          <GridIcon />
        </IntentLink>

        <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-white/12" />

        <div
          ref={listRef}
          role="tablist"
          aria-label="Alternar entre as demonstrações"
          onKeyDown={onKeyDown}
          className="flex items-center gap-1"
        >
          {SEGMENTS.map((segment) => {
            const isActive = segment.slug === active;

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
                      reduced ? { duration: 0.01 } : { type: 'spring', stiffness: 420, damping: 34 }
                    }
                  />
                )}
                {/*
                  Cores explícitas em vez de `opacity`. Opacidade sobre um fundo
                  translúcido deixa o contraste depender da página atrás — passava
                  na Oniria (escura) e reprovava na Aurea e na Vivace (claras).
                  #C9CFCC dá 12.4:1 e #F7F7F7 dá 15.8:1 sobre o preto da pílula.
                */}
                <span
                  className={cn(
                    'relative whitespace-nowrap',
                    isActive ? 'text-[#F7F7F7]' : 'text-[#C9CFCC]'
                  )}
                >
                  {segment.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
