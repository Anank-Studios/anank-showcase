'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { IntentLink } from '@/shared/components/IntentLink';
import { cn } from '@/shared/lib/cn';
import { useOcultarAoRolar } from '@/demos/_alimentacao/motion/useOcultarAoRolar';

const LINKS = [
  { href: '/demo/brasa/cardapio', label: 'Cardápio' },
  { href: '/demo/brasa/a-casa', label: 'A casa' },
  { href: '/demo/brasa/visite', label: 'Visite' },
];

const FOCUSABLE = 'a[href], button:not([disabled])';

/**
 * Barra opaca, sempre. Não é preguiça: a versão translúcida foi testada e
 * reprovada duas vezes neste projeto — sobre a foto do herói, o texto da
 * página atravessava a barra e a navegação sumia conforme a rolagem trocava o
 * que passava por trás. A separação vem da linha inferior, que custa zero
 * legibilidade.
 *
 * Na Brasa a barra creme sobre a foto escura do herói ainda vira desenho: ela
 * emoldura a imagem em vez de flutuar sobre ela.
 */
export function BrasaHeader() {
  const pathname = usePathname();
  const oculto = useOcultarAoRolar();
  const [aberto, setAberto] = useState(false);
  const painelRef = useRef<HTMLDivElement>(null);
  const gatilhoRef = useRef<HTMLButtonElement>(null);

  const ativo = (href: string) => pathname.startsWith(href);
  const fechar = () => setAberto(false);

  useEffect(() => {
    if (!aberto) return;

    const focaveis = painelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    focaveis?.[0]?.focus();

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        setAberto(false);
        gatilhoRef.current?.focus();
        return;
      }
      /* Laço de foco: sem isso o Tab sai do painel e vai para a página atrás,
         que está coberta — o teclado navega em algo que ninguém vê. */
      if (evento.key !== 'Tab' || !focaveis || focaveis.length === 0) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (!primeiro || !ultimo) return;
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener('keydown', aoTeclar);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
    };
  }, [aberto]);

  useEffect(() => setAberto(false), [pathname]);

  return (
    <header
      /*
        Retrai ao rolar para baixo e volta ao subir. `translate` e nao
        `display`/`height`: transformar nao dispara layout, entao a barra
        desliza a 60fps e o conteudo da pagina nao pula junto.

        Fica presa aberta com o menu movel ABERTO — recolher a barra que
        contem o botao de fechar deixaria o painel sem saida visivel.
      */
      className={cn(
        'sticky top-0 z-40 border-b border-line bg-bg',
        'transition-transform duration-300 ease-out motion-reduce:transition-none',
        oculto && !aberto ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-5 md:px-10 lg:px-14">
        <IntentLink href="/demo/brasa" className="flex items-baseline gap-2.5">
          <span className="font-display text-[26px] leading-none tracking-[-0.04em]">BRASA</span>
          <span className="font-mono-brand hidden text-[9px] tracking-[0.22em] text-muted uppercase sm:inline">
            Pinheiros
          </span>
        </IntentLink>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Navegação principal">
          {LINKS.map((l) => (
            <IntentLink
              key={l.href}
              href={l.href}
              aria-current={ativo(l.href) ? 'page' : undefined}
              className="group relative py-1 text-[14px]"
            >
              {l.label}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute inset-x-0 -bottom-0.5 h-[2px] origin-left bg-accent transition-transform duration-200 ease-out',
                  ativo(l.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                )}
              />
            </IntentLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/*
            "Peça pelo WhatsApp", não "Peça agora": esta demo NÃO vende pelo
            site, e um botão que promete carrinho e entrega numa página de
            contato é a pior forma de explicar o degrau entre os três níveis.
          */}
          <a
            href="https://wa.me/5511900000000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden bg-accent px-5 py-2.5 text-[13px] font-semibold text-[color:var(--brand-surface)] transition-opacity hover:opacity-90 md:inline-block"
          >
            Peça pelo WhatsApp
          </a>

          <button
            ref={gatilhoRef}
            type="button"
            aria-expanded={aberto}
            aria-controls="brasa-menu"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((v) => !v)}
            /* Borda em `--brand-muted` (5.4:1), não em `--brand-line` (1.3:1):
               o contorno é o único limite visível do botão, e limite de
               componente precisa de 3:1. O Lighthouse não audita isso. */
            className="border border-[color:var(--brand-muted)] p-2 md:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
              {aberto ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {aberto ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.button
              type="button"
              aria-label="Fechar menu"
              className="absolute inset-0 bg-[color:var(--brand-ink)]/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={fechar}
            />
            <motion.div
              id="brasa-menu"
              ref={painelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              className="absolute inset-y-0 right-0 flex w-[86vw] max-w-sm flex-col bg-bg"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <span className="font-display text-[22px] tracking-[-0.04em]">BRASA</span>
                <button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={fechar}
                  className="border border-[color:var(--brand-muted)] p-2"
                >
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-7 px-6 py-9" aria-label="Navegação móvel">
                {LINKS.map((l) => (
                  <IntentLink
                    key={l.href}
                    href={l.href}
                    onClick={fechar}
                    aria-current={ativo(l.href) ? 'page' : undefined}
                    className="font-display text-[30px] leading-none tracking-[-0.04em]"
                  >
                    {l.label}
                  </IntentLink>
                ))}
              </nav>

              <div className="border-t border-line p-6">
                <a
                  href="https://wa.me/5511900000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-accent px-5 py-3.5 text-center text-[14px] font-semibold text-[color:var(--brand-surface)]"
                >
                  Peça pelo WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
