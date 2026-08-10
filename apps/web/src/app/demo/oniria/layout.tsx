import { OniriaShell } from '@/demos/oniria/OniriaShell';
import { oniriaFonts } from '@/app/fonts';

/**
 * Só a Oniria carrega Bodoni Moda e Geist. A didone é cara — vem com itálico,
 * que a citação da home usa — e não tinha por que descer para a Aurea e a
 * Vivace, como acontecia quando as fontes viviam no layout raiz.
 */
export default function OniriaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={oniriaFonts}>
      <OniriaShell>{children}</OniriaShell>
    </div>
  );
}
