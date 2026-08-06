import { getArticles, getDemo } from '@/shared/lib/api';
import { OniriaFooter, OniriaNav } from './components/OniriaNav';
import { SplitText } from './components/SplitText';
import { ArticleList } from './components/ArticleList';

export async function OniriaDiario() {
  const [demo, articles] = await Promise.all([getDemo('oniria'), getArticles('oniria')]);

  return (
    <div className="relative">
      <OniriaNav />

      <section className="px-5 pt-40 pb-16 md:px-10 md:pt-52 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-caps text-accent">Diário</p>
          <SplitText
            text="O que escrevemos entre um protocolo e outro."
            as="h1"
            className="mt-6 max-w-[18ch] font-display text-[clamp(2.25rem,9vw,6rem)] leading-[0.96]"
          />
        </div>
      </section>

      <ArticleList articles={articles} />

      <OniriaFooter legalName={demo.legalName} cnpj={demo.cnpj} address={demo.address} />
    </div>
  );
}
