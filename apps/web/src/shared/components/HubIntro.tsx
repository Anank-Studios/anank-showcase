'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import type { DemoSummary } from '@anank/contracts';
import { AnankSymbol } from './AnankMark';
import { EASE } from '@/shared/lib/motion';
import { BLUR } from '@/shared/lib/blur';

/**
 * Hub da Anank Studios — ver specs/03-hub-anank.md.
 *
 * Identidade oficial (Anank-Studios/site-anank) em MODO CLARO:
 * Off-white #F7F7F7 · Black #060B08 · Verde Anank #2FAE80 · Pinho #1C3A2D.
 * Poppins como principal, JetBrains Mono na camada técnica.
 *
 * Sequência de entrada ≈ 1.6s. Sob reduced-motion vira um fade de 200ms.
 */
const T = {
  symbol: 0.1,
  wordmark: 0.15,
  rule: 0.7,
  subtitle: 0.9,
  cards: 1.1,
  cardStagger: 0.09,
} as const;

export function HubIntro({ demos }: { demos: DemoSummary[] }) {
  const reduced = useReducedMotion();

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[1400px] flex-col px-6 pt-20 pb-10 md:px-10 lg:px-14 lg:pt-[13vh]">
      <header>
        <Wordmark reduced={reduced} />
        <Rule reduced={reduced} />
        <Intro reduced={reduced} />
      </header>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-[10vh] lg:gap-8">
        {demos.map((demo, index) => (
          <DemoCard key={demo.slug} demo={demo} index={index} reduced={reduced} />
        ))}
      </div>

      <footer className="mt-auto pt-16">
        <p className="font-mono-brand text-[11px] leading-relaxed text-muted">
          Anank Studios · Demonstrações fictícias criadas para fins de portfólio · 2026
        </p>
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------ */

function Wordmark({ reduced }: { reduced: boolean | null }) {
  // letter-spacing não é transformável; animamos uma vez só, no carregamento.
  const [tracking, setTracking] = useState(reduced ? '0.14em' : '0.42em');

  useEffect(() => {
    if (reduced) {
      setTracking('0.14em');
      return;
    }
    const id = window.setTimeout(() => setTracking('0.14em'), T.wordmark * 1000);
    return () => window.clearTimeout(id);
  }, [reduced]);

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -35 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={reduced ? { duration: 0.2 } : { duration: 1, delay: T.symbol, ease: EASE }}
      >
        <AnankSymbol className="size-11 shrink-0 text-[color:var(--brand-accent)] md:size-14 lg:size-16" />
      </motion.div>

      <motion.h1
        className="font-display text-[clamp(1.9rem,7.4vw,4.75rem)] leading-[1.02] font-light uppercase"
        style={{
          letterSpacing: tracking,
          transition: reduced ? 'none' : 'letter-spacing 900ms cubic-bezier(0.16,1,0.3,1)',
        }}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, filter: 'blur(12px)' }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={reduced ? { duration: 0.2 } : { duration: 0.9, delay: T.wordmark, ease: EASE }}
      >
        Anank Studios
      </motion.h1>
    </div>
  );
}

function Rule({ reduced }: { reduced: boolean | null }) {
  return (
    <motion.div
      aria-hidden="true"
      className="mt-7 h-px w-full origin-left bg-line"
      initial={reduced ? { opacity: 0 } : { scaleX: 0 }}
      animate={reduced ? { opacity: 1 } : { scaleX: 1 }}
      transition={reduced ? { duration: 0.2 } : { duration: 0.7, delay: T.rule, ease: EASE }}
    />
  );
}

function Intro({ reduced }: { reduced: boolean | null }) {
  return (
    <motion.div
      className="mt-6 lg:flex lg:justify-end"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0.2 } : { duration: 0.6, delay: T.subtitle, ease: EASE }}
    >
      <div className="lg:max-w-[36ch]">
        <p className="text-[15px] font-medium">Três níveis. Um padrão.</p>
        <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-muted">
          Três demonstrações de sites para beleza e estética — do essencial bem-feito ao que se
          espera de uma marca de luxo.
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

