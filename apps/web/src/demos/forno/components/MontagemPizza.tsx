'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/cn';

/**
 * SCROLL-TELLING: a pizza é montada conforme a página rola.
 *
 * Por que NÃO são cinco fotos trocando
 * ------------------------------------
 * A ideia óbvia seria uma foto por etapa — massa, molho, queijo, pepperoni,
 * assada. Não existe banco de imagem com as cinco etapas da MESMA pizza, no
 * mesmo ângulo e na mesma luz; trocar entre fotos diferentes lê como corte de
 * vídeo mal feito, não como montagem.
 *
 * Aqui há UMA foto real da pizza pronta, e as camadas são construídas por cima
 * com CSS: a massa entra por escala, o molho se espalha por um `clip-path`
 * circular que cresce, o queijo aparece por opacidade, as fatias de calabresa
 * entram uma a uma em posições fixas, e no fim a pizza "assa" — a foto real
 * revela por cima das camadas, com o brilho e o contraste subindo.
 *
 * O resultado é uma montagem contínua do mesmo objeto, que é o que o efeito
 * promete.
 *
 * Custo
 * -----
 * O GSAP + ScrollTrigger só é baixado quando este bloco entra em cena — quem
 * abre a página e não rola até aqui não paga por ele. Ver `dynamic()` em
 * `FornoHome`.
 *
 * Acessibilidade
 * --------------
 * Com `prefers-reduced-motion` a seção não é fixada nem animada: mostra a
 * pizza pronta e a lista de etapas em texto. O conteúdo é o mesmo.
 */

/** Posições das fatias de calabresa, em % do círculo. Fixas de propósito —
 *  aleatório a cada carregamento faria a montagem parecer diferente toda vez. */
const CALABRESA = [
  { x: 32, y: 28 },
  { x: 62, y: 24 },
  { x: 74, y: 52 },
  { x: 58, y: 74 },
  { x: 28, y: 66 },
  { x: 46, y: 48 },
  { x: 22, y: 46 },
  { x: 68, y: 38 },
];

const ETAPAS = [
  { titulo: 'A massa', texto: '48 horas de fermentação lenta, farinha tipo 00.' },
  { titulo: 'O molho', texto: 'San Marzano triturado à mão, sal e nada mais.' },
  { titulo: 'O queijo', texto: 'Fior di latte rasgado, nunca ralado.' },
  { titulo: 'A cobertura', texto: "'Nduja, distribuída para haver em toda fatia." },
  { titulo: '90 segundos', texto: 'A 480 graus, até a borda pintar de fogo.' },
];

