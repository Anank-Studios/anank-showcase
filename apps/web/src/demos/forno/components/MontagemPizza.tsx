'use client';

import { useEffect, useRef } from 'react';

/**
 * SCROLL-TELLING por SEQUÊNCIA DE QUADROS — a técnica que Apple usa nas páginas
 * de produto, e a terceira tentativa aqui. As duas primeiras foram jogadas fora
 * com razão:
 *
 *   1. Camadas em CSS (círculos para massa, molho, queijo). Funcionava e não
 *      enganava ninguém: de perto era desenho, não comida.
 *   2. Dissolve entre fotos avulsas do banco. Cada troca era outra pizza, então
 *      o objeto não tinha continuidade — lia como corte de vídeo mal feito.
 *
 * O que faz esta funcionar é o que respondia à pergunta certa: COERÊNCIA vem da
 * fonte, não da transição. Aqui os 96 quadros saem de um único plano contínuo,
 * com câmera travada — mesma tábua, mesma luz, mesmas mãos, do começo ao fim.
 * Não há nada para "casar" entre um quadro e o próximo porque eles nunca foram
 * separados.
 *
 * O desenho é num <canvas>, não em <img>: trocar `src` 96 vezes durante o
 * scroll faz o navegador decodificar a imagem no meio do gesto e engasgar. Com
 * canvas, os quadros são decodificados UMA vez no pré-carregamento e depois só
 * copiados — `drawImage` é operação de GPU.
 *
 * Custo: os quadros são arquivos estáticos em /public, servidos com extensão.
 * Isso os torna cacheáveis pela Cloudflare, ao contrário de `/_next/image`, que
 * medimos vindo `DYNAMIC` justamente por não ter extensão na URL.
 */

const TOTAL = 96;
const CAMINHO = (i: number) => `/forno/montagem/q${String(i + 1).padStart(3, '0')}.webp`;

/** Proporção do vídeo de origem. Fixa aqui para o canvas nunca distorcer. */
const LARGURA = 880;
const ALTURA = 495;

export interface Etapa {
  titulo: string;
  texto: string;
}

