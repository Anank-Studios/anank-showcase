import { getDemo, getServices } from '@/shared/lib/api';
import { VivaceChrome } from './layout/VivaceChrome';
import { ServicesFilterGrid } from './components/ServicesFilterGrid';

/**
 * PONTO DE ENTRADA da demo — o orquestrador importa este componente em
 * `app/demo/...`. O nome e a assinatura NÃO podem mudar.
 */
export async function VivaceServicos() {
  const [demo, services] = await Promise.all([getDemo('vivace'), getServices('vivace')]);

  return (
    <VivaceChrome demo={demo}>
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 lg:px-14 lg:py-20">
        <p className="label-caps text-accent">Serviços</p>
        <h1 className="text-display mt-3">Tratamentos com protocolo, não com promessa.</h1>
        <div className="mt-6 border-t border-line pt-6">
          <p className="max-w-[62ch] text-base leading-relaxed text-muted">
            Os doze protocolos abaixo cobrem estética facial, corporal e depilação a laser. Cada
            um começa com avaliação — o número de sessões e o valor final dependem do seu caso, não
            de tabela fechada.
          </p>
        </div>

        <div className="mt-12">
          <ServicesFilterGrid services={services} />
        </div>
      </section>
    </VivaceChrome>
  );
}
