import Image from 'next/image';
import { getDemo, getServices, getTeam } from '@/shared/lib/api';
import { BLUR } from '@/shared/lib/blur';
import { OniriaFooter, OniriaNav } from './components/OniriaNav';
import { SplitText } from './components/SplitText';
import { HorizontalProtocols } from './components/HorizontalProtocols';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { KenBurnsHero } from './components/KenBurnsHero';
import { OniriaLink } from './components/transition/OniriaLink';

const MANIFESTO = [
  'Não tratamos rugas. Tratamos o tecido que as produz.',
  'A pele registra cada verão, cada noite mal dormida, cada ciclo. O registro é bioquímico, mensurável, e em grande parte reversível.',
  'O que fazemos aqui não é cobrir. É pedir ao tecido que volte a trabalhar.',
];

export async function OniriaHome() {
  const [demo, services, team] = await Promise.all([
    getDemo('oniria'),
    getServices('oniria'),
    getTeam('oniria'),
  ]);

  const helena = team[0];
  const images = demo.images;

  return (
    <div className="relative">
      <OniriaNav />

      {/* 1 · Hero ------------------------------------------------------- */}
      <KenBurnsHero image={images.hero ?? demo.thumbnail} />

      {/* 2 · Manifesto curto -------------------------------------------- */}
      <section className="px-5 py-24 md:px-10 md:py-36 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-caps text-accent">Manifesto</p>
          <div className="mt-8 max-w-[54ch] space-y-6">
            {MANIFESTO.map((paragraph, index) => (
              <SplitText
                key={paragraph}
                text={paragraph}
                as="p"
                delay={index * 0.05}
                className={
                  index === 0
                    ? 'font-display text-[clamp(1.75rem,5vw,3.25rem)] leading-[1.06]'
                    : 'text-base leading-relaxed text-muted md:text-lg'
                }
              />
            ))}
          </div>
          <OniriaLink
            href="/demo/oniria/manifesto"
            cursorLabel="LER"
            className="mt-10 inline-block border-b border-accent pb-1 text-sm text-accent-2"
          >
            Ler o manifesto
          </OniriaLink>
        </div>
      </section>

      {/* 3 · Os 5 protocolos, em scroll horizontal ---------------------- */}
      <HorizontalProtocols services={services} />

      {/* 4 · Resultados -------------------------------------------------- */}
      <section className="px-5 py-24 md:px-10 md:py-36 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-caps text-accent">Resultados</p>
          <SplitText
            text="Sem filtro. Mesma luz, mesmo ângulo, mesma distância."
            as="h2"
            className="mt-6 max-w-[20ch] font-display text-[clamp(1.75rem,6vw,3.5rem)] leading-[1.02]"
          />

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { before: images.antes1, after: images.depois1, caption: 'Protocolo Aurora · 3 sessões' },
              { before: images.antes2, after: images.depois2, caption: 'Protocolo Vórtice · sessão única' },
              { before: images.antes3, after: images.depois3, caption: 'Protocolo Nocturne · 6 sessões' },
            ].map((pair) =>
              pair.before && pair.after ? (
                <figure key={pair.caption}>
                  <BeforeAfterSlider before={pair.before} after={pair.after} />
                  <figcaption className="label-caps mt-4 text-muted">{pair.caption}</figcaption>
                </figure>
              ) : null
            )}
          </div>
        </div>
      </section>

      {/* 5 · Dra. Helena Kruger ----------------------------------------- */}
      {helena ? (
        <section className="border-t border-line px-5 py-24 md:px-10 md:py-36 lg:px-14">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="relative aspect-[3/4] lg:col-span-4">
              <Image
                src={helena.photo.url}
                alt={helena.photo.alt}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                placeholder="blur"
                blurDataURL={BLUR.oniria}
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <p className="label-caps text-accent">Direção científica</p>
              <h2 className="mt-6 font-display text-[clamp(2rem,7vw,4rem)] leading-[0.98]">
                {helena.name}
              </h2>
              <p className="label-caps mt-4 text-muted">{helena.registry}</p>
              <p className="mt-8 max-w-[48ch] leading-relaxed text-muted">{helena.bio}</p>
              <blockquote className="mt-10 max-w-[34ch] font-display text-[clamp(1.25rem,3.5vw,2rem)] leading-tight italic">
                “Quando a primeira coisa que percebem é o procedimento, o procedimento falhou.”
              </blockquote>
            </div>
          </div>
        </section>
      ) : null}

      {/* 6 · CTA --------------------------------------------------------- */}
      <section className="border-t border-line px-5 py-28 text-center md:px-10 md:py-40 lg:px-14">
        <SplitText
          text="A avaliação leva noventa minutos."
          as="h2"
          className="mx-auto max-w-[16ch] font-display text-[clamp(2rem,9vw,5.5rem)] leading-[0.96]"
        />
        <OniriaLink
          href="/demo/oniria/agendar"
          cursorLabel="AGENDAR"
          className="mt-12 inline-block border border-accent px-10 py-4 text-sm tracking-[0.18em] text-accent-2 uppercase transition-colors hover:bg-accent hover:text-bg"
        >
          Agendar
        </OniriaLink>
      </section>

      <OniriaFooter legalName={demo.legalName} cnpj={demo.cnpj} address={demo.address} />
    </div>
  );
}
