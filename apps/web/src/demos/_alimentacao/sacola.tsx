'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Sacola do nicho ALIMENTACAO — compartilhada pelas casas que vendem.
 *
 * Mora em `_alimentacao/` e nao dentro de uma marca porque duas demos usam a
 * mesma mecanica de carrinho. O visual nao precisa ser compartilhado junto: os
 * componentes leem `var(--brand-*)`, entao o mesmo codigo sai vermelho na
 * pizzaria e indigo na japonesa sem uma linha de condicional.
 *
 * O estado vive em MEMÓRIA, num Context montado no layout da demo. Não é
 * atalho: `localStorage` e `sessionStorage` são proibidos no projeto, e o
 * Context no layout já resolve o caso real — navegar entre cardápio e sacola é
 * navegação de cliente, então o React não desmonta o provider e a sacola
 * sobrevive à troca de rota.
 *
 * O que ela NÃO sobrevive é a um recarregamento de página. Numa loja de
 * verdade isso seria defeito; numa demonstração é o comportamento honesto —
 * não há sessão, não há conta, não há nada guardado sobre quem visita.
 *
 * Preço aqui é só para MOSTRAR. Quem fecha a conta é o servidor, a partir do
 * cardápio: o corpo do pedido não leva valor nenhum.
 */

export interface EscolhaSacola {
  id: string;
  label: string;
  priceDelta: number;
}

export interface LinhaSacola {
  /** Identidade da LINHA, não do item: o mesmo ramen com extras diferentes são
   *  duas linhas, e com os mesmos extras é uma linha de quantidade 2. */
  key: string;
  itemId: string;
  nome: string;
  precoBase: number;
  escolhas: EscolhaSacola[];
  quantidade: number;
  imagem: { url: string; alt: string };
}

interface Sacola {
  linhas: LinhaSacola[];
  pecas: number;
  subtotal: number;
  adicionar: (linha: Omit<LinhaSacola, 'key' | 'quantidade'>, quantidade?: number) => void;
  alterar: (key: string, delta: number) => void;
  remover: (key: string) => void;
  limpar: () => void;
}

const Contexto = createContext<Sacola | null>(null);

/** Preço unitário já com os acréscimos das escolhas. */
export function precoUnitario(linha: Pick<LinhaSacola, 'precoBase' | 'escolhas'>): number {
  return linha.precoBase + linha.escolhas.reduce((soma, e) => soma + e.priceDelta, 0);
}

/* As escolhas entram ORDENADAS na chave: sem isso, escolher "nori, chashu" e
   "chashu, nori" geraria duas linhas idênticas na tela. */
function chaveDe(itemId: string, escolhas: EscolhaSacola[]): string {
  return [itemId, ...escolhas.map((e) => e.id).sort()].join('|');
}

export function SacolaProvider({ children }: { children: React.ReactNode }) {
  const [linhas, setLinhas] = useState<LinhaSacola[]>([]);

  const adicionar = useCallback<Sacola['adicionar']>((nova, quantidade = 1) => {
    const key = chaveDe(nova.itemId, nova.escolhas);
    setLinhas((atuais) => {
      const existente = atuais.find((l) => l.key === key);
      if (existente) {
        return atuais.map((l) =>
          l.key === key ? { ...l, quantidade: Math.min(20, l.quantidade + quantidade) } : l
        );
      }
      return [...atuais, { ...nova, key, quantidade }];
    });
  }, []);

  const alterar = useCallback<Sacola['alterar']>((key, delta) => {
    setLinhas((atuais) =>
      atuais
        .map((l) =>
          l.key === key ? { ...l, quantidade: Math.min(20, l.quantidade + delta) } : l
        )
        /* Chegou a zero: sai da sacola. Deixar uma linha de quantidade 0 na
           tela obriga o visitante a um segundo gesto para se livrar dela. */
        .filter((l) => l.quantidade > 0)
    );
  }, []);

  const remover = useCallback<Sacola['remover']>((key) => {
    setLinhas((atuais) => atuais.filter((l) => l.key !== key));
  }, []);

  const limpar = useCallback(() => setLinhas([]), []);

  const valor = useMemo<Sacola>(
    () => ({
      linhas,
      pecas: linhas.reduce((soma, l) => soma + l.quantidade, 0),
      subtotal: linhas.reduce((soma, l) => soma + precoUnitario(l) * l.quantidade, 0),
      adicionar,
      alterar,
      remover,
      limpar,
    }),
    [linhas, adicionar, alterar, remover, limpar]
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSacola(): Sacola {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error('useSacola precisa estar dentro de <SacolaProvider>.');
  return contexto;
}
