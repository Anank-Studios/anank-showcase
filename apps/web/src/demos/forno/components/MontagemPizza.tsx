'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { ImageRef } from '@anank/contracts';

/**
 * SCROLL-TELLING: o caminho do balcão ao forno, contado em FOTOGRAFIA.
 *
 * Por que a versão anterior foi jogada fora
 * -----------------------------------------
 * A primeira tentativa desenhava a pizza em CSS: círculos para massa, molho e
 * queijo, e discos para a calabresa. Funcionava tecnicamente e não enganava
 * ninguém — de perto era desenho, não comida. Num site que vende apetite, isso
 * é o oposto do que se quer.
 *
 * Agora toda etapa é uma FOTO real, e o efeito é o encadeamento delas: as
 * imagens se sobrepõem dentro de um recorte circular fixo e trocam por
 * dissolve, com uma deriva lenta de escala em cada uma. O olho lê continuidade
 * porque o enquadramento nunca muda — é a câmera que percorre o processo.
 *
 * Não existe banco com as cinco etapas da MESMA pizza no mesmo ângulo e luz.
 * Tentar montar isso com fotos avulsas daria um corte de vídeo mal feito. O
 * dissolve dentro do círculo é o que sustenta a ilusão de um só objeto.
 *
 * Custo e acessibilidade
 * ----------------------
 * O GSAP entra por import dinâmico, só quando o bloco se aproxima. Com
 * `prefers-reduced-motion` não há pin nem timeline: mostra a última foto e as
 * etapas em texto, todas legíveis. O conteúdo é o mesmo nos dois casos.
 */

export interface Etapa {
  titulo: string;
  texto: string;
  foto: ImageRef;
}

export function MontagemPizza({ etapas }: { etapas: Etapa[] }) {
  const raizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return;

    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduz.matches) {
      raiz.dataset.estado = 'estatico';
      return;
    }

    let matar: (() => void) | undefined;
    let vivo = true;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (!vivo) return;

      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      /* Pin só a partir de 1024px: fixar uma seção alta em tela pequena rouba
         o scroll do visitante e o efeito vira armadilha. */
      mm.add('(min-width: 1024px)', () => {
        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: raiz,
              start: 'top top',
              end: `+=${etapas.length * 620}`,
              scrub: 0.7,
              pin: true,
              anticipatePin: 1,
            },
          });

          etapas.forEach((_, i) => {
            const foto = `[data-foto="${i}"]`;
            const texto = `[data-etapa="${i}"]`;

            if (i === 0) {
              /* A primeira já entra visível; só ganha a deriva de escala. */
              tl.set(foto, { opacity: 1 });
            } else {
              /* Dissolve: a nova sobe enquanto a anterior desce. Sem `zIndex`
                 explícito o navegador empilha pela ordem do DOM e a troca fica
                 dura — a de cima aparece de uma vez em cima da de baixo. */
              tl.to(foto, { opacity: 1, duration: 0.8, ease: 'power1.inOut' }, i * 1.2);
              tl.to(`[data-foto="${i - 1}"]`, { opacity: 0, duration: 0.8 }, i * 1.2);
            }

            /* Deriva de câmera: cada foto cresce devagar enquanto está em cena.
               É o que impede a imagem de parecer parada entre uma troca e a
               seguinte. */
            tl.fromTo(
              `${foto} > *`,
              { scale: 1.06 },
              { scale: 1.14, duration: 1.2, ease: 'none' },
              i * 1.2
            );

            /* Texto da etapa acompanha a foto. */
            tl.to(texto, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, i * 1.2);
            if (i < etapas.length - 1) {
              tl.to(texto, { opacity: 0.22, duration: 0.35 }, (i + 1) * 1.2 - 0.1);
            }
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
    <section
      ref={raizRef}
      data-estado="animado"
      aria-label="Do balcão ao forno"
      className="relative overflow-hidden bg-[color:var(--brand-bg)] px-5 py-20 md:px-10 lg:px-14 lg:py-0 [&[data-estado='estatico']_[data-etapa]]:!translate-y-0 [&[data-estado='estatico']_[data-etapa]]:!opacity-100 [&[data-estado='estatico']_[data-foto]]:!opacity-100"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-12 lg:min-h-svh lg:flex-row lg:gap-20">
        {/* ---- o círculo: todas as fotos empilhadas -------------------- */}
        <div className="relative aspect-square w-full max-w-[540px] shrink-0 lg:w-[47%]">
          <div className="absolute inset-0 overflow-hidden rounded-full ring-1 ring-[color:var(--brand-line)]">
            {etapas.map((e, i) => (
              <div
                key={e.titulo}
                data-foto={i}
                className="absolute inset-0 opacity-0"
                /* Empilhamento explícito: sem ele o dissolve fica duro. */
                style={{ zIndex: i + 1 }}
              >
                <div className="relative size-full will-change-transform">
                  <Image
                    src={e.foto.url}
                    alt={e.foto.alt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 47vw"
                    quality={62}
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
            {/* Vinheta: segura a borda do círculo contra o fundo e dá o ar de
                fotografia de restaurante, não de recorte. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 rounded-full shadow-[inset_0_0_80px_28px_rgb(18_12_8_/_0.75)]"
            />
          </div>

          {/* Calor do forno, atrás do círculo. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle,rgb(226_101_43_/_0.22)_0%,transparent_68%)] blur-2xl"
          />
        </div>

        {/* ---- as etapas ---------------------------------------------- */}
        <div className="w-full lg:w-[53%]">
          <p className="label-caps text-[color:var(--brand-accent)]">Do balcão ao forno</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,5.5vw,4rem)] leading-[1.02]">
            Cinco etapas. Nenhuma delas com pressa.
          </h2>

          <ol className="mt-10 space-y-7">
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
                  <p className="mt-1.5 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                    {e.texto}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
