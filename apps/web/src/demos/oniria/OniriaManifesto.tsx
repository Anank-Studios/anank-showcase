import Image from 'next/image';
import { getDemo } from '@/shared/lib/api';
import { BLUR } from '@/shared/lib/blur';
import { OniriaFooter, OniriaNav } from './components/OniriaNav';
import { SplitText } from './components/SplitText';

/** Página quase sem imagem. Puro tipográfico, revelado parágrafo a parágrafo. */
const PARAGRAPHS = [
  'Existe uma indústria inteira construída sobre a pressa. Ela vende o antes e o depois na mesma semana, e conta com o fato de que ninguém volta para conferir o terceiro mês.',
  'Nós trabalhamos no sentido contrário. O colágeno leva de trinta a sessenta dias para aparecer. Quem promete resultado imediato está vendendo outra coisa — normalmente volume, normalmente demais.',
  'A pele não esquece. Cada exposição solar, cada noite mal dormida, cada ciclo hormonal deixa um registro no tecido. Esse registro não é metafórico: é bioquímico, mensurável, e em grande parte reversível.',
  'O fibroblasto — a célula que produz colágeno — não morre com a idade. Ele fica quieto. O que a estética avançada faz, quando é bem feita, é acordá-lo. O que se aplica não é o resultado. É o pedido.',
  'Por isso medimos antes. Fotografamos em cinco ângulos sob luz controlada, registramos hidratação e perda transepidérmica de água, e escrevemos o plano. Você leva o plano para casa.',
  'Por isso também recusamos. Alguns pedidos não cabem na anatomia de quem os faz, e dizer isso na avaliação é mais barato para todo mundo do que dizer depois.',
  'Não tratamos rugas. Tratamos o tecido que as produz.',
  'A pele tem memória. Nós trabalhamos com ela.',
];

export async function OniriaManifesto() {
  const demo = await getDemo('oniria');

  return (
    <div className="relative">
      <OniriaNav />

      <main>
        <section className="px-5 pt-40 pb-20 md:px-10 md:pt-52 lg:px-14">
          <div className="mx-auto max-w-[1400px]">
            <p className="label-caps text-accent">Manifesto</p>
            <SplitText
              text="A pele tem memória."
              as="h1"
              className="mt-6 max-w-[12ch] font-display text-[clamp(2.5rem,13vw,9rem)] leading-[0.9] tracking-[-0.04em]"
            />
          </div>
        </section>

        <section className="px-5 pb-28 md:px-10 lg:px-14">
          <div className="mx-auto max-w-[62ch] space-y-10">
            {PARAGRAPHS.map((paragraph, index) => (
              <SplitText
                key={paragraph}
                text={paragraph}
                as="p"
                className={
                  index >= PARAGRAPHS.length - 2
                    ? 'font-display text-[clamp(1.5rem,4.5vw,2.75rem)] leading-[1.14]'
                    : 'text-base leading-[1.75] text-muted md:text-lg'
                }
              />
            ))}
          </div>
        </section>

        {/* Única imagem, no fim, em largura total e baixa opacidade. */}
        <div className="relative aspect-[21/9] w-full opacity-45">
          <Image
            src={(demo.images.manifesto ?? demo.thumbnail).url}
            alt={(demo.images.manifesto ?? demo.thumbnail).alt}
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR.oniria}
            className="object-cover"
          />
        </div>
      </main>

      <OniriaFooter legalName={demo.legalName} cnpj={demo.cnpj} address={demo.address} />
    </div>
  );
}
