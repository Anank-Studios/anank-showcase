import { DemoChromeProvider } from '@/shared/components/DemoChromeProvider';
import { DemoToggle } from '@/shared/components/DemoToggle';

/**
 * Vale para todas as rotas /demo/** aninhadas: os dados vêm do backend em
 * tempo de requisição, então o `next build` não precisa da API no ar.
 */
export const dynamic = 'force-dynamic';

/**
 * Layout comum às 3 demos. Injeta o toggle flutuante e o provider de estado
 * efêmero que substitui `sessionStorage` (proibido no projeto).
 */
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoChromeProvider>
      {children}
      <DemoToggle />
    </DemoChromeProvider>
  );
}
