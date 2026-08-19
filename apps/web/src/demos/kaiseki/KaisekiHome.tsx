import Image from 'next/image';
import { getDemo, getMenu, getTestimonials } from '@/shared/lib/api';
import { IntentLink } from '@/shared/components/IntentLink';
import { KaisekiFooter } from './layout/KaisekiFooter';
import { HeroFoto } from './components/HeroFoto';
import { Reveal } from './components/Reveal';
import { Cascata, CascataItem } from '@/demos/_alimentacao/motion/Cascata';
import { Magnetico } from '@/demos/_alimentacao/motion/Magnetico';

export async function KaisekiHome() {
  const [demo, menu, depoimentos] = await Promise.all([
    getDemo('kaiseki'),
    getMenu('kaiseki'),
    getTestimonials('kaiseki'),
  ]);

  const destaques = menu.items.filter((i) => i.categoryId === 'balcao').slice(0, 3);

  return (
    <>
      {/* ---- herói ------------------------------------------------------ */}
      <section className="relative flex min-h-[calc(100svh-68px)] items-end overflow-hidden">
        <HeroFoto src={demo.images.hero!.url} alt={demo.images.hero!.alt} />

        {/* Garante contraste do texto sobre QUALQUER parte da foto, não só
            sobre a que está ali hoje. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[rgb(6_8_11_/_0.94)] via-[rgb(6_8_11_/_0.5)] to-[rgb(6_8_11_/_0.2)]"
        />

        <div className="relative w-full px-5 pb-14 md:px-10 md:pb-20 lg:px-14">
          <div className="mx-auto max-w-[1400px]">
            <p className="font-mono-brand text-[10px] tracking-[0.22em] text-[#cfe0f2] uppercase">
              Jardins · desde {demo.since}
            </p>
            {/* Tinta clara fixa, não `--brand-ink`: o fundo aqui é a foto. */}
            <h1 className="mt-5 font-display text-[clamp(3rem,13vw,9rem)] leading-[0.98] tracking-[0.005em] text-[#f6f4f0]">
              Kaiseki
            </h1>
            <p className="mt-6 max-w-[36ch] text-[clamp(1rem,2.1vw,1.3rem)] leading-relaxed text-[#d5dbe4]">
              {demo.tagline}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetico className="inline-block">
                <IntentLink
                  href="/demo/kaiseki/cardapio"
                  className="bg-[color:var(--brand-accent)] px-7 py-3.5 text-[14px] font-medium text-[#0d0f14] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Pedir pelo site
                </IntentLink>
              </Magnetico>
              <IntentLink
                href="/demo/kaiseki/visite"
                className="border border-[#f6f4f0]/60 px-7 py-3.5 text-[14px] font-medium text-[#f6f4f0] transition-colors hover:bg-[#f6f4f0]/10"
              >
                Reservar o balcão
              </IntentLink>
            </div>
          </div>
        </div>
      </section>

      {/* ---- manifesto -------------------------------------------------- */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="max-w-[20ch] font-display text-[clamp(1.75rem,5.5vw,4rem)] leading-[1.08]">
              O cardápio do balcão não está impresso{' '}
              <span className="text-accent">em lugar nenhum.</span>
            </p>
          </Reveal>

          <Reveal delay={0.1}>
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
              delay={i * 0.07}
              className="border-line px-5 py-9 [&:not(:nth-child(2n))]:border-r md:border-r md:px-6 md:last:border-r-0"
            >
              <p className="font-display text-[2.25rem] leading-none md:text-[3rem]">{s.value}</p>
              <p className="mt-3.5 max-w-[20ch] text-[13px] leading-snug text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- do balcão --------------------------------------------------- */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
              Do balcão
            </p>
            <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.06]">
              Três coisas que sempre têm.
            </h2>
          </Reveal>

          {/*
            Um GRANDE e dois menores empilhados, nao tres iguais lado a lado.
            Com pesos diferentes a secao diz qual e o carro-chefe; com tres
            cartoes identicos ela nao diz nada, e e o que fazia esta pagina
            parecer catalogo.

            Em `< 768px` volta a coluna unica — assimetria em 390px so espreme.
          */}
          <Cascata className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-[1.45fr_1fr] md:gap-10">
            {destaques.slice(0, 1).map((item) => (
              <CascataItem key={item.id}>
                <article className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--brand-surface)]">
                    <Image
                      src={item.image.url}
                      alt={item.image.alt}
                      fill
                      quality={62}
                      sizes="(max-width: 768px) 92vw, 52vw"
                      className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                    />
                    {item.badges?.[0] ? (
                      <span className="font-mono-brand absolute top-4 left-4 bg-[color:var(--brand-accent-2)] px-2.5 py-1 text-[9px] font-bold tracking-[0.12em] text-[#f6f4f0] uppercase">
                        {item.badges[0]}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-[clamp(1.5rem,3vw,2.125rem)] leading-tight">
                      {item.name}
                    </h3>
                    <span className="font-mono-brand shrink-0 text-[14px] text-accent">
                      R$ {item.price}
                    </span>
                  </div>
                  <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                    {item.description}
                  </p>
                </article>
              </CascataItem>
            ))}

            {/* Os dois menores, empilhados e com foto em proporcao diferente da
                do grande — mesma razao de sempre: proporcao repetida vira grade. */}
            <div className="flex flex-col gap-8 md:pt-16">
              {destaques.slice(1, 3).map((item) => (
                <CascataItem key={item.id}>
                  <article className="group">
                    <div className="relative aspect-[3/2] overflow-hidden bg-[color:var(--brand-surface)]">
                      <Image
                        src={item.image.url}
                        alt={item.image.alt}
                        fill
                        quality={62}
                        sizes="(max-width: 768px) 92vw, 36vw"
                        className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                      />
                      {item.badges?.[0] ? (
                        <span className="font-mono-brand absolute top-3 left-3 bg-[color:var(--brand-accent-2)] px-2.5 py-1 text-[9px] font-bold tracking-[0.12em] text-[#f6f4f0] uppercase">
                          {item.badges[0]}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-[1.25rem] leading-tight">{item.name}</h3>
                      <span className="font-mono-brand shrink-0 text-[13px] text-accent">
                        R$ {item.price}
                      </span>
                    </div>
                    <p className="mt-2.5 max-w-[42ch] text-[14px] leading-relaxed text-muted">
                      {item.description}
                    </p>
                  </article>
                </CascataItem>
              ))}
            </div>
          </Cascata>

          <Reveal delay={0.1}>
            <IntentLink
              href="/demo/kaiseki/cardapio"
              className="mt-12 inline-flex items-center gap-2 border-b border-accent pb-1 text-[14px] font-medium"
            >
              Ver o cardápio inteiro
              <span aria-hidden="true">→</span>
            </IntentLink>
          </Reveal>
        </div>
      </section>

      {/* ---- o balcão ---------------------------------------------------- */}
      <section className="border-t border-line bg-[color:var(--brand-surface)]">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-10 md:py-28 lg:gap-20 lg:px-14">
          {/* `tabua`, nao `balcao`: a foto do balcao ja e a do card do omakase,
              logo acima, e as duas juntas na mesma tela liam como erro de
              montagem — o olho ve a mesma bandeja duas vezes em meio segundo. */}
          <Reveal className="md:order-2">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={demo.images.tabua!.url}
                alt={demo.images.tabua!.alt}
                fill
                quality={62}
                sizes="(max-width: 768px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
              Dez lugares
            </p>
            <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(1.625rem,4.5vw,3rem)] leading-[1.06]">
              Sentar no balcão é entregar a escolha.
            </h2>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-muted">
              Quem senta ali não pede: o itamae serve peça por peça, olhando o que comprou de manhã
              e o ritmo de quem está comendo. Dura cerca de uma hora e quarenta.
            </p>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">
              São dez lugares por serviço, dois serviços por noite. A reserva abre na segunda para a
              semana seguinte e costuma fechar no mesmo dia.
            </p>

            <IntentLink
              href="/demo/kaiseki/visite"
              className="mt-8 inline-flex items-center gap-2 border-b border-accent pb-1 text-[14px] font-medium"
            >
              Como reservar
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
            ASSIMETRICO: um grande, dois menores ao lado. Tres caixas do mesmo
            tamanho nao dizem qual vale mais, e por isso nenhuma vale.

            Sem retrato: depoimento ficticio com foto de rosto de banco e a
            combinacao mais facil de confundir com pessoa real.
          */}
          <Cascata className="mt-12 grid gap-px bg-line md:grid-cols-[1.7fr_1fr]">
            {depoimentos.slice(0, 1).map((d) => (
              <CascataItem key={d.id} className="bg-[color:var(--brand-bg)]">
                <figure className="flex h-full flex-col justify-between p-8 md:p-12">
                  <blockquote className="max-w-[28ch] font-display text-[clamp(1.25rem,2.9vw,1.875rem)] leading-[1.28]">
                    &ldquo;{d.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-10">
                    <span className="block text-[15px]">{d.name}</span>
                    <span className="block text-[12px] text-muted">{d.service}</span>
                  </figcaption>
                </figure>
              </CascataItem>
            ))}

            <div className="grid gap-px bg-line">
              {depoimentos.slice(1, 3).map((d) => (
                <CascataItem key={d.id} className="bg-[color:var(--brand-bg)]">
                  <figure className="flex h-full flex-col justify-between p-7 md:p-8">
                    <blockquote className="text-[14px] leading-relaxed text-muted">
                      &ldquo;{d.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6">
                      <span className="block text-[14px]">{d.name}</span>
                      <span className="block text-[12px] text-muted">{d.service}</span>
                    </figcaption>
                  </figure>
                </CascataItem>
              ))}
            </div>
          </Cascata>
        </div>
      </section>

      {/* ---- o degrau: esta casa VENDE pelo site -------------------------- */}
      {/*
        É o argumento comercial do nível 02 e por isso ganha uma seção inteira.
        A Brasa, o nível abaixo, tem uma seção simétrica dizendo o contrário —
        quem está comparando os três degraus precisa ver onde termina um e
        começa o outro sem ter que abrir as duas em abas separadas.
      */}
      <section className="relative overflow-hidden border-t border-line">
        <div className="absolute inset-0">
          <Image
            src={demo.images.noite!.url}
            alt=""
            aria-hidden="true"
            fill
            quality={62}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[rgb(6_8_11_/_0.86)]" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <p className="max-w-[18ch] font-display text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.06] text-[#f6f4f0]">
              O que sai da cozinha, você pede daqui mesmo.
            </p>
            <p className="mt-6 max-w-[50ch] text-[15px] leading-relaxed text-[#c3ccd8]">
              Ramen, karaage e donburi saem para entrega e retirada. O balcão, não — omakase que
              viaja de moto deixa de ser omakase. Monte a sacola, escolha entrega ou retirada e
              acompanhe o tempo estimado.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Magnetico className="inline-block">
                <IntentLink
                  href="/demo/kaiseki/cardapio"
                  className="bg-[color:var(--brand-accent)] px-7 py-3.5 text-[14px] font-medium text-[#0d0f14] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Montar meu pedido
                </IntentLink>
              </Magnetico>
              <IntentLink
                href="/demo/kaiseki/visite"
                className="border border-[#f6f4f0]/60 px-7 py-3.5 text-[14px] font-medium text-[#f6f4f0] transition-colors hover:bg-[#f6f4f0]/10"
              >
                Endereço e horários
              </IntentLink>
            </div>
          </Reveal>
        </div>
      </section>

      <KaisekiFooter demo={demo} />
    </>
  );
}
