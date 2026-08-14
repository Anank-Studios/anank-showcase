'use client';

import { useState } from 'react';
import { IntentLink } from './IntentLink';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { DemoSummary, NicheSlug } from '@anank/contracts';
import { AnankSymbol } from './AnankMark';
import { ThemeToggle } from './ThemeToggle';
import { EASE } from '@/shared/lib/motion';
import type { Theme } from '@/shared/lib/theme';

/**
 * Hub da Anank Studios.
 *
 * O hub vende NÍVEL DE SERVIÇO, não marca fictícia. Quem chega aqui quer saber
 * a diferença entre o site de entrada e o topo de linha — o nome "Aurea Beauty
 * Studio" não diz nada sobre isso, e a foto competia com a informação que
 * importa. Por isso: sem foto, sem nome de marca, só o degrau.
 *
 * As três identidades continuam legíveis porque cada card usa a COR, o RAIO e
 * a FONTE DISPLAY reais da sua marca. É o argumento comercial sobrevivendo sem
 * fotografia.
 */
const T = {
  symbol: 0.1,
  wordmark: 0.22,
  toggle: 0.34,
  nichos: 0.42,
  cards: 0.5,
  cardStagger: 0.1,
} as const;

/**
 * Os nichos. O nicho NÃO vive na URL — as rotas seguem `/demo/<slug>` como
 * sempre, então nenhum link já entregue a cliente deixa de funcionar. Quem
 * agrupa é o dado (`demo.niche`) e este alternador.
 */
const NICHOS = [
  { slug: 'estetica' as const, label: 'Estética' },
  { slug: 'alimentacao' as const, label: 'Alimentação' },
];

export function HubIntro({ demos, theme }: { demos: DemoSummary[]; theme: Theme }) {
  const reduced = useReducedMotion();
  const [nicho, setNicho] = useState<NicheSlug>('estetica');

  const visiveis = demos.filter((d) => d.niche === nicho);

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[1100px] flex-col px-6 py-16 md:px-10 md:py-24">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
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
            transition={
              reduced ? { duration: 0.2 } : { duration: 0.8, delay: T.wordmark, ease: EASE }
            }
          >
            <span className="font-semibold">Anank</span>
            <span className="font-normal"> Studios</span>
          </motion.h1>
        </div>

        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0.2 } : { duration: 0.6, delay: T.toggle, ease: EASE }}
        >
          <ThemeToggle initial={theme} />
        </motion.div>
      </header>

      <motion.div
        className="mt-12 md:mt-14"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0.2 } : { duration: 0.6, delay: T.nichos, ease: EASE }}
      >
        <NicheSwitch value={nicho} onChange={setNicho} />
      </motion.div>

      {/*
        Alinhados horizontalmente: sem deslocamento vertical e com `items-stretch`,
        os cards terminam na mesma linha de base. Empilham em 390px — três
        colunas ali seriam ilegíveis, e o projeto é mobile-first.

        Sem `flex-1`: com foto, esticar os cards até o fim da viewport se
        justificava — a imagem preenchia. Sem foto, o mesmo esticão dava 521px
        de altura e um vazio no meio de cada card. Agora eles têm a altura que
        o conteúdo pede, e é o rodapé que desce sozinho com `mt-auto`.
      */}
      {/*
        O AnimatePresence recebe UM filho: a grade inteira, com a chave do
        nicho. Foram duas tentativas erradas antes desta, e vale registrar:

        `popLayout` posiciona quem sai de forma absoluta, e o card que entrava
        era empurrado centenas de pixels para baixo — com um só card no nicho,
        ele aparecia no meio da página.

        `mode="wait"` com os cards soltos como filhos foi pior: esse modo só
        lida com UM filho, e a grade simplesmente ficou vazia.

        Trocando a grade inteira, a troca de nicho é uma saída e uma entrada de
        um bloco só — que é o que a interface está de fato fazendo.
      */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={nicho}
          className="mt-8 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-3 sm:gap-5 md:mt-10 md:gap-6"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduced ? 0.15 : 0.32, ease: EASE }}
        >
          {visiveis.map((demo, index) => (
            <TierCard key={demo.slug} demo={demo} index={index} reduced={reduced} />
          ))}
        </motion.div>
      </AnimatePresence>

      {visiveis.length < 3 ? (
        <p className="mt-6 font-mono-brand text-[11px] tracking-[0.08em] text-muted">
          Mais demonstrações deste nicho em breve.
        </p>
      ) : null}

      <footer className="mt-auto pt-16">
        <p className="font-mono-brand text-[10px] tracking-[0.08em] text-muted">
          Demonstrações fictícias · 2026
        </p>
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Alternador de nicho. `role="tablist"` porque é exatamente isto: abas que
 * trocam o painel de cards abaixo, sem mudar de página.
 *
 * A pílula ativa é um `layoutId` do Motion — ela DESLIZA de uma aba para a
 * outra em vez de sumir e reaparecer, que é o que dá a leitura de "mesmo
 * objeto se movendo".
 */
