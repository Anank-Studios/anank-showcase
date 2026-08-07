'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import type { DemoSummary } from '@anank/contracts';
import { AnankSymbol } from './AnankMark';
import { EASE } from '@/shared/lib/motion';
import { BLUR } from '@/shared/lib/blur';

/**
 * Hub da Anank Studios.
 *
 * Deliberadamente mínimo: símbolo, wordmark e três badges. Sem subtítulo, sem
 * descrição, sem categoria, sem faixa de preço — o cliente abre a demo para
 * descobrir, não lê sobre ela aqui.
 *
 * Duas decisões contra o visual "gerado por IA":
 *  - cabeçalho alinhado à esquerda, não centralizado;
 *  - os três badges não formam uma fileira de cards idênticos: cada um tem
 *    proporção e deslocamento vertical próprios.
 *
 * Wordmark em Poppins 600/400, caixa mista, tracking -0.01em — o mesmo
 * tratamento do site institucional da Anank.
 */
const T = {
  symbol: 0.1,
  wordmark: 0.22,
  cards: 0.5,
  cardStagger: 0.1,
} as const;

/** Proporção e deslocamento por badge. É o que quebra a fileira regular. */
const SHAPE = [
  { ratio: 'aspect-[4/5]', offset: 'md:mt-16' },
  { ratio: 'aspect-[4/3]', offset: '' },
  { ratio: 'aspect-[3/4]', offset: 'md:mt-24' },
] as const;

export function HubIntro({ demos }: { demos: DemoSummary[] }) {
  const reduced = useReducedMotion();

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[1100px] flex-col px-6 py-16 md:px-10 md:py-24">
      <header className="flex items-center gap-3 md:gap-4">
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -35 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={reduced ? { duration: 0.2 } : { duration: 1, delay: T.symbol, ease: EASE }}
        >
          <AnankSymbol className="size-9 text-[color:var(--brand-accent)] md:size-11" />
        </motion.div>

        <motion.h1
          className="font-display text-[clamp(1.375rem,4vw,2rem)] leading-none tracking-[-0.01em]"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(10px)' }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={reduced ? { duration: 0.2 } : { duration: 0.8, delay: T.wordmark, ease: EASE }}
        >
          <span className="font-semibold">Anank</span>
          <span className="font-normal"> Studios</span>
        </motion.h1>
      </header>

      <div className="mt-16 grid flex-1 grid-cols-1 items-start gap-8 sm:grid-cols-3 sm:gap-6 md:mt-10 md:gap-8">
        {demos.map((demo, index) => (
          <DemoBadge key={demo.slug} demo={demo} index={index} reduced={reduced} />
        ))}
      </div>

      <footer className="mt-16">
        <p className="font-mono-brand text-[10px] tracking-[0.08em] text-muted">
          Demonstrações fictícias · 2026
        </p>
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------ */

function DemoBadge({
  demo,
  index,
  reduced,
}: {
  demo: DemoSummary;
  index: number;
  reduced: boolean | null;
}) {
  const shape = SHAPE[index] ?? SHAPE[1]!;

  return (
    <motion.div
      className={shape.offset}
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
        className="group block transition-transform duration-300 motion-safe:hover:-translate-y-1.5"
        style={{ viewTransitionName: `demo-card-${demo.slug}` }}
      >
        <LiveThumbnail demo={demo} ratio={shape.ratio} />

        <div className="mt-3.5 flex items-baseline justify-between gap-3">
          <span className="font-display text-[15px] font-medium">{demo.brandName}</span>
          <span className="font-mono-brand text-[11px] font-bold text-[color:var(--brand-accent-2)]">
            {demo.index}
          </span>
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
function LiveThumbnail({ demo, ratio }: { demo: DemoSummary; ratio: string }) {
  const t = demo.tokens;

  return (
    <div
      className={`relative w-full overflow-hidden border border-line transition-[border-color,box-shadow] duration-300 group-hover:border-[color:var(--brand-accent)] group-hover:shadow-[0_18px_48px_-24px_var(--accent-glow)] ${ratio}`}
      /* O raio é o DA MARCA, não o da Anank: é meia da diferenciação. A Oniria
         precisa ler como retângulo de aresta viva ao lado dos outros dois. */
      style={{ background: t.bg, borderRadius: t.radius }}
      aria-hidden="true"
    >
      <div style={{ height: t.radius === '0px' ? 1 : 5, background: t.accent }} />

      <div className="flex h-[calc(100%-5px)] flex-col p-3.5">
        <div className="flex gap-1.5">
          {[14, 10, 12].map((w, i) => (
            <span
              key={i}
              style={{ width: w, height: 3, background: t.muted, opacity: 0.3, borderRadius: 2 }}
            />
          ))}
        </div>

        <p
          className="mt-2 truncate"
          style={{
            color: t.ink,
            fontFamily: t.fontDisplay,
            fontSize: 17,
            lineHeight: 1.1,
            letterSpacing: t.radius === '0px' ? '-0.03em' : '-0.01em',
          }}
        >
          {demo.thumbnailWord}
        </p>

        <div className="relative mt-2 flex-1 overflow-hidden" style={{ borderRadius: t.radius }}>
          <Image
            src={demo.thumbnail.url}
            alt={demo.thumbnail.alt}
            fill
            sizes="(max-width: 640px) 90vw, 33vw"
            placeholder="blur"
            blurDataURL={BLUR.anank}
            className="object-cover transition-transform duration-600 ease-out group-hover:scale-105"
          />
        </div>

        <div
          className="mt-2"
          style={{
            width: 52,
            height: 12,
            background: t.accent,
            borderRadius: t.radius === '24px' ? 9999 : t.radius,
          }}
        />
      </div>
    </div>
  );
}
