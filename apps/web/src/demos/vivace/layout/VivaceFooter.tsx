import { IntentLink } from '@/shared/components/IntentLink';
import type { Demo } from '@anank/contracts';
import { CredentialBadge } from '../components/CredentialBadge';
import { NewsletterForm } from '../components/NewsletterForm';
import { VIVACE_UNITS } from '../lib/units';

const CATEGORY_ANCHORS = [
  { slug: 'facial', label: 'Facial' },
  { slug: 'corporal', label: 'Corporal' },
  { slug: 'depilacao', label: 'Depilação' },
];

export function VivaceFooter({ demo }: { demo: Demo }) {
  const years = demo.stats?.[0]?.value ?? String(new Date().getFullYear() - demo.since);

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-14">
        <div className="lg:col-span-4">
          <span className="text-display text-[22px]">VIVACE</span>
          <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-[#636e67]">
            Clínica de estética facial e corporal com três unidades no Sul do Brasil. Avaliação
            individual, protocolo escrito e acompanhamento fotográfico padronizado.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <CredentialBadge>Registro Anvisa</CredentialBadge>
            <CredentialBadge>{years} anos de clínica</CredentialBadge>
          </div>
        </div>

        <div className="mt-12 lg:col-span-3 lg:col-start-6 lg:mt-0">
          <p className="label-caps text-[#636e67]">Mapa do site</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li>
              <IntentLink href="/demo/vivace" className="hover:text-accent">
                Início
              </IntentLink>
            </li>
            <li>
              <IntentLink href="/demo/vivace/servicos" className="hover:text-accent">
                Serviços
              </IntentLink>
            </li>
            <li>
              <IntentLink href="/demo/vivace/sobre" className="hover:text-accent">
                Sobre
              </IntentLink>
            </li>
            <li>
              <IntentLink href="/demo/vivace/contato" className="hover:text-accent">
                Contato
              </IntentLink>
            </li>
            {CATEGORY_ANCHORS.map((category) => (
              <li key={category.slug}>
                <IntentLink
                  href={`/demo/vivace/servicos#${category.slug}`}
                  className="text-[#636e67] hover:text-accent"
                >
                  Serviços · {category.label}
                </IntentLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 lg:col-span-2 lg:mt-0">
          <p className="label-caps text-[#636e67]">Unidades</p>
          <ul className="mt-4 flex flex-col gap-4 text-sm">
            {VIVACE_UNITS.map((unit) => (
              <li key={unit.slug}>
                <p className="text-ink">{unit.city}</p>
                <p className="text-[#636e67]">{unit.phone}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 lg:col-span-3 lg:mt-0">
          <p className="label-caps text-[#636e67]">Receba novidades</p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-line px-6 py-6 md:px-10 lg:px-14">
        <p className="mx-auto max-w-[1400px] text-[11px] leading-relaxed text-[#636e67]">
          Clínica, unidades, profissionais, registros e depoimentos são fictícios. Demonstração
          criada pela Anank Studios.
        </p>
      </div>
    </footer>
  );
}
