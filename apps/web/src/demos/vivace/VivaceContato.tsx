import { getDemo, getServices } from '@/shared/lib/api';
import { VivaceChrome } from './layout/VivaceChrome';
import { ContactForm } from './components/ContactForm';
import { VIVACE_UNITS } from './lib/units';

/**
 * PONTO DE ENTRADA da demo — o orquestrador importa este componente em
 * `app/demo/...`. O nome e a assinatura NÃO podem mudar.
 */
export async function VivaceContato() {
  const [demo, services] = await Promise.all([getDemo('vivace'), getServices('vivace')]);

  return (
    <VivaceChrome demo={demo}>
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 lg:px-14 lg:py-20">
        <p className="label-caps text-accent">Contato</p>
        <h1 className="text-display mt-3">Agende sua avaliação.</h1>
        <div className="mt-6 max-w-[62ch] border-t border-line pt-6">
          <p className="text-base leading-relaxed text-muted">
            Escolha a unidade mais próxima e conte o que você quer resolver. Respondemos por
            telefone, e-mail ou WhatsApp — normalmente no mesmo dia útil.
          </p>
        </div>

        <div className="mt-12">
          <ContactForm services={services} images={demo.images} />
        </div>
      </section>

      <section className="border-t border-line bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14">
          <h2 className="text-display text-[26px]">Canais diretos</h2>

          <div className="mt-10 grid grid-cols-1 gap-8 border-t border-line pt-10 sm:grid-cols-3">
            {VIVACE_UNITS.map((unit) => (
              <div key={unit.slug}>
                <p className="text-display text-[19px]">
                  {unit.city}
                  {unit.matriz ? <span className="ml-2 text-sm text-muted">(matriz)</span> : null}
                </p>
                <p className="mt-2 text-sm text-muted">{unit.address}</p>
                <p className="mt-2 text-sm text-ink">{unit.phone}</p>
                <p className="text-sm text-ink">
                  <a href={`https://wa.me/${unit.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-accent">
                    WhatsApp
                  </a>
                </p>
                <p className="mt-2 text-sm text-muted">{unit.hours}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 border-t border-line pt-6 text-sm text-muted">
            E-mail geral:{' '}
            <a href={`mailto:${demo.email}`} className="text-ink hover:text-accent">
              {demo.email}
            </a>
          </p>
        </div>
      </section>
    </VivaceChrome>
  );
}
