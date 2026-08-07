import Image from 'next/image';
import type { Demo } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { Reveal } from './Reveal';

export function About({ demo }: { demo: Demo }) {
  // Chave garantida por apps/api/src/data/aurea.ts — a demo sempre a inclui.
  const bruna = demo.images.bruna!;

  return (
    <section
      id="sobre"
      tabIndex={-1}
      className="mx-auto max-w-[1400px] px-6 py-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink md:px-10 lg:px-14 lg:py-28"
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
        <Reveal>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px] overflow-hidden rounded-brand shadow-brand lg:max-w-none">
            <Image
              src={bruna.url}
              alt={bruna.alt}
              fill
              sizes="(min-width: 1024px) 380px, 80vw"
              placeholder="blur"
              blurDataURL={BLUR.aurea}
              className="object-cover saturate-[1.05]"
            />
          </div>
        </Reveal>

        <div>
          <Reveal delay={0.06}>
            <p className="label-caps text-[#9d5d32]">Sobre</p>
            <h2 className="text-display mt-3 text-[2rem] text-ink md:text-[2.5rem]">
              Oi, eu sou a Bruna.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-[#75685e]">
              <p>
                São catorze anos atrás da cadeira. Comecei cortando cabelo na casa da minha mãe, fiz
                formação em colorimetria em São Paulo e passei um bom tempo trabalhando na agenda de
                outras pessoas até decidir que queria fazer do meu jeito — com calma, e sem empurrar
                serviço que o cliente não pediu.
              </p>
              <p>
                Abri o Aurea em 2019 com uma regra que sigo até hoje: um atendimento por vez. Sem
                overbooking, sem três clientes na minha agenda ao mesmo tempo. Prefiro te dar
                atenção de verdade por uma hora do que atenção pela metade por três.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="font-display mt-8 -rotate-3 text-[30px] text-accent italic">
              Bruna Sartori
            </p>
            <span className="mt-2 block h-px w-40 bg-line" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
