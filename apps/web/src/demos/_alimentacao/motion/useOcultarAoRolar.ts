'use client';

import { useEffect, useState } from 'react';

/** Altura do cabeçalho das demos de alimentação, em px. */
export const ALTURA_NAV = 68;

/**
 * Esconde a barra ao rolar para BAIXO, devolve ao rolar para CIMA.
 *
 * Dois detalhes que separam isto de um `scrollY > 100`:
 *
 * 1. LIMIAR de 8px antes de reagir. Sem ele, o micro-tremor do trackpad e o
 *    bounce do iOS fazem a barra piscar entrando e saindo.
 * 2. Perto do TOPO a barra é sempre visível. Caso contrário, quem sobe rápido
 *    até o início da página fica sem navegação bem onde ela mais é esperada.
 *
 * O componente também publica `--nav-h` no elemento raiz. Isso não é enfeite:
 * a barra de categorias do cardápio gruda logo ABAIXO do cabeçalho, e se ela
 * continuasse presa a 68px enquanto o cabeçalho sobe, abriria uma faixa de
 * página aparecendo por cima dela. Com a variável, as duas se movem juntas.
 */
export function useOcultarAoRolar(): boolean {
  const [oculto, setOculto] = useState(false);

  useEffect(() => {
    let ultimo = window.scrollY;
    let travado = false;

    function aoRolar() {
      /* `requestAnimationFrame` em vez de reagir a cada evento: o navegador
         dispara `scroll` dezenas de vezes por segundo e escrever no DOM em
         todas elas força reflow. */
      if (travado) return;
      travado = true;

      window.requestAnimationFrame(() => {
        const atual = window.scrollY;
        const delta = atual - ultimo;

        if (Math.abs(delta) > 8) {
          setOculto(delta > 0 && atual > ALTURA_NAV * 2);
          ultimo = atual;
        }
        travado = false;
      });
    }

    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--nav-h', oculto ? '0px' : `${ALTURA_NAV}px`);
    /* Ao desmontar (troca de demo), devolve o valor padrão — senão a próxima
       rota herda `0px` e sua barra de categorias sobe para o topo. */
    return () => {
      document.documentElement.style.setProperty('--nav-h', `${ALTURA_NAV}px`);
    };
  }, [oculto]);

  return oculto;
}
