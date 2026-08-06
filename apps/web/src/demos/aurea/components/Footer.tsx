import type { Demo } from '@anank/contracts';
import { InstagramIcon, WhatsappIcon } from './icons';
import { whatsappLink } from '../lib/format';

export function Footer({ demo }: { demo: Demo }) {
  const instagram = demo.socials.find((social) => social.label === 'Instagram');
  const wa = whatsappLink(demo.whatsapp, 'Oi! Vim pelo site do Aurea e quero agendar um horário.');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10 lg:px-14">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="font-display text-lg text-ink">Aurea Beauty Studio</p>

          <div className="flex items-center gap-3">
            {instagram && (
              <a
                href={instagram.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Aurea no Instagram"
                className="flex size-9 items-center justify-center rounded-full border border-line text-ink transition-colors duration-250 hover:border-accent hover:text-accent"
              >
                <InstagramIcon className="size-4" />
              </a>
            )}
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              aria-label="Aurea no WhatsApp"
              className="flex size-9 items-center justify-center rounded-full border border-line text-ink transition-colors duration-250 hover:border-accent hover:text-accent"
            >
              <WhatsappIcon className="size-4" />
            </a>
          </div>
        </div>

        <p className="mt-6 text-[13px] leading-relaxed text-muted">
          CNPJ {demo.cnpj} (fictício) · © {year} Aurea Beauty Studio
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          Empresa, endereço, CNPJ e depoimentos são fictícios. Demonstração criada pela Anank
          Studios.
        </p>
      </div>
    </footer>
  );
}
