'use client';

import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ensureGsap, gsap, ScrollTrigger } from '../../lib/gsapClient';
import { useReducedMotion } from '../../lib/useReducedMotion';

/**
 * Transição cinematográfica entre páginas da Oniria.
 *
 * Quatro painéis verticais varrem a tela de baixo para cima em stagger,
 * o conteúdo antigo recua (scale + blur), a rota troca sob a máscara, e os
 * painéis se retiram para cima revelando a página nova. ~1.1s percebidos.
 *
 * NÃO usa `document.startViewTransition`. Uma versão anterior envolvia o
 * `router.push` numa View Transition nativa para dar continuidade ao elemento
 * compartilhado, e isso travava: se a transição fosse pulada ou rejeitasse,
 * o `Promise.all` rejeitava, o `.then()` que retirava os painéis nunca rodava,
 * e a tela ficava PRETA até um F5. Além disso o ganho era teórico — com quatro
 * painéis opacos cobrindo a tela durante a troca, o elemento compartilhado
 * nunca chegava a ser visto.
 *
 * A regra aqui é: a saída dos painéis **sempre** acontece. Qualquer caminho de
 * erro cai no mesmo `finish()`, e um watchdog destrava a tela se algo escapar.
 */

interface TransitionContextValue {
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useOniriaNavigate(): (href: string) => void {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error('useOniriaNavigate precisa estar dentro de <OniriaTransitionProvider>.');
  }
  return ctx.navigate;
}

const PANEL_COUNT = 4;
/** Tempo máximo esperando o App Router commitar a nova rota. */
const ROUTE_TIMEOUT_MS = 2500;
/** Rede de segurança: destrava a tela mesmo se tudo der errado. */
const WATCHDOG_MS = 6000;

export function OniriaTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();

  const panelsRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const resolvePendingRef = useRef<(() => void) | null>(null);
  const watchdogRef = useRef<number | null>(null);

  /* A rota mudou de verdade => a nova página já commitou. */
  useEffect(() => {
    resolvePendingRef.current?.();
    resolvePendingRef.current = null;
  }, [pathname]);

  /** Devolve a tela ao estado normal. Idempotente e sempre chamado. */
  const finish = useCallback(() => {
    if (watchdogRef.current !== null) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
    const overlay = overlayRef.current;
    const panels = panelsRef.current?.children;

    if (overlay) overlay.style.pointerEvents = 'none';
    if (panels?.length) gsap.set(panels, { yPercent: 100 });

    /* Limpa transform/filter/will-change: enquanto qualquer um deles estiver
       no elemento, ele continua sendo containing block e o `pin` do
       ScrollTrigger da página nova nasce quebrado. */
    gsap.set(pageRef.current, { clearProps: 'transform,filter,willChange,opacity' });
    ScrollTrigger.refresh();
    busyRef.current = false;
  }, []);

  const waitForRouteChange = useCallback(() => {
    return new Promise<void>((resolve) => {
      resolvePendingRef.current = resolve;
      window.setTimeout(resolve, ROUTE_TIMEOUT_MS);
    });
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (busyRef.current || href === pathname) return;
      busyRef.current = true;

      // Se qualquer coisa escapar, a tela se destrava sozinha.
      watchdogRef.current = window.setTimeout(finish, WATCHDOG_MS);

      if (reduced) {
        gsap.to(pageRef.current, { opacity: 0, duration: 0.1 });
        void waitForRouteChange().then(() => {
          gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
          finish();
        });
        router.push(href);
        return;
      }

      ensureGsap();
      const overlay = overlayRef.current;
      const panels = panelsRef.current?.children;
      if (overlay) overlay.style.pointerEvents = 'auto';

      const inTl = gsap.timeline({
        onComplete: () => {
          /* Painéis cobrindo a tela: agora sim a rota pode trocar sem que o
             usuário veja o DOM sendo remontado. */
          void waitForRouteChange().then(() => {
            const outTl = gsap.timeline({ onComplete: finish });
            outTl.set(pageRef.current, { scale: 1.04, filter: 'blur(0px)' });
            if (panels?.length) {
              outTl.to(
                panels,
                { yPercent: -100, duration: 0.7, ease: 'power4.inOut', stagger: 0.04 },
                0
              );
            }
            outTl.to(pageRef.current, { scale: 1, duration: 0.7, ease: 'power4.inOut' }, 0);
          });

          router.push(href);
        },
      });

      inTl.set(pageRef.current, { willChange: 'transform, filter' });
      if (panels?.length) {
        inTl.set(panels, { yPercent: 100 });
        inTl.to(panels, { yPercent: 0, duration: 0.9, ease: 'power4.inOut', stagger: 0.06 }, 0);
      }
      inTl.to(
        pageRef.current,
        { scale: 0.96, filter: 'blur(8px)', duration: 0.5, ease: 'power2.out' },
        0
      );
    },
    [pathname, reduced, router, waitForRouteChange, finish]
  );

  /* Se o componente desmontar no meio de uma transição, não deixa timer solto. */
  useEffect(() => {
    return () => {
      if (watchdogRef.current !== null) window.clearTimeout(watchdogRef.current);
    };
  }, []);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {/*
        NADA de `will-change`, `transform` ou `filter` permanentes aqui.
        Qualquer um deles cria um containing block, e todo `position: fixed`
        descendente passa a se posicionar em relação a ESTE elemento em vez da
        viewport — o que quebra o `pin` do ScrollTrigger (a seção de protocolos
        ficava com `top: -5700px`, rolando para fora da tela).
        As propriedades são aplicadas só durante a transição e limpas no fim.
      */}
      <div ref={pageRef}>{children}</div>

      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[150] flex overflow-hidden"
      >
        <div ref={panelsRef} className="flex h-full w-full">
          {Array.from({ length: PANEL_COUNT }).map((_, index) => (
            <div key={index} className="h-full w-1/4 translate-y-full bg-surface" />
          ))}
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
