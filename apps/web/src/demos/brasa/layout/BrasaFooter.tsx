import type { Demo } from '@anank/contracts';
import { IntentLink } from '@/shared/components/IntentLink';

/**
 * Rodapé comum às quatro abas.
 *
 * O AVISO DE DEMONSTRAÇÃO é obrigatório e não pode ficar escondido atrás de
 * hover, acordeão ou fim de rolagem infinita: quem chega por link direto tem
 * que conseguir ler que a casa é fictícia. Por isso ele mora aqui, no rodapé
 * de todas as páginas, em tamanho legível.
 */
export function BrasaFooter({ demo }: { demo: Demo }) {
  return (
    <footer className="border-t border-line bg-[color:var(--brand-surface)]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-20 lg:px-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.85] tracking-[-0.045em]">
              BRASA
            </p>
            <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-muted">
              {demo.tagline}
            </p>
          </div>

          <div>
            <p className="font-mono-brand text-[10px] tracking-[0.18em] text-muted uppercase">
              Onde
            </p>
            <p className="mt-4 max-w-[24ch] text-[14px] leading-relaxed">{demo.address}</p>
            <p className="mt-3 text-[14px] text-muted">{demo.phone}</p>

            <ul className="mt-6 space-y-1.5">
              {demo.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] underline decoration-[color:var(--brand-muted)] underline-offset-4 hover:decoration-[color:var(--brand-accent)]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono-brand text-[10px] tracking-[0.18em] text-muted uppercase">
              Quando
            </p>
            <ul className="mt-4 space-y-2">
              {demo.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 text-[14px]">
                  <span className="text-muted">{h.day}</span>
                  <span className="shrink-0">{h.open}</span>
                </li>
              ))}
            </ul>

            <nav className="mt-7 flex flex-col gap-1.5" aria-label="Navegação do rodapé">
              <IntentLink href="/demo/brasa/cardapio" className="text-[14px] hover:text-accent">
                Cardápio
              </IntentLink>
              <IntentLink href="/demo/brasa/a-casa" className="text-[14px] hover:text-accent">
                A casa
              </IntentLink>
              <IntentLink href="/demo/brasa/visite" className="text-[14px] hover:text-accent">
                Visite
              </IntentLink>
            </nav>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-7">
          <p className="max-w-[80ch] text-[12px] leading-relaxed text-muted">
            {demo.legalName} · CNPJ {demo.cnpj} · {demo.address}
            <br />
            <strong className="font-semibold text-[color:var(--brand-ink)]">
              Demonstração criada pela Anank Studios.
            </strong>{' '}
            Estabelecimento, endereço, CNPJ, telefone, equipe e depoimentos são fictícios. Nenhum
            pedido é recebido, processado ou cobrado por este site.
          </p>
        </div>
      </div>
    </footer>
  );
}
