import { getDemo } from '@/shared/lib/api';
import { pickImages } from './lib/images';
import { VivaceChrome } from './layout/VivaceChrome';
import { Timeline } from './components/Timeline';
import { MissionValues } from './components/MissionValues';
import { Gallery } from './components/Gallery';

const GALLERY_KEYS = [
  'recepcao',
  'espera',
  'mascaraBranca',
  'protocolo',
  'aparelhoMetalico',
  'acompanhamento',
  'massagemOleo',
  'serum',
  'drenagemCostas',
  'pele',
];

/**
 * PONTO DE ENTRADA da demo — o orquestrador importa este componente em
 * `app/demo/...`. O nome e a assinatura NÃO podem mudar.
 */
export async function VivaceSobre() {
  const demo = await getDemo('vivace');
  const gallery = pickImages(demo.images, GALLERY_KEYS);

  return (
    <VivaceChrome demo={demo}>
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 lg:px-14 lg:py-20">
        <p className="label-caps text-accent">Sobre a Vivace</p>
        <h1 className="text-display mt-3">Doze anos de método, três unidades no Sul.</h1>
        <div className="mt-6 max-w-[62ch] border-t border-line pt-6">
          <p className="text-base leading-relaxed text-muted">
            A Vivace nasceu em Curitiba em {demo.since}, de um consultório de dermatologia que
            decidiu escrever, e não só falar, cada protocolo. Hoje são três unidades, oito
            especialistas e um padrão fotográfico que acompanha cada paciente do início ao fim do
            tratamento.
          </p>
        </div>
      </section>

      <section className="border-t border-line py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14">
          <h2 className="text-display text-[28px]">Uma linha do tempo</h2>
          <div className="mt-12">
            <Timeline />
          </div>
        </div>
      </section>

      <section className="border-t border-line py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14">
          <MissionValues />
        </div>
      </section>

      <section className="border-t border-line py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14">
          <h2 className="text-display text-[28px]">A estrutura</h2>
          <p className="mt-3 max-w-[56ch] text-sm text-muted">
            Um retrato das três unidades e do dia a dia de atendimento. Clique em qualquer imagem
            para ampliar.
          </p>
          <div className="mt-10">
            <Gallery images={gallery} />
          </div>
        </div>
      </section>
    </VivaceChrome>
  );
}
