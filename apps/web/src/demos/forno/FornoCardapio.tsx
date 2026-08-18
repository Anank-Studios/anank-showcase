import { getDemo, getMenu } from '@/shared/lib/api';
import { FornoFooter } from './layout/FornoFooter';
import { ItemCardapio } from '@/demos/_alimentacao/ItemCardapio';
import { Reveal } from './components/Reveal';

export async function FornoCardapio() {
  const [demo, menu] = await Promise.all([getDemo('forno'), getMenu('forno')]);

  return (
    <>
      <section className="border-b border-line px-5 pt-16 pb-14 md:px-10 md:pt-24 md:pb-20 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
            Cardápio
          </p>
          <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.98]">
            Escolha a sua.
          </h1>
          <p className="mt-7 max-w-[52ch] text-[15px] leading-relaxed text-muted">
            Entrega na Vila Madalena e arredores, ou retirada no balcão. Toda pizza sai do forno a
            lenha na hora do pedido — não existe pizza pronta esperando na estufa.
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

      <FornoFooter demo={demo} />
    </>
  );
}
