import Image from 'next/image';
import { getDemo, getMenu, getTestimonials } from '@/shared/lib/api';
import { IntentLink } from '@/shared/components/IntentLink';
import { BrasaFooter } from './layout/BrasaFooter';
import { HeroFoto } from './components/HeroFoto';
import { Reveal } from './components/Reveal';

export async function BrasaHome() {
  const [demo, menu, depoimentos] = await Promise.all([
    getDemo('brasa'),
    getMenu('brasa'),
    getTestimonials('brasa'),
  ]);

  const daChapa = menu.items.filter((i) => i.categoryId === 'chapa');

  return (
    <>
      {/* ---- herói ------------------------------------------------------ */}
      <section className="relative flex min-h-[calc(100svh-68px)] items-end overflow-hidden">
        <HeroFoto src={demo.images.hero!.url} alt={demo.images.hero!.alt} />

        {/* Degradê do pé para o topo: garante contraste do texto sobre
            QUALQUER parte da foto, não só sobre a que está lá hoje. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[rgb(12_9_7_/_0.92)] via-[rgb(12_9_7_/_0.5)] to-[rgb(12_9_7_/_0.2)]"
        />

        <div className="relative w-full px-5 pb-14 md:px-10 md:pb-20 lg:px-14">
          <div className="mx-auto max-w-[1400px]">
            <p className="font-mono-brand text-[10px] tracking-[0.22em] text-[#f0e7d8] uppercase">
              Pinheiros · desde {demo.since}
            </p>
            {/* Texto claro fixo, não `--brand-ink`: aqui o fundo é a foto
                escura, não o papel creme da marca. */}
            <h1 className="mt-4 font-display text-[clamp(3.5rem,17vw,12rem)] leading-[0.82] tracking-[-0.05em] text-[#fbf7ef]">
              BRASA
            </h1>
            <p className="mt-6 max-w-[38ch] text-[clamp(1rem,2.1vw,1.3rem)] leading-relaxed text-[#e6dccc]">
              {demo.tagline}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <IntentLink
                href="/demo/brasa/cardapio"
                className="bg-[#fbf7ef] px-7 py-3.5 text-[14px] font-semibold text-[#17130f] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Ver o cardápio
              </IntentLink>
              <IntentLink
                href="/demo/brasa/visite"
                className="border border-[#fbf7ef]/70 px-7 py-3.5 text-[14px] font-semibold text-[#fbf7ef] transition-colors hover:bg-[#fbf7ef]/10"
              >
                Como chegar
              </IntentLink>
            </div>
          </div>
        </div>
      </section>

      {/* ---- manifesto -------------------------------------------------- */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="max-w-[19ch] font-display text-[clamp(2rem,6.5vw,4.75rem)] leading-[0.92] tracking-[-0.04em]">
              Seis hambúrgueres.
              <br />
              <span className="text-accent">Nada congelado.</span>
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-9 max-w-[54ch] text-[clamp(1rem,1.6vw,1.125rem)] leading-relaxed text-muted">
              {demo.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- números ---------------------------------------------------- */}
      <section aria-label="Números da casa" className="border-y border-line">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
          {(demo.stats ?? []).map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.06}
              className="border-line px-5 py-9 [&:not(:nth-child(2n))]:border-r md:border-r md:px-6 md:last:border-r-0"
            >
              <p className="font-display text-[2.25rem] leading-none tracking-[-0.04em] md:text-[3rem]">
                {s.value}
              </p>
              <p className="mt-3.5 max-w-[20ch] text-[13px] leading-snug text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- os seis ---------------------------------------------------- */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
              Da chapa
            </p>
            <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(1.875rem,5.5vw,3.75rem)] leading-[0.94] tracking-[-0.04em]">
              Os seis que não saem de linha.
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {daChapa.map((item, i) => (
              <Reveal key={item.id} delay={(i % 3) * 0.07}>
                <article className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--brand-line)]">
                    <Image
                      src={item.image.url}
                      alt={item.image.alt}
                      fill
                      quality={62}
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                    />

                    {item.badges?.[0] ? (
                      <span className="font-mono-brand absolute top-4 left-4 bg-accent px-2.5 py-1 text-[9px] font-bold tracking-[0.12em] text-[color:var(--brand-surface)] uppercase">
                        {item.badges[0]}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-[1.5rem] leading-none tracking-[-0.03em]">
                      {item.name}
                    </h3>
                    <span className="font-mono-brand shrink-0 text-[13px] font-semibold text-accent">
                      R$ {item.price}
                    </span>
                  </div>
                  <p className="mt-3 max-w-[42ch] text-[14px] leading-relaxed text-muted">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- a carne ---------------------------------------------------- */}
      <section className="border-t border-line bg-[color:var(--brand-surface)]">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-10 md:py-28 lg:gap-20 lg:px-14">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={demo.images.carne!.url}
                alt={demo.images.carne!.alt}
                fill
                quality={62}
                sizes="(max-width: 768px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
              A carne
            </p>
            <h2 className="mt-4 max-w-[15ch] font-display text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[0.95] tracking-[-0.04em]">
              Moída às 15h. Servida às 18h.
            </h2>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-muted">
              Acém e peito, na proporção de sete para três, moídos no açougue da casa duas vezes por
              dia. Sem embalagem a vácuo, sem véspera, sem sobra. O que não sai na noite vira o molho
              do dia seguinte.
            </p>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">
              O disco é prensado uma única vez, na hora, e nunca é apertado depois — apertar espreme
              a gordura para a chapa, e a gordura é o motivo de tudo.
            </p>

            <IntentLink
              href="/demo/brasa/a-casa"
              className="mt-8 inline-flex items-center gap-2 border-b-2 border-accent pb-1 text-[14px] font-semibold"
            >
              Conheça a casa
              <span aria-hidden="true">→</span>
            </IntentLink>
          </Reveal>
        </div>
      </section>

      {/* ---- depoimentos ------------------------------------------------ */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
              Quem volta
            </p>
          </Reveal>

          {/*
            Sem retrato. Depoimento fictício com foto de rosto de banco é a
            combinação mais fácil de confundir com pessoa real — as iniciais
            dizem a mesma coisa sem inventar um rosto.
          */}
          <div className="mt-12 grid gap-px bg-line md:grid-cols-3">
            {depoimentos.map((d, i) => (
              <Reveal key={d.id} delay={i * 0.07} className="bg-[color:var(--brand-bg)]">
                <figure className="flex h-full flex-col justify-between p-7 md:p-8">
                  <blockquote className="font-display text-[1.125rem] leading-[1.35] tracking-[-0.02em]">
                    “{d.quote}”
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="font-mono-brand flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-[color:var(--brand-surface)]"
                    >
                      {d.name
                        .split(' ')
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                    <span>
                      <span className="block text-[14px] font-semibold">{d.name}</span>
                      <span className="block text-[12px] text-muted">{d.service}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- o degrau: esta casa não vende pelo site --------------------- */}
      {/*
        Esta seção é o argumento comercial da demo 01 e por isso é DESENHADA,
        não omitida. Um site institucional que finge ter loja é pior do que um
        que assume não ter: quem está avaliando os três níveis precisa ver
        exatamente onde termina este e começa o próximo.
      */}
      <section className="relative overflow-hidden border-t border-line">
        <div className="absolute inset-0">
          <Image
            src={demo.images.mesa!.url}
            alt=""
            aria-hidden="true"
            fill
            quality={62}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[rgb(12_9_7_/_0.82)]" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <p className="max-w-[17ch] font-display text-[clamp(1.875rem,5.5vw,3.75rem)] leading-[0.94] tracking-[-0.04em] text-[#fbf7ef]">
              A gente não vende pela internet.
            </p>
            <p className="mt-6 max-w-[48ch] text-[15px] leading-relaxed text-[#d8cdbd]">
              O hambúrguer sai da chapa e vai para a mesa em menos de um minuto. Entrega estragaria
              justamente o que ele tem de melhor. Reserve pelo WhatsApp ou apareça — a fila anda
              rápido.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="https://wa.me/5511900000000"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent px-7 py-3.5 text-[14px] font-semibold text-[#fbf7ef] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Chamar no WhatsApp
              </a>
              <IntentLink
                href="/demo/brasa/visite"
                className="border border-[#fbf7ef]/70 px-7 py-3.5 text-[14px] font-semibold text-[#fbf7ef] transition-colors hover:bg-[#fbf7ef]/10"
              >
                Endereço e horários
              </IntentLink>
            </div>
          </Reveal>
        </div>
      </section>

      <BrasaFooter demo={demo} />
    </>
  );
}
