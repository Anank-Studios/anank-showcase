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

/*
  TEMPOS — medidos, nao escolhidos no olho.

  A versao anterior levava 2,75s do clique ate a tela liberar, e a conta era:
  1,08s cobrindo + 0,87s buscando a rota + 0,82s descobrindo. O erro nao era a
  duracao das animacoes: era a ORDEM. O `router.push` so disparava quando a
  cobertura terminava, entao a pessoa passava quase um segundo encarando uma
  tela opaca e PARADA enquanto o servidor respondia.

  Agora a navegacao comeca junto com a cobertura, no instante em que os paineis
  ja escondem o suficiente para a troca nao piscar. A busca corre POR BAIXO da
  cortina em vez de depois dela.

  A saida e mais curta que a entrada (~65%) porque sair tem que parecer
  responsivo, nao cerimonioso.
*/
const COVER_S = 0.42;
const COVER_STAGGER_S = 0.045;
const UNCOVER_S = 0.34;
const UNCOVER_STAGGER_S = 0.03;
/** Quando disparar a rota, em fracao da cobertura. */
const PUSH_AT_S = 0.26;
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

      /*
        O OUVINTE E REGISTRADO ANTES DO DISPARO, e a ordem aqui e o bug inteiro.

        Registrando dentro do `onComplete` (0,42s) enquanto a rota dispara em
        0,26s, uma rota rapida commitava no meio: o efeito de `pathname` corria
        com `resolvePendingRef` ainda nulo, nao resolvia nada, e a promessa
        criada depois esperava ate o timeout. Media: 8,2s de tela travada.
      */
      const rotaPronta = waitForRouteChange();

      const inTl = gsap.timeline({
        onComplete: () => {
          void rotaPronta.then(() => {
            const outTl = gsap.timeline({ onComplete: finish });
            outTl.set(pageRef.current, { scale: 1.04, filter: 'blur(0px)' });
            if (panels?.length) {
              outTl.to(
                panels,
                {
                  yPercent: -100,
                  duration: UNCOVER_S,
                  ease: 'power3.inOut',
                  stagger: UNCOVER_STAGGER_S,
                },
                0
              );
            }
            outTl.to(pageRef.current, { scale: 1, duration: UNCOVER_S, ease: 'power3.inOut' }, 0);
          });
        },
      });

      inTl.set(pageRef.current, { willChange: 'transform, filter' });
      if (panels?.length) {
        inTl.set(panels, { yPercent: 100 });
        inTl.to(
          panels,
          { yPercent: 0, duration: COVER_S, ease: 'power3.inOut', stagger: COVER_STAGGER_S },
          0
        );
      }
      inTl.to(
        pageRef.current,
        { scale: 0.96, filter: 'blur(8px)', duration: COVER_S * 0.9, ease: 'power2.out' },
        0
      );

      /* O disparo da rota. Em PUSH_AT_S os paineis ja cobrem o bastante para a
         troca acontecer sem piscar, e a busca no servidor passa a correr em
         paralelo com o resto da cortina — que era o segundo perdido. */
      inTl.call(() => router.push(href), undefined, PUSH_AT_S);
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
