import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDemo, getServices } from '@/shared/lib/api';
import { BLUR } from '@/shared/lib/blur';
import { OniriaFooter, OniriaNav } from './components/OniriaNav';
import { SplitText } from './components/SplitText';
import { Accordion } from './components/Accordion';
import { OniriaLink } from './components/transition/OniriaLink';

export async function OniriaProtocoloDetalhe({ slug }: { slug: string }) {
  const [demo, services] = await Promise.all([getDemo('oniria'), getServices('oniria')]);

  const index = services.findIndex((service) => service.slug === slug);
  const protocol = services[index];
  if (!protocol) notFound();

  /* Navegação circular: do último volta ao primeiro. */
  const next = services[(index + 1) % services.length]!;

  const spec = [
    { label: 'Duração', value: `${protocol.durationMin} min` },
    { label: 'Sessões', value: protocol.sessions ?? '—' },
    { label: 'Intervalo', value: protocol.interval ?? '—' },
    { label: 'Recuperação', value: protocol.recovery ?? '—' },
  ];

  return (
    <div className="relative">
      <OniriaNav />

      {/* Hero com o elemento compartilhado vindo da listagem ------------ */}
      <section className="relative h-[82svh] min-h-[480px] w-full overflow-hidden">
        <Image
          src={protocol.image.url}
          alt={protocol.image.alt}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR.oniria}
          className="object-cover"
          style={{ viewTransitionName: `protocolo-${protocol.slug}` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(10_10_11_/_0.45)] via-[rgb(10_10_11_/_0.25)] to-[rgb(10_10_11_/_0.92)]" />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-14 md:px-10 lg:px-14">
          <div className="mx-auto max-w-[1400px]">
            <p className="label-caps text-accent">{protocol.category}</p>
            <h1 className="mt-4 max-w-[14ch] font-display text-[clamp(2.5rem,12vw,8rem)] leading-[0.9] tracking-[-0.04em]">
              {protocol.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Ficha técnica --------------------------------------------------- */}
      <section className="border-b border-line px-5 md:px-10 lg:px-14">
        <dl className="mx-auto grid max-w-[1400px] grid-cols-2 lg:grid-cols-4">
          {spec.map((item, i) => (
            <div
              key={item.label}
              className={`border-line py-8 ${i % 2 === 0 ? 'border-r' : ''} lg:border-r lg:last:border-r-0 ${i < 2 ? 'border-b lg:border-b-0' : ''} pr-4 lg:pr-0 lg:pl-6 lg:first:pl-0`}
            >
              <dt className="label-caps text-accent">{item.label}</dt>
              <dd className="mt-2 font-display text-lg md:text-xl">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Narrativa em 3 atos --------------------------------------------- */}
      {(protocol.acts ?? []).map((act, i) => (
        <section key={act.title}>
          <div className="px-5 py-20 md:px-10 md:py-28 lg:px-14">
            <div className="mx-auto max-w-[1400px] lg:grid lg:grid-cols-12 lg:gap-16">
              <p className="label-caps text-muted lg:col-span-3">
                {String(i + 1).padStart(2, '0')} · {act.title}
              </p>
              <div className="mt-6 lg:col-span-8 lg:mt-0">
                <SplitText
                  text={act.body}
                  as="p"
                  className="max-w-[54ch] font-display text-[clamp(1.25rem,3.2vw,2rem)] leading-[1.3]"
                />
              </div>
            </div>
          </div>

          {act.image ? (
            <div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
              <Image
                src={act.image.url}
                alt={act.image.alt}
                fill
                sizes="100vw"
                placeholder="blur"
                blurDataURL={BLUR.oniria}
                className="object-cover"
              />
            </div>
          ) : null}
        </section>
      ))}

      {/* Indicações e contraindicações ----------------------------------- */}
      <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-0">
          <div className="lg:pr-16">
            <p className="label-caps text-accent">Indicações</p>
            <ul className="mt-6 space-y-3">
              {(protocol.indications ?? []).map((item) => (
                <li key={item} className="border-b border-line pb-3 text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:border-l lg:border-line lg:pl-16">
            <p className="label-caps text-accent">Contraindicações</p>
            <ul className="mt-6 space-y-3">
              {(protocol.contraindications ?? []).map((item) => (
                <li key={item} className="border-b border-line pb-3 text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ -------------------------------------------------------------- */}
      {protocol.faq?.length ? (
        <section className="px-5 pb-24 md:px-10 lg:px-14">
          <div className="mx-auto max-w-[860px]">
            <p className="label-caps text-accent">Perguntas</p>
            <div className="mt-8">
              <Accordion items={protocol.faq} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Próximo protocolo ------------------------------------------------ */}
      <section className="border-t border-line">
        <OniriaLink
          href={`/demo/oniria/protocolos/${next.slug}`}
          cursorLabel="VER"
          className="group flex items-center gap-6 px-5 py-14 md:px-10 md:py-20 lg:px-14"
        >
          <div className="mx-auto flex w-full max-w-[1400px] items-center gap-6">
            <div className="relative size-20 shrink-0 overflow-hidden md:size-28">
              <Image
                src={next.image.url}
                alt={next.image.alt}
                fill
                sizes="112px"
                placeholder="blur"
                blurDataURL={BLUR.oniria}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="label-caps text-muted">Próximo protocolo</p>
              <p className="mt-2 truncate font-display text-[clamp(1.5rem,5vw,3rem)] leading-tight">
                {next.name}
              </p>
            </div>
            <span aria-hidden="true" className="shrink-0 text-2xl text-accent transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </div>
        </OniriaLink>
      </section>

      <OniriaFooter legalName={demo.legalName} cnpj={demo.cnpj} address={demo.address} />
    </div>
  );
}
