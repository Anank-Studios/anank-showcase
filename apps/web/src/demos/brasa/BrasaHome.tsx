import Image from 'next/image';
import { getDemo, getMenu, getTestimonials } from '@/shared/lib/api';
import { IntentLink } from '@/shared/components/IntentLink';
import { BrasaFooter } from './layout/BrasaFooter';
import { HeroFoto } from './components/HeroFoto';
import { Reveal } from './components/Reveal';
import { Cascata, CascataItem } from '@/demos/_alimentacao/motion/Cascata';
import { GaleriaHorizontal } from '@/demos/_alimentacao/motion/GaleriaHorizontal';

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
      {/*
        Sem caixas. Quatro retângulos iguais lado a lado é a assinatura mais
        reconhecivel de template — o olho le "grade", nao "numeros da casa".
        Aqui sao linhas de 1px e larguras DESIGUAIS (1.3fr / 1fr / 1fr / 1.4fr),
        com o numero grande e o rotulo pendurado nele.

        No celular volta a empilhar em duas colunas: assimetria abaixo de 768px
        so produz texto espremido.
      */}
      <section aria-label="Números da casa" className="border-y border-line">
        <Cascata className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
          {(demo.stats ?? []).map((s, i) => (
            <CascataItem
              key={s.label}
              className={[
                'border-line px-5 py-10 [&:not(:nth-child(2n))]:border-r md:border-r md:px-7 md:py-14 md:last:border-r-0',
                /* Degrau vertical alternado no desktop: quebra a leitura de
                   fileira sem custar legibilidade. */
                i % 2 === 1 ? 'md:pt-24' : '',
              ].join(' ')}
            >
              <p className="font-display text-[2.5rem] leading-[0.85] tracking-[-0.045em] md:text-[3.5rem]">
                {s.value}
              </p>
              <p className="mt-4 max-w-[18ch] text-[13px] leading-snug text-muted">{s.label}</p>
            </CascataItem>
          ))}
        </Cascata>
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

          {/*
            FAIXA HORIZONTAL no lugar da grade de 3 colunas. A fileira de cards
            identicos e o que fazia esta pagina parecer template; a faixa da um
            ritmo diferente do resto da pagina e cabe naturalmente no celular,
            onde rolar de lado ja e gesto nativo.

            Cada cartao tem largura em `vw` para que o SEGUINTE apareca pela
            metade — sem essa sobra, nada indica que ha mais conteudo a direita
            e metade do cardapio fica invisivel no celular.
          */}
          <GaleriaHorizontal rotulo="Os seis hamburgueres da chapa" className="mt-14">
            {daChapa.map((item, i) => (
              <article
                key={item.id}
                className="group w-[78vw] shrink-0 snap-start sm:w-[52vw] lg:w-[30vw] xl:w-[26rem]"
              >
                <div
                  className={[
                    'relative overflow-hidden bg-[color:var(--brand-line)]',
                    /* Proporcoes ALTERNADAS entre vizinhos. Com todas iguais o
                       olho volta a ler grade, mesmo na horizontal. */
                    i % 2 === 0 ? 'aspect-[4/5]' : 'aspect-square',
                  ].join(' ')}
                >
                  <Image
                    src={item.image.url}
                    alt={item.image.alt}
                    fill
                    quality={62}
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 52vw, 26rem"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />

                  {item.badges?.[0] ? (
                    <span className="font-mono-brand absolute top-4 left-4 bg-accent px-2.5 py-1 text-[9px] font-bold tracking-[0.12em] text-[color:var(--brand-surface)] uppercase">
                      {item.badges[0]}
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 flex items-baseline gap-4">
                  <span className="font-mono-brand shrink-0 text-[11px] text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="flex-1 font-display text-[1.375rem] leading-none tracking-[-0.03em]">
                    {item.name}
                  </h3>
                  <span className="font-mono-brand shrink-0 text-[13px] font-semibold text-accent">
                    R$ {item.price}
                  </span>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">{item.description}</p>
              </article>
            ))}

            {/*
              Espacador do fim. Sem ele o ultimo cartao encosta na borda direita
              e o texto dele fica colado no limite da tela — o classico "dado
              cortado" de carrossel.
            */}
            <div aria-hidden="true" className="w-px shrink-0 sm:w-8" />
          </GaleriaHorizontal>
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
              dia. Sem embalagem a vácuo, sem véspera, sem sobra. O que não sai na noite vira o
              molho do dia seguinte.
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
            ASSIMETRICO, nao tres colunas iguais. O primeiro depoimento e o
            grande — ocupa a coluna larga e ganha corpo de citacao; os outros
            dois ficam empilhados ao lado, menores. Tres caixas do mesmo
            tamanho nao dizem qual vale mais, e por isso nenhuma vale.

            Sem retrato: depoimento ficticio com foto de rosto de banco e a
            combinacao mais facil de confundir com pessoa real.
          */}
          <Cascata className="mt-12 grid gap-px bg-line md:grid-cols-[1.7fr_1fr]">
            {depoimentos.slice(0, 1).map((d) => (
              <CascataItem key={d.id} className="bg-[color:var(--brand-bg)]">
                <figure className="flex h-full flex-col justify-between p-8 md:p-12">
                  <blockquote className="max-w-[26ch] font-display text-[clamp(1.375rem,3.2vw,2.125rem)] leading-[1.14] tracking-[-0.02em]">
                    &ldquo;{d.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-10 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="font-mono-brand flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-[12px] font-bold text-[color:var(--brand-surface)]"
                    >
                      {iniciais(d.name)}
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold">{d.name}</span>
                      <span className="block text-[12px] text-muted">{d.service}</span>
                    </span>
                  </figcaption>
                </figure>
              </CascataItem>
            ))}

            <div className="grid gap-px bg-line">
              {depoimentos.slice(1, 3).map((d) => (
                <CascataItem key={d.id} className="bg-[color:var(--brand-bg)]">
                  <figure className="flex h-full flex-col justify-between p-7 md:p-8">
                    <blockquote className="text-[15px] leading-relaxed text-muted">
                      &ldquo;{d.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6">
                      <span className="block text-[14px] font-semibold">{d.name}</span>
                      <span className="block text-[12px] text-muted">{d.service}</span>
                    </figcaption>
                  </figure>
                </CascataItem>
              ))}
            </div>
          </Cascata>
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

/* ------------------------------------------------------------------ */

/** Iniciais para o disco do depoimento — no lugar de retrato inventado. */
function iniciais(nome: string): string {
  return nome
    .split(' ')
    .map((parte) => parte[0])
    .slice(0, 2)
    .join('');
}
