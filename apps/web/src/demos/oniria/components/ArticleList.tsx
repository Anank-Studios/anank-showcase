'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Article } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { cn } from '@/shared/lib/cn';

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00-03:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Listagem editorial: o primeiro artigo em destaque, os outros cinco em duas
 * colunas. Apenas o primeiro tem `body` — os demais declaram abertamente que
 * fazem parte da demonstração, em vez de fingir um texto que não existe.
 *
 * O artigo completo abre em um painel expansível aqui mesmo, para não exigir
 * uma rota `/diario/[slug]` (que está fora do escopo desta demo).
 */
export function ArticleList({ articles }: { articles: Article[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [featured, ...rest] = articles;

  if (!featured) return null;

  return (
    <section className="px-5 pb-28 md:px-10 lg:px-14">
      <div className="mx-auto max-w-[1400px]">
        <ArticleCard
          article={featured}
          featured
          open={openId === featured.id}
          onToggle={() => setOpenId(openId === featured.id ? null : featured.id)}
        />

        <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
          {rest.map((article) => (
            <li key={article.id}>
              <ArticleCard
                article={article}
                open={openId === article.id}
                onToggle={() => setOpenId(openId === article.id ? null : article.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ArticleCard({
  article,
  featured = false,
  open,
  onToggle,
}: {
  article: Article;
  featured?: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const hasBody = Boolean(article.body?.length);
  const panelId = `artigo-${article.id}`;

  return (
    <article>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        data-cursor="LER"
        className="group block w-full text-left"
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
          {formatDate(article.publishedAt)} · {article.readingMin} min de leitura
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
          {open ? 'Fechar' : hasBody ? 'Ler o texto' : 'Sobre este texto'}
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        className={cn(
          'grid transition-[grid-template-rows] duration-500 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          {hasBody ? (
            <div className="max-w-[62ch] space-y-6 pt-8">
              {article.body!.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="leading-[1.75] text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="max-w-[52ch] border-l border-accent pt-8 pl-5 text-sm leading-relaxed text-muted">
              Este texto faz parte da demonstração e não foi escrito por completo. Apenas
              “{`A memória da pele`}” está publicado na íntegra.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
