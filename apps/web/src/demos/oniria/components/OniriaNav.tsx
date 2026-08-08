'use client';

import { usePathname } from 'next/navigation';
import { OniriaLink } from './transition/OniriaLink';
import { cn } from '@/shared/lib/cn';

const LINKS = [
  { href: '/demo/oniria/protocolos', label: 'Protocolos' },
  { href: '/demo/oniria/manifesto', label: 'Manifesto' },
  { href: '/demo/oniria/equipe', label: 'Equipe' },
  { href: '/demo/oniria/diario', label: 'Diário' },
] as const;

/**
 * Fundo das pílulas.
 *
 * A navegação é `absolute` SOBRE o conteúdo. Sem fundo próprio, ela dependia
 * de o hero ser escuro — e em toda página cujo topo é foto clara os nomes das
 * abas simplesmente sumiam. O `--brand-muted` (#85817a) sobre pele clara chega
 * a ficar abaixo de 2:1.
 *
 * Os números foram calculados contra BRANCO PURO, não contra o hero atual: a
 * pílula precisa continuar funcionando quando alguém trocar a foto.
 *
 * Fundo da marca a 72%. Composto sobre branco dá #4f4f50, e sobre ele:
 *   wordmark  #f2efe9 → 7.2:1
 *   aba ativa #e5d9c3 → 5.9:1
 *   aba inativa       → 5.1:1  (ver INACTIVE abaixo)
 *
 * A 55% o composto seria #787879 e o `--brand-muted` cairia para 1.15:1 —
 * trocaria um bug de legibilidade por outro. Daí 72%, não menos.
 *
 * O fallback de `supports` cobre navegador sem `backdrop-filter`: sem o blur
 * não há como achatar a foto por baixo, então o fundo fecha.
 */
const PILL =
  'border border-white/12 bg-[rgb(10_10_11_/_0.72)] backdrop-blur-xl supports-[not(backdrop-filter:blur(0px))]:bg-[rgb(10_10_11_/_0.92)]';

/**
 * Aba inativa. NÃO usa `--brand-muted` (#85817a): ele foi escolhido para o
 * fundo preto chapado da página, onde dá 5.1:1, e desaba sobre a pílula
 * translúcida. Este tom é o equivalente claro — 5.1:1 no pior caso.
 */
const INACTIVE = 'text-[#cfcbc4] hover:text-ink';

/**
 * Navegação da Oniria. Mobile: os quatro links em uma linha rolável, sem
 * hambúrguer; são poucos e curtos, e um painel seria peso desnecessário.
 *
 * O wordmark ganha pílula PRÓPRIA em vez de uma barra única de ponta a ponta:
 * ele sofre do mesmo problema de contraste que as abas, e uma faixa cheia
 * pesaria o topo e tiraria o ar editorial da marca.
 */
export function OniriaNav() {
  const pathname = usePathname();

  return (
    <header className="absolute inset-x-0 top-0 z-40 px-5 pt-6 md:px-10 lg:px-14">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <OniriaLink
          href="/demo/oniria"
          cursorLabel="VER"
          /* `inline-block`: o OniriaLink renderiza um <a>, e num inline puro o
             padding vertical não empurra a caixa — a pílula sairia achatada. */
          className={cn(
            PILL,
            'inline-block self-start rounded-full px-4 py-2 font-display text-xl tracking-[0.22em] uppercase'
          )}
        >
          Oniria
        </OniriaLink>

        <nav aria-label="Navegação da ONIRIA" className="min-w-0">
          {/*
            Os cinco itens somam 442px e só há 348px em 390px de tela — medido,
            não estimado. Rolagem horizontal deixaria "Agendar", que é o CTA,
            escondido atrás de um gesto. Então a pílula QUEBRA em duas linhas no
            mobile e volta a ser uma linha a partir de `sm`. O raio acompanha:
            `rounded-full` em duas linhas viraria uma cápsula gorda.
          */}
          <ul
            className={cn(
              PILL,
              'flex flex-wrap items-center gap-x-5 gap-y-2 rounded-3xl px-4 py-2.5 sm:flex-nowrap sm:gap-x-6 sm:rounded-full'
            )}
          >
            {LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <OniriaLink
                    href={link.href}
                    cursorLabel="VER"
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'label-caps whitespace-nowrap transition-colors',
                      active ? 'text-accent-2' : INACTIVE
                    )}
                  >
                    {link.label}
                  </OniriaLink>
                </li>
              );
            })}
            <li>
              <OniriaLink
                href="/demo/oniria/agendar"
                cursorLabel="AGENDAR"
                className="label-caps whitespace-nowrap border-b border-accent pb-0.5 text-accent-2"
              >
                Agendar
              </OniriaLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

/** Rodapé mínimo, com o aviso obrigatório de demonstração. */
export function OniriaFooter({
  legalName,
  cnpj,
  address,
}: {
  legalName: string;
  cnpj: string;
  address: string;
}) {
  return (
    <footer className="border-t border-line px-5 py-12 md:px-10 lg:px-14">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <p className="font-display text-2xl tracking-[0.2em] uppercase">Oniria</p>
        <p className="max-w-[52ch] text-[11px] leading-relaxed text-muted">
          {legalName} · CNPJ {cnpj}
          <br />
          {address}
          <br />
          Instituto, endereço, CNPJ, profissionais, registros e depoimentos são fictícios.
          Demonstração criada pela Anank Studios.
        </p>
      </div>
    </footer>
  );
}
