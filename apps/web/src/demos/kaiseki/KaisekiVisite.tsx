import Image from 'next/image';
import { getDemo } from '@/shared/lib/api';
import { KaisekiFooter } from './layout/KaisekiFooter';
import { Reveal } from './components/Reveal';
import { ReservaBalcao } from './components/ReservaBalcao';

export async function KaisekiVisite() {
  const demo = await getDemo('kaiseki');

  return (
    <>
      <section className="px-5 pt-16 pb-14 md:px-10 md:pt-24 md:pb-20 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
            A casa
          </p>
          <h1 className="mt-4 max-w-[14ch] font-display text-[clamp(2.25rem,7vw,5rem)] leading-[1.02]">
            Dez lugares e catorze mesas.
          </h1>
          <p className="mt-7 max-w-[54ch] text-[15px] leading-relaxed text-muted">
            O balcão é reserva; o salão aceita quem chega. Nas sextas e sábados o salão costuma
            encher antes das 20h30, então vale ligar antes de sair de casa.
          </p>
        </div>
      </section>

      <Reveal>
        <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[21/9]">
          <Image
            src={demo.images.salao!.url}
            alt={demo.images.salao!.alt}
            fill
            priority
            quality={62}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Reveal>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-2">
          <div className="border-line px-5 py-12 md:border-r md:px-10 md:py-16 lg:px-14">
            <Reveal>
              <p className="font-mono-brand text-[10px] tracking-[0.18em] text-muted uppercase">
                Endereço
              </p>
              <p className="mt-3 max-w-[24ch] font-display text-[clamp(1.25rem,3vw,1.875rem)] leading-[1.15]">
                {demo.address}
              </p>

              {/*
                Link para o mapa, não `<iframe>`. O incorporado do Google traz
                script de terceiro, cookie e centenas de kB para uma página cujo
                conteúdo útil é uma linha de endereço — e ainda empurra o LCP.
              */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(demo.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 border-b border-accent pb-1 text-[14px] font-medium"
              >
                Abrir no mapa
                <span aria-hidden="true">↗</span>
              </a>

              <dl className="mt-10 space-y-3 border-t border-line pt-8">
                {demo.hours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-6 text-[15px]">
                    <dt className="text-muted">{h.day}</dt>
                    <dd className="shrink-0 text-right">{h.open}</dd>
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

          <Reveal className="relative min-h-[20rem] md:min-h-[30rem]">
            <Image
              src={demo.images.mesa!.url}
              alt={demo.images.mesa!.alt}
              fill
              quality={62}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* ---- reserva do balcão ------------------------------------------- */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
              Balcão
            </p>
            <h2 className="mt-4 max-w-[15ch] font-display text-[clamp(1.625rem,4.5vw,3rem)] leading-[1.06]">
              A agenda abre na segunda.
            </h2>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-muted">
              São dez lugares por serviço e dois serviços por noite, de terça a sábado. Deixe o dia
              que prefere e quantos lugares — a casa responde por WhatsApp quando a semana abre.
            </p>

            <div className="relative mt-10 aspect-[3/2] overflow-hidden">
              <Image
                src={demo.images.detalhe!.url}
                alt={demo.images.detalhe!.alt}
                fill
                quality={62}
                sizes="(max-width: 768px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ReservaBalcao />
          </Reveal>
        </div>
      </section>

      <KaisekiFooter demo={demo} />
    </>
  );
}
