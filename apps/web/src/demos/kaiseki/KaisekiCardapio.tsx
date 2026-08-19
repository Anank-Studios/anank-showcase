import { getDemo, getMenu } from '@/shared/lib/api';
import { KaisekiFooter } from './layout/KaisekiFooter';
import { ItemCardapio } from '@/demos/_alimentacao/ItemCardapio';
import { Reveal } from './components/Reveal';

export async function KaisekiCardapio() {
  const [demo, menu] = await Promise.all([getDemo('kaiseki'), getMenu('kaiseki')]);

  return (
    <>
      <section className="border-b border-line px-5 pt-16 pb-14 md:px-10 md:pt-24 md:pb-20 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
            Cardápio
          </p>
          <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.25rem,7vw,5rem)] leading-[1.02]">
            Monte o pedido.
          </h1>
          <p className="mt-7 max-w-[52ch] text-[15px] leading-relaxed text-muted">
            Entrega e retirada nos Jardins e arredores. O omakase é o único que não sai da casa — ele
            depende do itamae servindo peça por peça, e isso não cabe numa embalagem.
          </p>
        </div>
      </section>

      {/*
        Âncoras sem JavaScript. `top-[68px]` gruda logo abaixo do cabeçalho, que
        tem exatamente essa altura; o `scroll-mt` das seções compensa os dois
        para o título não ficar atrás da barra ao pular. Rolagem horizontal no
        celular: três categorias em 390px não cabem numa linha.
      */}
      <nav
        aria-label="Categorias do cardápio"
        className="no-scrollbar sticky top-[68px] z-30 overflow-x-auto border-b border-line bg-bg"
      >
        <div className="mx-auto flex max-w-[1400px] gap-7 px-5 py-4 md:px-10 lg:px-14">
          {menu.categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.slug}`}
              className="font-mono-brand shrink-0 text-[11px] tracking-[0.14em] text-muted uppercase transition-colors hover:text-accent"
            >
              {c.name}
            </a>
          ))}
        </div>
      </nav>

      {menu.categories.map((categoria) => {
        const itens = menu.items.filter((i) => i.categoryId === categoria.id);

        return (
          <section
            key={categoria.id}
            id={categoria.slug}
            className="scroll-mt-[132px] border-b border-line px-5 py-16 md:px-10 md:py-24 lg:px-14"
          >
            <div className="mx-auto max-w-[1400px]">
              <Reveal>
                <h2 className="font-display text-[clamp(1.625rem,4.5vw,3rem)] leading-[1.06]">
                  {categoria.name}
                </h2>
                <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted">
                  {categoria.description}
                </p>
              </Reveal>

              <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {itens.map((item, i) => (
                  /* `h-full` no Reveal, e o card tambem: a grade estica as
                     celulas, mas o wrapper de animacao no meio quebrava a
                     cadeia e os cards terminavam em alturas diferentes. */
                  <Reveal key={item.id} delay={Math.min(i, 3) * 0.06} className="h-full">
                    <ItemCardapio item={item} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <KaisekiFooter demo={demo} />
    </>
  );
}
