import Image from 'next/image';
import { getDemo } from '@/shared/lib/api';
import { BrasaFooter } from './layout/BrasaFooter';
import { Reveal } from './components/Reveal';
import { ReservaForm } from './components/ReservaForm';

export async function BrasaVisite() {
  const demo = await getDemo('brasa');

  return (
    <>
      <section className="px-5 pt-16 pb-14 md:px-10 md:pt-24 md:pb-20 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
            Visite
          </p>
          <h1 className="mt-4 max-w-[12ch] font-display text-[clamp(2.5rem,9vw,6.5rem)] leading-[0.85] tracking-[-0.045em]">
            Esquina de Pinheiros.
          </h1>
          <p className="mt-7 max-w-[50ch] text-[15px] leading-relaxed text-muted">
            Não pegamos reserva para menos de quatro pessoas — para duas, é chegar. A fila anda, e
            tem chope enquanto ela anda.
          </p>
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-2">
          <Reveal className="relative aspect-[4/3] md:aspect-auto md:min-h-[26rem]">
            <Image
              src={demo.images.balcao!.url}
              alt={demo.images.balcao!.alt}
              fill
              priority
              quality={62}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>

          <div className="border-line px-5 py-12 md:border-l md:px-10 md:py-16 lg:px-14">
            <Reveal>
              <p className="font-mono-brand text-[10px] tracking-[0.18em] text-muted uppercase">
                Endereço
              </p>
              <p className="mt-3 max-w-[24ch] font-display text-[clamp(1.375rem,3vw,2rem)] leading-[1.05] tracking-[-0.03em]">
                {demo.address}
              </p>

              {/*
                Link para o mapa, não `<iframe>` incorporado. Um iframe do
                Google traz script de terceiro, cookie e uns 900 kB para uma
                página cujo conteúdo útil é uma linha de endereço — e ainda
                empurra o LCP. O link faz o mesmo trabalho.
              */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(demo.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 border-b-2 border-accent pb-1 text-[14px] font-semibold"
              >
                Abrir no mapa
                <span aria-hidden="true">↗</span>
              </a>

              <dl className="mt-10 space-y-3 border-t border-line pt-8">
                {demo.hours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-6 text-[15px]">
                    <dt className="text-muted">{h.day}</dt>
                    <dd className="shrink-0 font-semibold">{h.open}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 space-y-2 border-t border-line pt-8 text-[15px]">
                <p>
                  <span className="text-muted">Telefone · </span>
                  {demo.phone}
                </p>
                <p>
                  <span className="text-muted">E-mail · </span>
                  {demo.email}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- reserva ----------------------------------------------------- */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="max-w-[14ch] font-display text-[clamp(1.875rem,5vw,3.5rem)] leading-[0.94] tracking-[-0.04em]">
              Mesa para quatro ou mais.
            </h2>
            <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-muted">
              Diga o dia, o horário e quantas pessoas. A casa responde por WhatsApp confirmando ou
              propondo outro horário. Grupos acima de dez, fale direto pelo telefone.
            </p>

            <div className="relative mt-10 aspect-[3/2] overflow-hidden">
              <Image
                src={demo.images.mesa!.url}
                alt={demo.images.mesa!.alt}
                fill
                quality={62}
                sizes="(max-width: 768px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ReservaForm />
          </Reveal>
        </div>
      </section>

      <BrasaFooter demo={demo} />
    </>
  );
}
