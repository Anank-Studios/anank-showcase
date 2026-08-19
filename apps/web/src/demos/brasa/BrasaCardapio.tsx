import Image from 'next/image';
import { getDemo, getMenu } from '@/shared/lib/api';
import { BrasaFooter } from './layout/BrasaFooter';
import { Reveal } from './components/Reveal';

export async function BrasaCardapio() {
  const [demo, menu] = await Promise.all([getDemo('brasa'), getMenu('brasa')]);

  return (
    <>
      <section className="border-b border-line px-5 pt-16 pb-14 md:px-10 md:pt-24 md:pb-20 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
            Cardápio
          </p>
          <h1 className="mt-4 max-w-[14ch] font-display text-[clamp(2.5rem,9vw,6.5rem)] leading-[0.85] tracking-[-0.045em]">
            Tudo o que a chapa faz.
          </h1>
          <p className="mt-7 max-w-[52ch] text-[15px] leading-relaxed text-muted">
            Os preços são de balcão e de mesa — não cobramos a mais por sentar. O cardápio muda no
            máximo uma vez por ano, e quando muda a gente avisa.
          </p>
        </div>
      </section>

      {/*
        Navegação por âncora, sem JavaScript. `top-[68px]` gruda logo abaixo do
        cabeçalho, que tem exatamente essa altura; `scroll-mt` nas seções
        compensa os dois para o título não ficar escondido atrás da barra ao
        pular. Rolagem horizontal no celular em vez de quebra de linha: quatro
        categorias em 390px não cabem numa linha só.
      */}
      <nav
        aria-label="Categorias do cardápio"
        className="no-scrollbar sticky top-[var(--nav-h)] z-30 overflow-x-auto border-b border-line bg-bg transition-[top] duration-300 ease-out motion-reduce:transition-none"
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
                <h2 className="font-display text-[clamp(1.75rem,5vw,3.25rem)] leading-[0.95] tracking-[-0.04em]">
                  {categoria.name}
                </h2>
                <p className="mt-4 max-w-[50ch] text-[15px] leading-relaxed text-muted">
                  {categoria.description}
                </p>
              </Reveal>

              <ul className="mt-12 divide-y divide-[color:var(--brand-line)] border-y border-line">
                {itens.map((item, i) => (
                  <li key={item.id}>
                    <Reveal delay={Math.min(i, 4) * 0.05}>
                      <article className="group flex items-start gap-5 py-6 md:gap-8 md:py-8">
                        <div className="relative size-[84px] shrink-0 overflow-hidden bg-[color:var(--brand-line)] md:size-[132px]">
                          <Image
                            src={item.image.url}
                            alt={item.image.alt}
                            fill
                            quality={62}
                            sizes="(max-width: 768px) 84px, 132px"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
                            <h3 className="font-display text-[1.25rem] leading-none tracking-[-0.03em] md:text-[1.625rem]">
                              {item.name}
                            </h3>
                            <span className="font-mono-brand shrink-0 text-[14px] font-semibold text-accent">
                              R$ {item.price}
                            </span>
                          </div>

                          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-muted md:text-[15px]">
                            {item.description}
                          </p>

                          {item.ingredients?.length ? (
                            <p className="font-mono-brand mt-3.5 text-[10px] tracking-[0.1em] text-muted uppercase">
                              {item.ingredients.join(' · ')}
                            </p>
                          ) : null}

                          {item.badges?.length ? (
                            <ul className="mt-3.5 flex flex-wrap gap-2">
                              {item.badges.map((b) => (
                                <li
                                  key={b}
                                  /* Borda em `muted` (5.4:1). Em `--brand-line`
                                     o selo ficaria em 1.3:1 e sumiria — e o
                                     Lighthouse não reprova contraste de
                                     não-texto, então isso passa batido. */
                                  className="font-mono-brand border border-[color:var(--brand-muted)] px-2 py-[3px] text-[9px] tracking-[0.12em] uppercase"
                                >
                                  {b}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </article>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      {/* ---- como pedir -------------------------------------------------- */}
      <section className="px-5 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <div className="border-l-[3px] border-accent bg-[color:var(--brand-surface)] p-7 md:p-10">
              <h2 className="max-w-[22ch] font-display text-[clamp(1.375rem,3.5vw,2.25rem)] leading-[1.02] tracking-[-0.03em]">
                Este cardápio é para consultar, não para pedir.
              </h2>
              <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-muted">
                A Brasa não recebe pedido pela internet. Para reservar mesa ou encomendar para
                retirada, fale com a casa pelo WhatsApp ou pelo telefone {demo.phone}.
              </p>
              <a
                href="https://wa.me/5511900000000"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-block bg-accent px-7 py-3.5 text-[14px] font-semibold text-[color:var(--brand-surface)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Chamar no WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <BrasaFooter demo={demo} />
    </>
  );
}