export function MontagemPizza({ foto, alt }: { foto: string; alt: string }) {
  const raizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return;

    /* Respeita a preferência do sistema: sem pin, sem timeline. A seção fica
       legível e estática, com todas as camadas visíveis. */
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduz.matches) {
      raiz.dataset.estado = 'estatico';
      return;
    }

    let matar: (() => void) | undefined;
    let vivo = true;

    /* Import dinâmico: o GSAP entra no bundle DESTE bloco, não no da página. */
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (!vivo) return;

      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      /* O pin só existe a partir de 1024px. Em tela pequena, fixar uma seção
         alta rouba o scroll do visitante e o efeito vira armadilha. */
      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: raiz,
            start: 'top top',
            end: '+=2600',
            scrub: 0.6,
            pin: true,
            /* `anticipatePin` evita o salto de um quadro ao fixar. */
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          '[data-camada="massa"]',
          { scale: 0.72, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }
        )
          .fromTo(
            '[data-camada="molho"]',
            { clipPath: 'circle(0% at 50% 50%)' },
            { clipPath: 'circle(50% at 50% 50%)', duration: 1, ease: 'power1.inOut' },
            '>-0.2'
          )
          .fromTo(
            '[data-camada="queijo"]',
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, duration: 1, ease: 'power1.out' },
            '>-0.1'
          )
          .fromTo(
            '[data-camada="calabresa"] > span',
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2)' },
            '>-0.1'
          )
          /* O "forno": a foto real revela por cima e o conjunto ganha calor. */
          .fromTo(
            '[data-camada="assada"]',
            { opacity: 0, filter: 'brightness(0.7) saturate(0.6)' },
            { opacity: 1, filter: 'brightness(1) saturate(1)', duration: 1.2, ease: 'power2.inOut' },
            '>0.1'
          )
          .fromTo(
            '[data-brilho]',
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: 'power1.out' },
            '<0.3'
          );

        /* Os textos das etapas acompanham a timeline. */
        ETAPAS.forEach((_, i) => {
          tl.to(
            `[data-etapa="${i}"]`,
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
            i * 1.05
          );
          if (i < ETAPAS.length - 1) {
            tl.to(`[data-etapa="${i}"]`, { opacity: 0.25, duration: 0.4 }, (i + 1) * 1.05 - 0.1);
          }
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      matar = () => mm.revert();
    })();

    return () => {
      vivo = false;
      matar?.();
    };
  }, []);

  return (
    <section
      ref={raizRef}
      data-estado="animado"
      aria-label="Como a pizza é montada"
      className="group/mont relative overflow-hidden bg-[color:var(--brand-bg)] px-5 py-20 md:px-10 lg:px-14 lg:py-0 [&[data-estado='estatico']_[data-camada]]:!opacity-100 [&[data-estado='estatico']_[data-etapa]]:!translate-y-0 [&[data-estado='estatico']_[data-etapa]]:!opacity-100"
    >
      <div className="mx-auto flex min-h-[auto] max-w-[1400px] flex-col items-center gap-12 lg:min-h-svh lg:flex-row lg:gap-20">
        {/* ---- a pizza ------------------------------------------------- */}
        <div className="relative aspect-square w-full max-w-[520px] shrink-0 lg:w-[46%]">
          {/* massa */}
          <div
            data-camada="massa"
            className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_50%_45%,#e8c187_0%,#d8a45f_55%,#b87b3c_100%)] shadow-[0_30px_80px_-30px_rgb(0_0_0_/_0.8)]"
          />
          {/* molho */}
          <div
            data-camada="molho"
            className="absolute inset-[11%] rounded-full bg-[radial-gradient(circle_at_50%_50%,#c0341c_0%,#9d2515_100%)]"
          />
          {/*
            Queijo. SEM `mix-blend-screen`: com ele a camada clareava tudo o que
            estava embaixo e o conjunto virava um disco pálido só — o molho
            sumia e a leitura de "pizza" ia junto. Aqui ele cobre o molho
            deixando uma borda vermelha à mostra, que é como fica de verdade.
          */}
          <div
            data-camada="queijo"
            className="absolute inset-[16%] rounded-full bg-[radial-gradient(circle_at_38%_36%,#f7e6b8_0%,#eed695_58%,#dcbb70_100%)] opacity-95"
          />
          {/* cobertura */}
          <div data-camada="calabresa" className="absolute inset-0">
            {CALABRESA.map((p, i) => (
              <span
                key={i}
                className="absolute size-[9%] rounded-full bg-[radial-gradient(circle_at_38%_35%,#c9432c_0%,#93231a_100%)] shadow-[inset_0_-2px_4px_rgb(0_0_0_/_0.35)]"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              />
            ))}
          </div>
          {/* a foto real, revelada por último */}
          <div data-camada="assada" className="absolute inset-[4%] overflow-hidden rounded-full">
            <Image
              src={foto}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 90vw, 46vw"
              quality={62}
              className="object-cover"
            />
          </div>
          {/* calor do forno */}
          <div
            data-brilho
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgb(226_101_43_/_0.34)_0%,transparent_65%)] blur-2xl"
          />
        </div>

        {/* ---- as etapas ----------------------------------------------- */}
        <div className="w-full lg:w-[54%]">
          <p className="label-caps text-[color:var(--brand-accent)]">Do balcão ao forno</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,5.5vw,4rem)] leading-[1.02]">
            Cinco etapas. Nenhuma delas com pressa.
          </h2>

          <ol className="mt-10 space-y-7">
            {ETAPAS.map((e, i) => (
              <li
                key={e.titulo}
                data-etapa={i}
                className={cn(
                  'flex gap-5 opacity-25 lg:translate-y-3',
                  /* Sem JS a lista aparece inteira: o conteúdo não pode
                     depender da animação para existir. */
                  'motion-reduce:translate-y-0 motion-reduce:opacity-100'
                )}
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
