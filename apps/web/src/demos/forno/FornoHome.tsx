import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getDemo, getMenu } from '@/shared/lib/api';

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
    <div data-brand="forno" className="min-h-svh">
      {/* ---- herói ---------------------------------------------------- */}
      <section className="relative flex min-h-svh items-end overflow-hidden">
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
            <p className="mt-6 max-w-[44ch] text-[clamp(1rem,2.2vw,1.25rem)] leading-relaxed text-muted">
              {demo.tagline}
            </p>
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
        As cinco etapas são FOTOS reais, não desenho. A ordem foi escolhida para
        o dissolve não saltar: começa e termina em enquadramento de cima, com a
        do forno no meio, e fecha na fumaça — que é a única com a câmera baixa,
        e por isso vem por último.
      */}
      <MontagemPizza
        etapas={[
          {
            titulo: 'A massa',
            texto: '48 horas de fermentação lenta, farinha tipo 00.',
            foto: demo.images.tabua!,
          },
          {
            titulo: 'O molho',
            texto: 'San Marzano triturado à mão, sal e nada mais.',
            foto: demo.images.vegetariana!,
          },
          {
            titulo: 'O queijo',
            texto: 'Fior di latte rasgado, nunca ralado.',
            foto: demo.images.tabuaEscura!,
          },
          {
            titulo: '90 segundos',
            texto: 'A 480 graus, até a borda pintar de fogo.',
            foto: demo.images.hero!,
          },
          {
            titulo: 'Na mesa',
            texto: 'Sai do forno e vai direto — pizza napolitana não espera.',
            foto: demo.images.fumaca!,
          },
        ]}
      />

      {/* ---- destaques do cardápio ------------------------------------ */}
      <section className="border-t border-line px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-caps text-[color:var(--brand-accent)]">As clássicas</p>
          <h2 className="mt-5 max-w-[18ch] font-display text-[clamp(1.875rem,5vw,3.5rem)] leading-[1.04]">
            Quatro pizzas que não mudam desde 2017.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-px bg-line md:grid-cols-3">
            {destaques.map((item) => (
              <article key={item.id} className="bg-[color:var(--brand-bg)] p-6 md:p-8">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image.url}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 768px) 90vw, 33vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl leading-tight">{item.name}</h3>
                  <span className="font-mono-brand shrink-0 text-[13px] text-[color:var(--brand-accent-2)]">
                    R$ {item.price}
                  </span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- rodapé --------------------------------------------------- */}
      <footer className="border-t border-line px-5 py-14 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <p className="font-display text-3xl">{demo.brandName}</p>
          <p className="max-w-[54ch] text-[11px] leading-relaxed text-muted">
            {demo.legalName} · CNPJ {demo.cnpj}
            <br />
            {demo.address}
            <br />
            Estabelecimento, endereço, CNPJ, equipe e depoimentos são fictícios. Demonstração criada
            pela Anank Studios.
          </p>
        </div>
      </footer>
    </div>
  );
}
