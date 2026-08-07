import Image from 'next/image';
import type { Article } from '@anank/contracts';
import { OniriaLink } from './transition/OniriaLink';
import { BLUR } from '@/shared/lib/blur';
import { cn } from '@/shared/lib/cn';

function formatarData(iso: string): string {
  return new Date(`${iso}T12:00:00-03:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Listagem editorial: o primeiro artigo em destaque, os outros cinco em duas
 * colunas.
 *
 * Cada card leva para `/diario/[slug]` através do `OniriaLink`, que dispara a
 * transição cinematográfica — coerente com o resto da demo. (Antes o texto
 * abria num painel expansível aqui mesmo, porque a rota ainda não existia.)
 */
export function ArticleList({ articles }: { articles: Article[] }) {
  const [featured, ...rest] = articles;
  if (!featured) return null;

  return (
    <section className="px-5 pb-28 md:px-10 lg:px-14">
      <div className="mx-auto max-w-[1400px]">
        <ArticleCard article={featured} featured />

        <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
          {rest.map((article) => (
            <li key={article.id}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article>
      <OniriaLink
        href={`/demo/oniria/diario/${article.slug}`}
        cursorLabel="LER"
        className="group block"
      >
        <div
          className={cn(
            'relative w-full overflow-hidden',
            featured ? 'aspect-[16/9] md:aspect-[21/9]' : 'aspect-[4/3]'
          )}
        >
          <Image
            src={article.image.url}
            alt={article.image.alt}
            fill
            sizes={featured ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
            placeholder="blur"
            blurDataURL={BLUR.oniria}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <p className="label-caps mt-5 text-muted">
          {formatarData(article.publishedAt)} · {article.readingMin} min de leitura
        </p>

        <h2
          className={cn(
            'mt-3 font-display leading-tight',
            featured ? 'text-[clamp(1.75rem,6vw,3.5rem)]' : 'text-[clamp(1.375rem,3.5vw,2rem)]'
          )}
        >
          {article.title}
        </h2>

        <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-muted md:text-base">
          {article.subtitle}
        </p>

        <span className="label-caps mt-4 inline-block border-b border-accent pb-0.5 text-accent-2">
          Ler
        </span>
      </OniriaLink>
    </article>
  );
}
