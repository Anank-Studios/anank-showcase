'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Estado efêmero compartilhado pelas rotas /demo/*.
 *
 * Existe para substituir `sessionStorage`, que é PROIBIDO no projeto.
 * Como o provider vive no layout de /demo, o estado sobrevive à navegação
 * entre demos e se perde no reload — que é exatamente o comportamento
 * "uma vez por sessão" que a spec pede.
 */
interface DemoChrome {
  /** O rótulo "Alterne entre as versões" já foi exibido? */
  hintSeen: boolean;
  markHintSeen: () => void;
  /** O preloader da Oniria já rodou nesta sessão? */
  oniriaPreloaderSeen: boolean;
  markOniriaPreloaderSeen: () => void;
}

const DemoChromeContext = createContext<DemoChrome | null>(null);

export function DemoChromeProvider({ children }: { children: React.ReactNode }) {
  const [hintSeen, setHintSeen] = useState(false);
  const [oniriaPreloaderSeen, setOniriaPreloaderSeen] = useState(false);

  const markHintSeen = useCallback(() => setHintSeen(true), []);
  const markOniriaPreloaderSeen = useCallback(() => setOniriaPreloaderSeen(true), []);

  const value = useMemo(
    () => ({ hintSeen, markHintSeen, oniriaPreloaderSeen, markOniriaPreloaderSeen }),
    [hintSeen, markHintSeen, oniriaPreloaderSeen, markOniriaPreloaderSeen]
  );

  return <DemoChromeContext.Provider value={value}>{children}</DemoChromeContext.Provider>;
}

export function useDemoChrome(): DemoChrome {
  const context = useContext(DemoChromeContext);
  if (!context) {
    throw new Error('useDemoChrome precisa estar dentro de <DemoChromeProvider>.');
  }
  return context;
}
