import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getDemo, getMenu } from '@/shared/lib/api';
import { IntentLink } from '@/shared/components/IntentLink';
import { FornoFooter } from './layout/FornoFooter';
import { Cascata, CascataItem } from '@/demos/_alimentacao/motion/Cascata';
import { Magnetico } from '@/demos/_alimentacao/motion/Magnetico';

/**
 * O bloco de scroll-telling carrega o GSAP. Adiado com `dynamic` para que quem
 * abre a página e não rola até lá não pague por ele — foi o que você pediu, e
 * é onde a economia realmente existe: o split por ROTA o Next já faz sozinho.
 *
 * `ssr: true` (o padrão) de propósito: o conteúdo das etapas continua no HTML,
 * então buscador e leitor de tela o encontram. O que é adiado é o JS da
 * animação, não o texto.
 */
const MontagemPizza = dynamic(() =>
  import('./components/MontagemPizza').then((m) => m.MontagemPizza)
);

export async function FornoHome() {
  const [demo, menu] = await Promise.all([getDemo('forno'), getMenu('forno')]);
  const destaques = menu.items.filter((i) => i.categoryId === 'classicas').slice(0, 3);

  return (
    <>
      {/* ---- herói ---------------------------------------------------- */}
      {/* `100svh - 68` e nao `100svh`: com o cabecalho fixo, a altura cheia
          empurrava 68px do heroi para fora da primeira tela. */}
      <section className="relative flex min-h-[calc(100svh-68px)] items-end overflow-hidden">
        <Image
          src={demo.images.hero!.url}
          alt={demo.images.hero!.alt}
          fill
          priority
          quality={62}
          sizes="100vw"
          className="object-cover"
        />
        {/* O degradê existe para o texto ter contraste garantido sobre a foto,
            independentemente de qual parte dela fica atrás das letras. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(18_12_8_/_0.94)] via-[rgb(18_12_8_/_0.55)] to-[rgb(18_12_8_/_0.35)]" />

        <div className="relative w-full px-5 pb-16 md:px-10 md:pb-24 lg:px-14">
          <div className="mx-auto max-w-[1400px]">
            <p className="label-caps text-[color:var(--brand-accent-2)]">
              Vila Madalena · desde {demo.since}
            </p>
            <h1 className="mt-5 max-w-[13ch] font-display text-[clamp(2.75rem,11vw,8rem)] leading-[0.92]">
              {demo.brandName}
            </h1>
            <p className="mt-6 max-w-[44ch] text-[clamp(1rem,2.2vw,1.25rem)] leading-relaxed text-[#e6d8c8]">
              {demo.tagline}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetico className="inline-block">
                <IntentLink
                  href="/demo/forno/cardapio"
                  className="rounded-brand bg-[color:var(--brand-accent)] px-7 py-3.5 text-[14px] font-medium text-[#160d07] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Pedir pelo site
                </IntentLink>
              </Magnetico>
              <IntentLink
                href="/demo/forno/a-casa"
                className="rounded-brand border border-[#f6ece0]/60 px-7 py-3.5 text-[14px] font-medium text-[#f6ece0] transition-colors hover:bg-[#f6ece0]/10"
              >
                Conhecer a casa
              </IntentLink>
            </div>
          </div>
        </div>
      </section>

      {/* ---- números -------------------------------------------------- */}
      <section aria-label="Números do Forno" className="border-y border-line">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
          {(demo.stats ?? []).map((s) => (
            <div
              key={s.label}
              className="border-line px-6 py-9 [&:not(:nth-child(2n))]:border-r md:border-r md:px-5 md:last:border-r-0"
            >
              <p className="font-display text-[2rem] leading-none tracking-tight md:text-[2.75rem]">
                {s.value}
              </p>
              <p className="mt-3 max-w-[18ch] text-[13px] leading-snug text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- a montagem, com scroll-telling --------------------------- */}
      {/*
        As etapas aqui são só TEXTO. A imagem vem de uma sequência de 96 quadros
        de um único plano contínuo, em `public/forno/montagem/` — por isso o
        componente não recebe foto por etapa: a coerência vem da fonte ser um
        vídeo só, não de casar imagens avulsas.
      */}
      <MontagemPizza
        etapas={[
          { titulo: 'A massa', texto: '48 horas de fermentação lenta, farinha tipo 00.' },
          { titulo: 'O molho', texto: 'San Marzano triturado à mão, sal e nada mais.' },
          { titulo: 'O queijo', texto: 'Fior di latte rasgado com a mão, nunca ralado.' },
          { titulo: 'O manjericão', texto: 'Folha por folha, depois do queijo e antes do forno.' },
          { titulo: 'O azeite', texto: 'Um fio só, no fim. Extra virgem, cru.' },
        ]}
      />

      {/* ---- destaques do cardápio ------------------------------------ */}
      <section className="border-t border-line px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-caps text-[color:var(--brand-accent)]">As clássicas</p>
          <h2 className="mt-5 max-w-[18ch] font-display text-[clamp(1.875rem,5vw,3.5rem)] leading-[1.04]">
            Quatro pizzas que não mudam desde 2017.
          </h2>

          {/*
            Uma grande e duas menores, nao tres iguais. Com pesos diferentes a
            secao diz qual e a carro-chefe da casa; com tres cartoes identicos
            ela nao diz nada — e era o que restava de catalogo nesta pagina.

            Coluna unica abaixo de `md`: assimetria em 390px so espreme.
          */}
          <Cascata className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-[1.5fr_1fr] md:gap-10">
            {destaques.slice(0, 1).map((item) => (
              <CascataItem key={item.id}>
                <article className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-brand">
                    <Image
                      src={item.image.url}
                      alt={item.image.alt}
                      fill
                      quality={62}
                      sizes="(max-width: 768px) 92vw, 54vw"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-tight">
                      {item.name}
                    </h3>
                    <span className="font-mono-brand shrink-0 text-[14px] text-[color:var(--brand-accent-2)]">
                      R$ {item.price}
                    </span>
                  </div>
                  <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                    {item.description}
                  </p>
                </article>
              </CascataItem>
            ))}

            <div className="flex flex-col gap-8 md:pt-20">
              {destaques.slice(1, 3).map((item) => (
                <CascataItem key={item.id}>
                  <article className="group">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-brand">
                      <Image
                        src={item.image.url}
                        alt={item.image.alt}
                        fill
                        quality={62}
                        sizes="(max-width: 768px) 92vw, 34vw"
                        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-[1.375rem] leading-tight">{item.name}</h3>
                      <span className="font-mono-brand shrink-0 text-[13px] text-[color:var(--brand-accent-2)]">
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
        </div>
      </section>

      <FornoFooter demo={demo} />
    </>
  );
}
