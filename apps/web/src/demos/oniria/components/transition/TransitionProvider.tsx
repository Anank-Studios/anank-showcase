'use client';

import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ensureGsap, gsap, ScrollTrigger } from '../../lib/gsapClient';
import { useReducedMotion } from '../../lib/useReducedMotion';

/**
 * Transição cinematográfica entre páginas da Oniria — duas camadas:
 *
 * (a) View Transitions API nativa (`document.startViewTransition`), que dá
 *     continuidade ao elemento com `view-transition-name` compartilhado
 *     (a imagem do protocolo). Fica escondida sob os painéis na maior parte
 *     do tempo — o ganho real dela é não deixar a troca de DOM "vazar" um
 *     frame errado, e é o mecanismo inteiro sob reduced-motion (a animação
 *     dos pseudo-elementos é zerada pelo `@media` global em globals.css).
 * (b) Overlay de 4 painéis + blur/scale no conteúdo, orquestrado com GSAP,
 *     por cima. Total percebido ≈ 1.1s.
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

function runViewTransition(update: () => Promise<void>): Promise<void> {
  if (typeof document === 'undefined' || typeof document.startViewTransition !== 'function') {
    return update();
  }
  const transition = document.startViewTransition(update);
  return transition.updateCallbackDone;
}

export function OniriaTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();

  const panelsRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const resolvePendingRef = useRef<(() => void) | null>(null);

  /* A rota mudou de verdade => a nova página já commitou. */
  useEffect(() => {
    resolvePendingRef.current?.();
    resolvePendingRef.current = null;
  }, [pathname]);

  const waitForRouteChange = useCallback((timeoutMs = 4000) => {
    return new Promise<void>((resolve) => {
      resolvePendingRef.current = resolve;
      window.setTimeout(resolve, timeoutMs);
    });
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (busyRef.current || href === pathname) return;
      busyRef.current = true;

      const commit = () => {
        const done = waitForRouteChange();
        router.push(href);
        return done;
      };

      if (reduced) {
        gsap.to(pageRef.current, { opacity: 0, duration: 0.1 });
        void runViewTransition(commit).then(() => {
          gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
          gsap.set(pageRef.current, { clearProps: 'opacity' });
          busyRef.current = false;
        });
        return;
      }

      ensureGsap();
      const overlay = overlayRef.current;
      const panels = panelsRef.current?.children;
      if (overlay) overlay.style.pointerEvents = 'auto';

      const inTl = gsap.timeline();
      // will-change só enquanto a transição roda — ver a nota no JSX abaixo.
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

      const panelsCovered = new Promise<void>((resolve) => {
        inTl.eventCallback('onComplete', () => resolve());
      });

      void Promise.all([panelsCovered, runViewTransition(commit)]).then(() => {
        const outTl = gsap.timeline({
          onComplete: () => {
            if (overlay) overlay.style.pointerEvents = 'none';
            /* Limpa transform/filter/will-change: enquanto qualquer um deles
               estiver no elemento, ele continua sendo containing block e o
               `pin` do ScrollTrigger da página nova nasce quebrado. */
            gsap.set(pageRef.current, {
              clearProps: 'transform,filter,willChange',
            });
            ScrollTrigger.refresh();
            busyRef.current = false;
          },
        });
        outTl.set(pageRef.current, { scale: 1.04, filter: 'blur(0px)' });
        if (panels?.length) {
          outTl.to(
            panels,
            {
              yPercent: -100,
              duration: 0.7,
              ease: 'power4.inOut',
              stagger: 0.04,
            },
            0
          );
        }
        outTl.to(pageRef.current, { scale: 1, duration: 0.7, ease: 'power4.inOut' }, 0);
      });
    },
    [pathname, reduced, router, waitForRouteChange]
  );

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
