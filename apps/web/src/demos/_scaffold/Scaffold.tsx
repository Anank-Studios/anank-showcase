import type { DemoSlug } from '@anank/contracts';
import { getDemo } from '@/shared/lib/api';

/**
 * Casca de marca da Fase 1.
 *
 * Existe para o checkpoint de fundação: prova que o roteamento, os tokens de
 * marca e o consumo da API funcionam de ponta a ponta antes de as demos serem
 * construídas. Cada subagente SUBSTITUI esta tela pelo conteúdo real da sua demo
 * na Fase 2 — ver specs/00-arquitetura.md.
 */
export async function Scaffold({ slug, page }: { slug: DemoSlug; page?: string }) {
  const demo = await getDemo(slug);

  return (
    <div data-brand={slug} className="min-h-svh">
      <main className="mx-auto flex min-h-svh max-w-[1400px] flex-col justify-center px-6 py-24 md:px-10 lg:px-14">
        <p className="label-caps text-[color:var(--brand-accent)]">
          {demo.index} · {demo.category}
        </p>

        <h1 className="mt-4 text-display">{demo.brandName}</h1>

        <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted">
          {demo.description}
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-sm md:grid-cols-4">
          <div>
            <dt className="label-caps text-muted">Cidade</dt>
            <dd className="mt-1">{demo.city}</dd>
          </div>
          <div>
            <dt className="label-caps text-muted">Desde</dt>
            <dd className="mt-1">{demo.since}</dd>
          </div>
          <div>
            <dt className="label-caps text-muted">Telefone</dt>
            <dd className="mt-1">{demo.phone}</dd>
          </div>
          <div>
            <dt className="label-caps text-muted">Faixa</dt>
            <dd className="mt-1">{demo.priceRange}</dd>
          </div>
        </dl>

        {page ? (
          <p className="mt-10 text-sm text-muted">
            Rota interna: <span className="text-ink">{page}</span>
          </p>
        ) : null}

        <p className="mt-16 text-[11px] leading-relaxed text-muted">
          {demo.legalName} · CNPJ {demo.cnpj} · {demo.address}
          <br />
          Empresa, endereço, CNPJ e depoimentos são fictícios. Demonstração criada pela Anank
          Studios.
        </p>
      </main>
    </div>
  );
}
