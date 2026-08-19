'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Faixa horizontal com encaixe, arrasto e barra de progresso.
 *
 * É o substituto da grade de 3 colunas iguais — a fileira de cards idênticos é
 * o que faz uma página parecer template. Aqui os itens correm na horizontal,
 * o que dá ritmo diferente do resto da página e cabe naturalmente no celular.
 *
 * DE PROPÓSITO NÃO USA GSAP ScrollTrigger com `pin`. O sequestro de rolagem
 * vertical para horizontal exige prender a seção, e `pin` embrulha o elemento
 * num `pin-spacer`, troca o pai dele no DOM e quebra o React ao desmontar —
 * defeito que já derrubou a aplicação inteira neste projeto (ver
 * `docs/redesign-alimentacao.md`). Rolagem nativa com `scroll-snap` entrega
 * 90% da sensação sem nenhum desses riscos, e é acessível de graça.
 *
 * ACESSIBILIDADE: o contêiner é focável e tem `role="region"` com rótulo, então
 * quem navega por teclado alcança a faixa e rola com as setas. Sem isso, um
 * carrossel só-mouse esconde conteúdo de quem usa teclado.
 */
export function GaleriaHorizontal({
  children,
  rotulo,
  className,
}: {
  children: React.ReactNode;
  /** Nome da região, anunciado pelo leitor de tela. */
  rotulo: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progresso, setProgresso] = useState(0);

  const arrastando = useRef(false);
  const inicioX = useRef(0);
  const inicioScroll = useRef(0);

  const medir = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgresso(max <= 0 ? 0 : el.scrollLeft / max);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    medir();
    el.addEventListener('scroll', medir, { passive: true });
    /* `ResizeObserver` e não `resize` da janela: a faixa muda de largura
       quando as fotos carregam, não só quando a janela muda. */
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', medir);
      ro.disconnect();
    };
  }, [medir]);

  /* Arrasto com ponteiro. Só mouse: no toque a rolagem nativa já é melhor do
     que qualquer coisa que se implemente por cima dela. */
  function aoPressionar(evento: React.PointerEvent<HTMLDivElement>) {
    if (evento.pointerType !== 'mouse') return;
    arrastando.current = true;
    inicioX.current = evento.clientX;
    inicioScroll.current = ref.current?.scrollLeft ?? 0;
  }

  function aoMover(evento: React.PointerEvent<HTMLDivElement>) {
    if (!arrastando.current || !ref.current) return;
    ref.current.scrollLeft = inicioScroll.current - (evento.clientX - inicioX.current);
  }

  function soltar() {
    arrastando.current = false;
  }

  return (
    <div className={className}>
      <div
        ref={ref}
        role="region"
        aria-label={rotulo}
        tabIndex={0}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={soltar}
        onPointerLeave={soltar}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth md:gap-6"
        /* `touch-action: pan-x` deixa o gesto horizontal para a faixa e o
           vertical para a página — sem isso, arrastar na diagonal trava a
           rolagem da página inteira no celular. */
        style={{ touchAction: 'pan-x' }}
      >
        {children}
      </div>

      {/* Barra de progresso: numa faixa horizontal, sem ela o visitante não
          tem como saber quanto conteúdo ainda existe à direita. */}
      <div
        aria-hidden="true"
        className="mt-8 h-px w-full bg-[color:var(--brand-line)]"
      >
        <div
          className="h-px origin-left bg-[color:var(--brand-accent)] transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${Math.max(0.06, progresso)})`, width: '100%' }}
        />
      </div>
    </div>
  );
}
