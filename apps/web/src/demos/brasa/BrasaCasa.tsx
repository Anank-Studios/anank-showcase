import Image from 'next/image';
import { getDemo, getTeam } from '@/shared/lib/api';
import { BrasaFooter } from './layout/BrasaFooter';
import { Reveal } from './components/Reveal';

/** As três etapas do dia. Texto do dado seria exagero: isto é conteúdo de
 *  página, não catálogo — não muda por marca nem por requisição. */
const ETAPAS = [
  {
    hora: '15h00',
    titulo: 'A moagem',
    texto:
      'Acém e peito chegam inteiros pela manhã e são desossados aqui. A primeira moagem é grossa, a segunda fina. Entre uma e outra, a carne volta para o frio por vinte minutos — se esquentar, a gordura emulsiona e o disco vira patê.',
    imagem: 'corte' as const,
  },
  {
    hora: '16h30',
    titulo: 'Os discos',
    texto:
      'Pesados um a um em 90 ou 180 gramas, sem molde. Ficam empilhados com papel entre eles até a hora do serviço. Nenhum disco passa da noite: o que sobra vira o ragu do molho da casa.',
    imagem: 'grelha' as const,
  },
  {
    hora: '18h00',
    titulo: 'A chapa',
    texto:
      'Ela liga às 17h e leva uma hora para chegar em 250 graus. O disco encosta uma vez, é prensado uma vez, vira uma vez. Quarenta segundos de cada lado, e o queijo entra ainda na chapa, sob a cúpula.',
    imagem: 'tabua' as const,
  },
];

export async function BrasaCasa() {
  const [demo, equipe] = await Promise.all([getDemo('brasa'), getTeam('brasa')]);

  return (
    <>
      <section className="px-5 pt-16 pb-14 md:px-10 md:pt-24 md:pb-20 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
            A casa
          </p>
          <h1 className="mt-4 max-w-[13ch] font-display text-[clamp(2.5rem,9vw,6.5rem)] leading-[0.85] tracking-[-0.045em]">
            Uma coisa só, bem feita.
          </h1>
          <p className="mt-7 max-w-[56ch] text-[clamp(1rem,1.7vw,1.1875rem)] leading-relaxed text-muted">
            A Brasa abriu em {demo.since} numa casa de esquina em Pinheiros, com quatro mesas e uma
            chapa de segunda mão. O cardápio tinha três hambúrgueres. Hoje tem seis, e essa é a
            única coisa que mudou.
          </p>
        </div>
      </section>

      <Reveal>
        <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[21/9]">
          <Image
            src={demo.images.salao!.url}
            alt={demo.images.salao!.alt}
            fill
            priority
            quality={62}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Reveal>

      {/* ---- o dia ------------------------------------------------------ */}
      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
              O dia
            </p>
            <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(1.875rem,5.5vw,3.75rem)] leading-[0.94] tracking-[-0.04em]">
              Três horas de preparo para quarenta segundos de chapa.
            </h2>
          </Reveal>

          <div className="mt-16 space-y-16 md:space-y-24">
            {ETAPAS.map((etapa, i) => {
              const foto = demo.images[etapa.imagem];

              return (
                <Reveal key={etapa.hora}>
                  <article
                    className={[
                      'grid items-center gap-8 md:grid-cols-2 lg:gap-16',
                      /* Alterna o lado da foto. Sem isso, três blocos iguais
                         empilhados leem como lista, não como narrativa. */
                      i % 2 === 1 ? 'md:[&>figure]:order-2' : '',
                    ].join(' ')}
                  >
                    <figure className="relative m-0 aspect-[4/3] overflow-hidden">
                      {foto ? (
                        <Image
                          src={foto.url}
                          alt={foto.alt}
                          fill
                          quality={62}
                          sizes="(max-width: 768px) 92vw, 46vw"
                          className="object-cover"
                        />
                      ) : null}
                    </figure>

                    <div>
                      <p className="font-mono-brand text-[11px] font-bold tracking-[0.16em] text-accent">
                        {etapa.hora}
                      </p>
                      <h3 className="mt-3 font-display text-[clamp(1.5rem,3.5vw,2.5rem)] leading-[0.98] tracking-[-0.035em]">
                        {etapa.titulo}
                      </h3>
                      <p className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-muted">
                        {etapa.texto}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- quem faz --------------------------------------------------- */}
      <section className="border-t border-line bg-[color:var(--brand-surface)]">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
              Quem faz
            </p>
          </Reveal>

          {/*
            Uma pessoa só, e é honesto: era a única foto de gente que passou na
            inspeção sem marca real no avental. Inventar mais dois rostos com
            fotos de banco daria uma equipe que não existe — e a página fica
            melhor assim, com espaço para o texto respirar.
          */}
          {equipe.map((pessoa) => (
            /* O Reveal envolve a GRADE inteira, não cada célula. Um wrapper com
               `display: contents` em volta das duas colunas seria mais
               elegante de ler, mas elemento com `contents` não gera caixa —
               não há o que transformar, e a animação simplesmente não roda. */
            <Reveal
              key={pessoa.id}
              className="mt-12 grid gap-10 md:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={pessoa.photo.url}
                  alt={pessoa.photo.alt}
                  fill
                  quality={62}
                  sizes="(max-width: 768px) 92vw, 22rem"
                  className="object-cover"
                />
              </div>

              <div className="self-center">
                <h3 className="font-display text-[clamp(1.75rem,4.5vw,3rem)] leading-[0.95] tracking-[-0.04em]">
                  {pessoa.name}
                </h3>
                <p className="font-mono-brand mt-3 text-[11px] tracking-[0.14em] text-accent uppercase">
                  {pessoa.role}
                </p>
                <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                  {pessoa.bio}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <BrasaFooter demo={demo} />
    </>
  );
}