function NicheSwitch({
  value,
  onChange,
}: {
  value: NicheSlug;
  onChange: (n: NicheSlug) => void;
}) {
  const reduced = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="Nicho das demonstrações"
      className="inline-flex items-center gap-1 rounded-full border border-[color:var(--switch-line)] p-1"
      style={
        {
          '--switch-line': 'color-mix(in srgb, var(--brand-muted) 45%, var(--brand-bg))',
          background: 'color-mix(in srgb, var(--brand-muted) 8%, var(--brand-bg))',
        } as React.CSSProperties
      }
    >
      {NICHOS.map((n) => {
        const ativo = n.slug === value;
        return (
          <button
            key={n.slug}
            type="button"
            role="tab"
            aria-selected={ativo}
            onClick={() => onChange(n.slug)}
            className="relative rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors"
          >
            {ativo && (
              <motion.span
                layoutId="nicho-pill"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-[color:var(--brand-accent)]"
                transition={
                  reduced ? { duration: 0.01 } : { type: 'spring', stiffness: 420, damping: 34 }
                }
              />
            )}
            {/* A tinta do FUNDO sobre o verde Anank: 6.8:1 no escuro, 8.4:1 no
                claro. Usar `--brand-ink` daria 2.6:1 no tema claro. */}
            <span
              className="relative"
              style={{ color: ativo ? 'var(--brand-bg)' : undefined }}
            >
              {n.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function TierCard({
  demo,
  index,
  reduced,
}: {
  demo: DemoSummary;
  index: number;
  reduced: boolean | null;
}) {
  /* Nível e selo vêm do DADO, não de uma tabela no componente. Com dois nichos
     o índice deixou de identificar o nível: a demo 03 da estética e a 03 da
     alimentação são as duas premium, mas cada nicho tem a sua sequência. */

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      /* Sem `exit` o AnimatePresence não tem o que animar na troca de nicho:
         os cards antigos sumiriam de um quadro para o outro. */
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={
        reduced
          ? { duration: 0.2 }
          : { duration: 0.7, delay: T.cards + index * T.cardStagger, ease: EASE }
      }
    >
      <IntentLink
        href={`/demo/${demo.slug}`}
        className="group block h-full transition-transform duration-300 motion-safe:hover:-translate-y-1.5"
        style={{ viewTransitionName: `demo-card-${demo.slug}` }}
      >
        {/*
          Os três cards são IGUAIS agora — mesma cor, mesmo raio, mesma fonte,
          todos na identidade da Anank. Antes cada um vestia a paleta da sua
          marca, e o resultado eram dois cards claros e um preto: parecia
          inconsistência do hub, não intenção. A marca de cada demo se apresenta
          quando o visitante entra nela.

          O preenchimento é derivado (`muted` a 6%) em vez de `bg-surface`: no
          tema escuro o surface (#0c1611) é quase o fundo da página e o card
          sumia. Assim ele ganha corpo nos dois temas com um valor só.
        */}
        <div
          className="relative flex h-full min-h-[13.5rem] flex-col overflow-hidden rounded-brand border border-[color:var(--card-line)] transition-[border-color,box-shadow] duration-300 group-hover:border-[color:var(--brand-accent)] group-hover:shadow-[0_18px_48px_-24px_var(--accent-glow)] md:min-h-[15.5rem]"
          style={
            {
              '--card-line': 'color-mix(in srgb, var(--brand-muted) 45%, var(--brand-bg))',
              background: 'color-mix(in srgb, var(--brand-muted) 6%, var(--brand-bg))',
            } as React.CSSProperties
          }
        >
          <div className="h-[5px] bg-[color:var(--brand-accent)]" />

          <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono-brand text-[10px] tracking-[0.16em] text-muted uppercase">
                Demo {index + 1}
              </p>

              {demo.popular ? (
                <span
                  className="font-mono-brand shrink-0 rounded-full px-2 py-[3px] text-[9px] font-bold tracking-[0.12em] uppercase"
                  /* Verde Anank preenchido com a tinta do fundo por cima:
                     6.8:1 no escuro, 8.4:1 no claro. */
                  style={{ background: 'var(--brand-accent)', color: 'var(--brand-bg)' }}
                >
                  Popular
                </span>
              ) : null}
            </div>

            <div className="mt-8">
              {/*
                Menor que antes e com `text-balance`: "Site Institucional
                (multi-abas)" tem 30 caracteres e, no corpo anterior, quebrava
                em três linhas tortas dentro do card.
              */}
              <p className="font-display text-[clamp(1.125rem,2.4vw,1.5rem)] leading-[1.15] font-medium tracking-[-0.01em] text-balance">
                {demo.tierLabel}
              </p>

              <div className="mt-4 flex items-baseline justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-[12px] text-muted transition-transform duration-300 group-hover:translate-x-0.5">
                  Ver demonstração
                  <span aria-hidden="true" className="text-[color:var(--brand-accent)]">
                    →
                  </span>
                </span>

                <span className="font-mono-brand text-[11px] font-bold text-[color:var(--brand-accent-2)]">
                  {demo.index}
                </span>
              </div>
            </div>
          </div>
        </div>
      </IntentLink>
    </motion.div>
  );
}
