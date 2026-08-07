import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticles, getDemo } from '@/shared/lib/api';
import { BLUR } from '@/shared/lib/blur';
import { OniriaFooter, OniriaNav } from './components/OniriaNav';
import { SplitText } from './components/SplitText';
import { OniriaLink } from './components/transition/OniriaLink';

/** Slug do único artigo publicado na íntegra. */
const ARTIGO_COMPLETO = 'a-memoria-da-pele';

function formatarData(iso: string): string {
  return new Date(`${iso}T12:00:00-03:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * PONTO DE ENTRADA do artigo do diário. Recebe o slug já resolvido.
 * O nome e a assinatura NÃO podem mudar.
 */
export async function OniriaArtigo({ slug }: { slug: string }) {
  const [demo, articles] = await Promise.all([getDemo('oniria'), getArticles('oniria')]);

  const index = articles.findIndex((article) => article.slug === slug);
  const article = articles[index];
  if (!article) notFound();

  const next = articles[(index + 1) % articles.length]!;
  const temTexto = Boolean(article.body?.length);

  return (
    <div className="relative">
      <OniriaNav />

      <main>
        {/* Hero editorial --------------------------------------------- */}
        <section className="relative h-[70svh] min-h-[420px] w-full overflow-hidden">
          <Image
            src={article.image.url}
            alt={article.image.alt}
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR.oniria}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgb(10_10_11_/_0.45)] via-[rgb(10_10_11_/_0.30)] to-[rgb(10_10_11_/_0.94)]" />

          <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-10 lg:px-14">
            <div className="mx-auto max-w-[1400px]">
              <p className="label-caps text-accent">
                {formatarData(article.publishedAt)} · {article.readingMin} min de leitura
              </p>
              <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.25rem,9vw,6.5rem)] leading-[0.92] tracking-[-0.03em]">
                {article.title}
              </h1>
            </div>
          </div>
        </section>

        {/* Subtítulo ---------------------------------------------------- */}
        <section className="px-5 pt-16 md:px-10 lg:px-14">
          <div className="mx-auto max-w-[62ch]">
            <SplitText
              text={article.subtitle}
              as="p"
              className="font-display text-[clamp(1.25rem,3.4vw,2rem)] leading-[1.25] text-accent-2"
            />
          </div>
        </section>

        {/* Corpo -------------------------------------------------------- */}
        <section className="px-5 pt-12 pb-24 md:px-10 lg:px-14">
          <div className="mx-auto max-w-[62ch]">
            {temTexto ? (
              <div className="space-y-7">
                {article.body!.map((paragrafo) => (
                  <p key={paragrafo.slice(0, 40)} className="leading-[1.8] text-muted">
                    {paragrafo}
                  </p>
                ))}
              </div>
            ) : (
              /*
                Os outros cinco artigos não têm corpo, e isso é intencional e
                declarado — não é um TODO. Melhor dizer com todas as letras do
                que encher a página com texto de mentira.
              */
              <div className="border-l border-accent pl-6">
                <p className="leading-[1.8] text-muted">
                  Este texto faz parte da demonstração e não foi escrito por completo. Da seleção do
                  diário, apenas um artigo está publicado na íntegra.
                </p>
                <OniriaLink
                  href={`/demo/oniria/diario/${ARTIGO_COMPLETO}`}
                  cursorLabel="LER"
                  className="mt-6 inline-block border-b border-accent pb-1 text-sm text-accent-2"
                >
                  Ler “A memória da pele”
                </OniriaLink>
              </div>
            )}
          </div>
        </section>

        {/* Próximo artigo ----------------------------------------------- */}
        <section className="border-t border-line">
          <OniriaLink
            href={`/demo/oniria/diario/${next.slug}`}
            cursorLabel="LER"
            className="group block px-5 py-14 md:px-10 md:py-20 lg:px-14"
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
                <p className="label-caps text-muted">Próximo texto</p>
                <p className="mt-2 truncate font-display text-[clamp(1.375rem,4.5vw,2.75rem)] leading-tight">
                  {next.title}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="shrink-0 text-2xl text-accent transition-transform duration-300 group-hover:translate-x-2"
              >
                →
              </span>
            </div>
          </OniriaLink>
        </section>
      </main>

      <OniriaFooter legalName={demo.legalName} cnpj={demo.cnpj} address={demo.address} />
    </div>
  );
}
