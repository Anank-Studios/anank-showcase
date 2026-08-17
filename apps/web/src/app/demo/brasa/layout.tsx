import type { Metadata } from 'next';
import { brasaFonts } from '@/app/fonts/brasa';
import { BrasaHeader } from '@/demos/brasa/layout/BrasaHeader';

export const metadata: Metadata = {
  title: {
    template: '%s · Brasa',
    default: 'Brasa · Hamburgueria de chapa',
  },
  description:
    'Demonstração fictícia da Anank Studios: site institucional de hamburgueria, com cardápio completo e sem pedidos pelo site.',
};

/**
 * O escopo `data-brand` mora AQUI, não em cada página: o cabeçalho e o rodapé
 * também precisam dos tokens da marca, e eles vivem no layout. Só o Brasa
 * carrega Archivo Black — ver `app/fonts/`.
 */
export default function BrasaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-brand="brasa" className={`${brasaFonts} min-h-svh`}>
      <BrasaHeader />
      {children}
    </div>
  );
}