export function MontagemPizza({ etapas }: { etapas: Etapa[] }) {
  const raizRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    const canvas = canvasRef.current;
    if (!raiz || !canvas) return;

    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    const quadros: HTMLImageElement[] = [];
    let atual = -1;
    let vivo = true;
    let matar: (() => void) | undefined;

    const desenhar = (i: number) => {
      const img = quadros[i];
      /* Quadro ainda não carregado: mantém o anterior em vez de piscar branco.
         Com carregamento progressivo isso acontece nos primeiros segundos. */
      if (!img?.complete || i === atual) return;
      ctx2d.drawImage(img, 0, 0, LARGURA, ALTURA);
      atual = i;
    };

    /*
      Carregamento em DUAS PASSADAS. Baixar 96 arquivos de uma vez atrasa tudo
      o mais da página; baixar sob demanda faz o scroll mostrar buracos.

      Passada grossa: 1 a cada 6 quadros (16 arquivos) — já dá para percorrer a
      sequência inteira, com salto. Passada fina: o resto, em ordem.
    */
    const carregar = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          if (i === 0) desenhar(0);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = CAMINHO(i);
        quadros[i] = img;
      });

    void (async () => {
      const grossos = Array.from({ length: TOTAL }, (_, i) => i).filter((i) => i % 6 === 0);
      await Promise.all(grossos.map(carregar));
      if (!vivo) return;

      const finos = Array.from({ length: TOTAL }, (_, i) => i).filter((i) => i % 6 !== 0);
      void Promise.all(finos.map(carregar));

      /* Sem movimento: mostra o último quadro, que é a pizza pronta. */
      const reduz = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (reduz.matches) {
        raiz.dataset.estado = 'estatico';
        await carregar(TOTAL - 1);
        desenhar(TOTAL - 1);
        return;
      }

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (!vivo) return;

      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      /* Pin só a partir de 1024px: fixar uma seção alta em tela pequena rouba o
         scroll do visitante e o efeito vira armadilha. */
      mm.add('(min-width: 1024px)', () => {
        const ctx = gsap.context(() => {
          const cursor = { i: 0 };
          let etapaAtual = -1;

          gsap.to(cursor, {
            i: TOTAL - 1,
            ease: 'none',
            /* `snap` para o índice cair em inteiro: sem isso `drawImage`
               receberia 43.7 e o quadro ficaria oscilando entre dois. */
            snap: { i: 1 },
            scrollTrigger: {
              trigger: raiz,
              start: 'top top',
              end: `+=${TOTAL * 26}`,
              scrub: 0.5,
              pin: true,
              anticipatePin: 1,
            },
            onUpdate: () => {
              desenhar(cursor.i);
              /* O texto sai do MESMO indice de quadro, nao de um ScrollTrigger
                 paralelo. A primeira versao criava um trigger por etapa com
                 deslocamento calculado a mao, e nenhum disparava — as cinco
                 ficavam apagadas. Com fonte unica, imagem e texto nao tem como
                 sair de sincronia. */
              const etapa = Math.min(
                etapas.length - 1,
                Math.floor((cursor.i / (TOTAL - 1)) * etapas.length)
              );
              if (etapa !== etapaAtual) {
                etapaAtual = etapa;
                etapas.forEach((_, k) => {
                  gsap.to(`[data-etapa="${k}"]`, {
                    opacity: k === etapa ? 1 : 0.22,
                    y: k === etapa ? 0 : 12,
                    duration: 0.3,
                    ease: 'power2.out',
                  });
                });
              }
            },
          });
        }, raiz);

        return () => ctx.revert();
      });

      matar = () => mm.revert();
    })();

    return () => {
      vivo = false;
      matar?.();
    };
  }, [etapas]);

  return (
    /*
      ESTA <div> NAO E DECORATIVA — sem ela a aplicacao quebra ao sair da pagina.

      Com `pin: true`, o GSAP EMBRULHA a secao num `pin-spacer` que ele mesmo
      cria, trocando o pai dela no DOM. O React continua achando que o pai e o
      original, e ao desmontar chama `parent.removeChild(secao)` num no que
      deixou de ser filho daquele pai:

        NotFoundError: Failed to execute 'removeChild' on 'Node'

      ...e a pagina inteira vira "Application error: a client-side exception has
      occurred". O bug existia desde o inicio, mas era inalcancavel: o Forno era
      pagina unica e nao havia para onde navegar. As abas o expuseram.

      Com o embrulho, o `pin-spacer` nasce DENTRO deste div. O React desmonta
      removendo este no do pai dele — que o GSAP nunca tocou — e leva o spacer
      junto. O `mm.revert()` da limpeza continua existindo e e o caminho feliz;
      isto e a rede que sustenta quando os dois competem pela mesma arvore.
    */
    <div>
      <section
        ref={raizRef}
        data-estado="animado"
        aria-label="Do balcão ao forno"
        className="relative overflow-hidden bg-[color:var(--brand-bg)] px-5 py-20 md:px-10 lg:px-14 lg:py-0 [&[data-estado='estatico']_[data-etapa]]:!translate-y-0 [&[data-estado='estatico']_[data-etapa]]:!opacity-100"
      >
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-12 lg:min-h-svh lg:flex-row lg:gap-16">
          <div className="w-full shrink-0 lg:w-[56%]">
            <div className="relative overflow-hidden rounded-[3px] ring-1 ring-[color:var(--brand-line)]">
              <canvas
                ref={canvasRef}
                width={LARGURA}
                height={ALTURA}
                /* O `alt` de um canvas é o `aria-label`: sem ele, leitor de tela
                 anuncia "canvas" e o visitante não sabe o que perdeu. */
                role="img"
                aria-label="Pizza sendo montada: massa, molho de tomate, muçarela rasgada, manjericão e azeite"
                className="block h-auto w-full bg-[color:var(--brand-surface)]"
              />
            </div>
            <p className="mt-4 font-mono-brand text-[10px] tracking-[0.08em] text-muted">
              96 quadros · role para montar
            </p>
          </div>

          <div className="w-full lg:w-[44%]">
            <p className="label-caps text-[color:var(--brand-accent)]">Do balcão ao forno</p>
            <h2 className="mt-5 font-display text-[clamp(1.875rem,4.5vw,3.25rem)] leading-[1.04]">
              Cinco etapas. Nenhuma delas com pressa.
            </h2>

            <ol className="mt-9 space-y-6">
              {etapas.map((e, i) => (
                <li
                  key={e.titulo}
                  data-etapa={i}
                  className="flex gap-5 opacity-22 lg:translate-y-3 motion-reduce:translate-y-0 motion-reduce:opacity-100"
                >
                  <span className="font-mono-brand pt-1 text-[11px] text-[color:var(--brand-accent)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-display text-xl leading-tight">{e.titulo}</p>
                    <p className="mt-1.5 max-w-[42ch] text-[15px] leading-relaxed text-muted">
                      {e.texto}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
