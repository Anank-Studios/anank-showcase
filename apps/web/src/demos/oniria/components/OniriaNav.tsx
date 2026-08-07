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
 * Navegação da Oniria. Fica sobre o conteúdo, sem fundo — o contraste vem do
 * próprio fundo preto. Mobile: os quatro links em uma linha rolável, sem
 * hambúrguer; são poucos e curtos, e um painel seria peso desnecessário.
 */
export function OniriaNav() {
  const pathname = usePathname();

  return (
    <header className="absolute inset-x-0 top-0 z-40 px-5 pt-6 md:px-10 lg:px-14">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
        <OniriaLink
          href="/demo/oniria"
          cursorLabel="VER"
          className="font-display text-xl tracking-[0.22em] uppercase"
        >
          Oniria
        </OniriaLink>

        <nav aria-label="Navegação da ONIRIA">
          <ul className="no-scrollbar -mx-5 flex gap-6 overflow-x-auto px-5 sm:mx-0 sm:overflow-visible sm:px-0">
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
                      active ? 'text-accent-2' : 'text-muted hover:text-ink'
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
