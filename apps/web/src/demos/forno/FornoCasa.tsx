import Image from 'next/image';
import { getDemo, getTeam, getTestimonials } from '@/shared/lib/api';
import { FornoFooter } from './layout/FornoFooter';
import { Reveal } from './components/Reveal';

export async function FornoCasa() {
  const [demo, equipe, depoimentos] = await Promise.all([
    getDemo('forno'),
    getTeam('forno'),
    getTestimonials('forno'),
  ]);

  return (
    <>
      <section className="px-5 pt-16 pb-14 md:px-10 md:pt-24 md:pb-20 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-caps text-[color:var(--brand-accent)]">A casa</p>
          <h1 className="mt-4 max-w-[13ch] font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.98]">
            Um forno, e o resto gira em volta dele.
          </h1>
          <p className="mt-7 max-w-[56ch] text-[clamp(1rem,1.7vw,1.1875rem)] leading-relaxed text-muted">
            {demo.description}
          </p>
        </div>
      </section>

      <Reveal>
        <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[21/9]">
          <Image
            src={demo.images.inteira!.url}
            alt={demo.images.inteira!.alt}
            fill
            priority
            quality={62}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Reveal>

      {/* ---- números ---------------------------------------------------- */}
      <section aria-label="Números do Forno" className="border-b border-line">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
          {(demo.stats ?? []).map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.06}
              className="border-line px-5 py-9 [&:not(:nth-child(2n))]:border-r md:border-r md:px-6 md:last:border-r-0"
            >
              <p className="font-display text-[2.25rem] leading-none md:text-[3rem]">{s.value}</p>
              <p className="mt-3.5 max-w-[20ch] text-[13px] leading-snug text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- o forno ----------------------------------------------------- */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={demo.images.fatia!.url}
                alt={demo.images.fatia!.alt}
                fill
                quality={62}
                sizes="(max-width: 768px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="label-caps text-[color:var(--brand-accent)]">Noventa segundos</p>
            <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[1.02]">
              O forno não desce de 480 graus.
            </h2>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-muted">
              Ele acende às três da tarde e leva quase três horas para chegar na temperatura. Depois
              disso não apaga mais até a última pizza — reaquecer custaria outro tanto de lenha e
              mudaria o gosto da massa.
            </p>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">
              Cada pizza fica noventa segundos lá dentro e é girada duas vezes com a pá. É por isso
              que a borda sai pintada de fogo em vez de dourada por igual.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- quem faz ---------------------------------------------------- */}
      <section className="border-t border-line bg-[color:var(--brand-surface)]">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <p className="label-caps text-[color:var(--brand-accent)]">Quem faz</p>
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:gap-16">
            {equipe.map((pessoa, i) => (
              <Reveal key={pessoa.id} delay={i * 0.08}>
                <article>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={pessoa.photo.url}
                      alt={pessoa.photo.alt}
                      fill
                      quality={62}
                      sizes="(max-width: 768px) 92vw, 46vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-6 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight">
                    {pessoa.name}
                  </h3>
                  <p className="label-caps mt-2 text-[color:var(--brand-accent-2)]">{pessoa.role}</p>
                  <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                    {pessoa.bio}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- depoimentos ------------------------------------------------- */}
      <section className="border-t border-line px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="label-caps text-[color:var(--brand-accent)]">Quem volta</p>
          </Reveal>

          {/* Sem retrato: depoimento fictício com foto de rosto de banco é a
              combinação mais fácil de confundir com pessoa real. */}
          <div className="mt-12 grid gap-px bg-line md:grid-cols-3">
            {depoimentos.map((d, i) => (
              <Reveal key={d.id} delay={i * 0.07} className="bg-[color:var(--brand-bg)]">
                <figure className="flex h-full flex-col justify-between p-7 md:p-8">
                  <blockquote className="font-display text-[1.125rem] leading-[1.45]">
                    “{d.quote}”
                  </blockquote>
                  <figcaption className="mt-8">
                    <span className="block text-[14px]">{d.name}</span>
                    <span className="block text-[12px] text-muted">{d.service}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- onde ---------------------------------------------------------- */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-2">
          <div className="border-line px-5 py-12 md:border-r md:px-10 md:py-16 lg:px-14">
            <Reveal>
              <p className="font-mono-brand text-[10px] tracking-[0.18em] text-muted uppercase">
                Endereço
              </p>
              <p className="mt-3 max-w-[24ch] font-display text-[clamp(1.375rem,3vw,2rem)] leading-[1.1]">
                {demo.address}
              </p>

              {/* Link, não `<iframe>`: o mapa incorporado traz script de
                  terceiro e centenas de kB para uma linha de endereço. */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(demo.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 border-b border-accent pb-1 text-[14px]"
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
              src={demo.images.tabua!.url}
              alt={demo.images.tabua!.alt}
              fill
              quality={62}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      <FornoFooter demo={demo} />
    </>
  );
}
