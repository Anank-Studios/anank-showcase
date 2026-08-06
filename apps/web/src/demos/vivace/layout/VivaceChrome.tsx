import type { Demo } from '@anank/contracts';
import { VivaceHeader } from './VivaceHeader';
import { VivaceFooter } from './VivaceFooter';

/**
 * Casca reutilizada pelas 4 rotas — não há layout compartilhado sob controle
 * deste subagente, então o header/rodapé viram um componente próprio,
 * importado por cada ponto de entrada (`Vivace<Página>.tsx`).
 */
export function VivaceChrome({ demo, children }: { demo: Demo; children: React.ReactNode }) {
  return (
    <div data-brand="vivace" className="min-h-svh">
      <VivaceHeader />
      <main>{children}</main>
      <VivaceFooter demo={demo} />
    </div>
  );
}