function DemoCard({
  demo,
  index,
  reduced,
}: {
  demo: DemoSummary;
  index: number;
  reduced: boolean | null;
}) {
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduced
          ? { duration: 0.2 }
          : { duration: 0.7, delay: T.cards + index * T.cardStagger, ease: EASE }
      }
    >
      <Link
        href={`/demo/${demo.slug}`}
        aria-label={`Abrir demonstração ${demo.index} — ${demo.brandName}, ${demo.category}`}
        className="group block overflow-hidden rounded-brand border border-line bg-surface transition-[transform,border-color,box-shadow] duration-300 hover:border-[color:var(--brand-accent)] hover:shadow-[0_18px_48px_-24px_var(--accent-glow)] motion-safe:hover:scale-[1.03]"
        style={{ viewTransitionName: `demo-card-${demo.slug}` }}
      >
        <LiveThumbnail demo={demo} />

        <div className="px-5 pt-4 pb-5">
          <div className="flex items-center justify-between">
            {/* Único elemento acentuado do card. O Verde Anank entra como
                chip de fundo; o numeral fica em Pinho (11.6:1) porque o Verde
                puro sobre claro dá só 2.6:1 e reprovaria como cor de texto. */}
            <span className="rounded-full bg-[rgb(47_174_128_/_0.14)] px-2.5 py-1 font-mono-brand text-[13px] font-bold text-[color:var(--brand-accent-2)]">
              {demo.index}
            </span>
            <span className="font-mono-brand text-[10px] tracking-[0.16em] text-muted uppercase">
              {demo.category}
            </span>
          </div>

          <h2 className="mt-2 font-display text-[1.4rem] leading-tight font-medium">
            <span className="relative inline-block">
              {demo.brandName}
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-[color:var(--brand-accent)] transition-transform duration-300 group-hover:scale-x-100"
              />
            </span>
          </h2>

          <p className="mt-2.5 text-[13px] leading-relaxed font-light text-muted">{demo.tagline}</p>

          <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
            <span className="font-mono-brand text-[13px] font-medium">{demo.priceRange}</span>
            <span className="flex translate-x-2 items-center gap-1 text-[12px] font-medium opacity-0 transition-all duration-250 group-hover:translate-x-0 group-hover:opacity-100">
              Abrir demo <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * Mini-mockup em CSS usando a paleta e a fonte display REAIS da marca.
 * Não é screenshot — é o argumento comercial: as 3 marcas precisam parecer
 * diferentes já aqui, em raio de borda, cor e tipografia.
 */
function LiveThumbnail({ demo }: { demo: DemoSummary }) {
  const t = demo.tokens;

  return (
    <div
      className="relative overflow-hidden"
      style={{ background: t.bg, aspectRatio: '4 / 3' }}
      aria-hidden="true"
    >
      {/* barra superior — filete de 1px na Oniria, 6px nas demais */}
      <div style={{ height: t.radius === '0px' ? 1 : 6, background: t.accent }} />

      <div className="flex h-[calc(100%-6px)] flex-col p-4">
        {/* nav simulada */}
        <div className="flex gap-1.5">
          {[16, 12, 14].map((w, i) => (
            <span
              key={i}
              style={{ width: w, height: 4, background: t.muted, opacity: 0.3, borderRadius: 2 }}
            />
          ))}
        </div>

        {/* headline na fonte display da marca */}
        <p
          className="mt-2.5 truncate"
          style={{
            color: t.ink,
            fontFamily: t.fontDisplay,
            fontSize: 20,
            lineHeight: 1.1,
            letterSpacing: t.radius === '0px' ? '-0.03em' : '-0.01em',
          }}
        >
          {demo.thumbnailWord}
        </p>

        {/* bloco de imagem real */}
        <div className="relative mt-2.5 flex-1 overflow-hidden" style={{ borderRadius: t.radius }}>
          <Image
            src={demo.thumbnail.url}
            alt={demo.thumbnail.alt}
            fill
            sizes="(max-width: 768px) 90vw, 30vw"
            placeholder="blur"
            blurDataURL={BLUR.anank}
            className="object-cover transition-transform duration-600 ease-out group-hover:translate-x-1.5 group-hover:scale-108"
          />
        </div>

        {/* botão simulado */}
        <div
          className="mt-2.5"
          style={{
            width: 62,
            height: 14,
            background: t.accent,
            borderRadius: t.radius === '24px' ? 9999 : t.radius,
          }}
        />
      </div>
    </div>
  );
}
