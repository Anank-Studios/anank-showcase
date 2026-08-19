'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { IntentLink } from '@/shared/components/IntentLink';
import { cn } from '@/shared/lib/cn';
import { useOcultarAoRolar } from '@/demos/_alimentacao/motion/useOcultarAoRolar';
import { useSacola } from '@/demos/_alimentacao/sacola';

const LINKS = [
  { href: '/demo/forno/cardapio', label: 'Cardápio' },
  { href: '/demo/forno/a-casa', label: 'A casa' },
];

const FOCUSABLE = 'a[href], button:not([disabled])';

/**
 * Barra opaca. A translúcida foi testada e reprovada duas vezes no projeto:
 * sobre o herói fotográfico, o texto da página atravessa a barra e a navegação
 * some conforme a rolagem troca o que passa por trás.
 *
 * O contador da sacola mora aqui porque o cabeçalho é o único lugar presente
 * nas quatro abas — sem ele, quem adiciona um item no cardápio e sai da página
 * perde qualquer sinal de que a sacola existe.
 */
export function FornoHeader() {
  const pathname = usePathname();
  const oculto = useOcultarAoRolar();
  const { pecas } = useSacola();
  const [aberto, setAberto] = useState(false);
  const painelRef = useRef<HTMLDivElement>(null);
  const gatilhoRef = useRef<HTMLButtonElement>(null);

  const ativo = (href: string) => pathname.startsWith(href);

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
      /* Laço de foco: sem isso o Tab sai do painel e navega a página coberta. */
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
        <IntentLink href="/demo/forno" className="flex items-baseline gap-3">
          <span className="font-display text-[27px] leading-none">Forno</span>
          <span className="font-mono-brand hidden text-[9px] tracking-[0.22em] text-muted uppercase sm:inline">
            Vila Madalena
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
                  'absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-200 ease-out',
                  ativo(l.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                )}
              />
            </IntentLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <IntentLink
            href="/demo/forno/sacola"
            className="relative inline-flex items-center gap-2 rounded-brand border border-[color:var(--brand-muted)] px-3.5 py-2 text-[13px] transition-colors hover:border-[color:var(--brand-accent)]"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M4 6h12l-1 11H5L4 6zM7.5 6V4.5a2.5 2.5 0 015 0V6"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
            <span className="hidden sm:inline">Sacola</span>
            {/* O número entra no NOME ACESSÍVEL do link: assim o leitor de tela
                anuncia "Sacola, 3 itens" de uma vez. Um badge só visual deixaria
                quem não vê a tela sem a informação. */}
            <span className="sr-only">{pecas === 1 ? ', 1 item' : `, ${pecas} itens`}</span>
            {pecas > 0 ? (
              <span
                aria-hidden="true"
                className="font-mono-brand min-w-[1.25rem] bg-accent px-1 text-center text-[11px] font-bold text-[color:var(--brand-bg)]"
              >
                {pecas}
              </span>
            ) : null}
          </IntentLink>

          <button
            ref={gatilhoRef}
            type="button"
            aria-expanded={aberto}
            aria-controls="forno-menu"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((v) => !v)}
            /* Borda em `--brand-muted` (6.9:1), não em `--brand-line`: é o único
               limite visível do botão, e limite de componente precisa de 3:1. */
            className="rounded-brand border border-[color:var(--brand-muted)] p-2 md:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
              {aberto ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" />
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
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setAberto(false)}
            />
            <motion.div
              id="forno-menu"
              ref={painelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              className="absolute inset-y-0 right-0 flex w-[86vw] max-w-sm flex-col bg-[color:var(--brand-surface)]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <span className="font-display text-[23px]">Forno</span>
                <button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={() => setAberto(false)}
                  className="rounded-brand border border-[color:var(--brand-muted)] p-2"
                >
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-7 px-6 py-9" aria-label="Navegação móvel">
                {[...LINKS, { href: '/demo/forno/sacola', label: 'Sacola' }].map((l) => (
                  <IntentLink
                    key={l.href}
                    href={l.href}
                    onClick={() => setAberto(false)}
                    aria-current={ativo(l.href) ? 'page' : undefined}
                    className="font-display text-[30px] leading-none"
                  >
                    {l.label}
                  </IntentLink>
                ))}
              </nav>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
