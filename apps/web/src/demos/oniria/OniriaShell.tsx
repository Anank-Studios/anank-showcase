'use client';

import { useEffect, useState } from 'react';
import { useDemoChrome } from '@/shared/components/DemoChromeProvider';
import { CustomCursor } from './components/CustomCursor';
import { FilmGrain } from './components/FilmGrain';
import { Preloader } from './components/Preloader';
import { OniriaTransitionProvider } from './components/transition/TransitionProvider';
import { ensureGsap, ScrollTrigger } from './lib/gsapClient';
import { useOniriaLenis } from './lib/useLenis';

/**
 * PONTO DE ENTRADA do layout da Oniria — envolve TODAS as rotas /demo/oniria/**.
 * É aqui que moram o preloader, o cursor customizado, o grão de filme, o Lenis
 * e o overlay de transição do GSAP. O nome e a assinatura NÃO podem mudar.
 */
export function OniriaShell({ children }: { children: React.ReactNode }) {
  const { oniriaPreloaderSeen, markOniriaPreloaderSeen } = useDemoChrome();
  const [showPreloader, setShowPreloader] = useState(!oniriaPreloaderSeen);

  useOniriaLenis();

  useEffect(() => {
    ensureGsap();
    document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);
  }, []);

  return (
    <div data-brand="oniria" className="relative min-h-screen bg-bg text-ink">
      <OniriaTransitionProvider>{children}</OniriaTransitionProvider>

      <FilmGrain />
      <CustomCursor />

      {showPreloader && (
        <Preloader
          onDone={() => {
            markOniriaPreloaderSeen();
            setShowPreloader(false);
          }}
        />
      )}
    </div>
  );
}
