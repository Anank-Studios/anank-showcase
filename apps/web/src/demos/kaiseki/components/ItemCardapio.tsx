'use client';

import Image from 'next/image';
import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { MenuItem } from '@anank/contracts';
import { useSacola, type EscolhaSacola } from '../lib/sacola';

/**
 * Um item do cardápio, com as escolhas dele.
 *
 * Os grupos `single` já vêm com a PRIMEIRA opção marcada. Não é enfeite: o
 * servidor exige exatamente uma escolha por grupo `single` — sem a pré-seleção,
 * o caminho mais comum (abrir e clicar em adicionar) devolveria 422 por um
 * campo que o visitante nem sabia que existia.
 *
 * O painel de escolhas só existe para quem tem escolhas. Item simples ganha um
 * botão direto: abrir um painel vazio para confirmar "nenhuma opção" seria um
 * clique cobrado por nada.
 */
export function ItemCardapio({ item }: { item: MenuItem }) {
  const id = useId();
  const reduced = useReducedMotion();
  const { adicionar } = useSacola();

  const temEscolhas = (item.options ?? []).length > 0;
  const [aberto, setAberto] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  const [selecao, setSelecao] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      (item.options ?? []).map((g) => [
        g.id,
        g.kind === 'single' && g.choices[0] ? [g.choices[0].id] : [],
      ])
    )
  );

  const escolhidas: EscolhaSacola[] = (item.options ?? []).flatMap((g) =>
    g.choices
      .filter((c) => (selecao[g.id] ?? []).includes(c.id))
      .map((c) => ({ id: c.id, label: c.label, priceDelta: c.priceDelta }))
  );

  const preco = item.price + escolhidas.reduce((soma, e) => soma + e.priceDelta, 0);

  function trocar(grupoId: string, escolhaId: string, unico: boolean) {
    setSelecao((atual) => {
      const atuais = atual[grupoId] ?? [];
      if (unico) return { ...atual, [grupoId]: [escolhaId] };
      return {
        ...atual,
        [grupoId]: atuais.includes(escolhaId)
          ? atuais.filter((x) => x !== escolhaId)
          : [...atuais, escolhaId],
      };
    });
  }

  function aoAdicionar() {
    adicionar({
      itemId: item.id,
      nome: item.name,
      precoBase: item.price,
      escolhas: escolhidas,
      imagem: { url: item.image.url, alt: item.image.alt },
    });
    setAberto(false);
    /* Confirmação efêmera no próprio botão: um toast no canto da tela obriga o
       olho a sair do item que a pessoa acabou de tocar. */
    setConfirmado(true);
    window.setTimeout(() => setConfirmado(false), 1800);
  }

  return (
    <article className="flex h-full flex-col border border-line bg-[color:var(--brand-surface)]">
      <div className="relative aspect-[3/2] overflow-hidden bg-[color:var(--brand-bg)]">
        <Image
          src={item.image.url}
          alt={item.image.alt}
          fill
          quality={62}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
          className="object-cover"
        />
        {item.badges?.[0] ? (
          <span className="font-mono-brand absolute top-3 left-3 bg-[color:var(--brand-accent-2)] px-2.5 py-1 text-[9px] font-bold tracking-[0.12em] text-[#f6f4f0] uppercase">
            {item.badges[0]}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-[1.1875rem] leading-tight">{item.name}</h3>
          <span className="font-mono-brand shrink-0 text-[13px] text-accent">R$ {item.price}</span>
        </div>

        <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted">{item.description}</p>

        {temEscolhas ? (
          <div className="mt-5">
            <button
              type="button"
              aria-expanded={aberto}
              aria-controls={`${id}-opcoes`}
              onClick={() => setAberto((v) => !v)}
              className="w-full border border-[color:var(--brand-muted)] px-4 py-2.5 text-[13px] transition-colors hover:border-[color:var(--brand-accent)]"
            >
              {aberto ? 'Fechar opções' : 'Escolher opções'}
            </button>

            <AnimatePresence initial={false}>
              {aberto ? (
                <motion.div
                  id={`${id}-opcoes`}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: reduced ? 0.15 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-5 pt-5">
                    {(item.options ?? []).map((grupo) => (
                      <fieldset key={grupo.id}>
                        <legend className="font-mono-brand text-[10px] tracking-[0.14em] text-muted uppercase">
                          {grupo.label}
                          {grupo.kind === 'multi' ? ' · opcional' : ''}
                        </legend>

                        <div className="mt-2.5 space-y-1.5">
                          {grupo.choices.map((escolha) => {
                            const marcado = (selecao[grupo.id] ?? []).includes(escolha.id);
                            return (
                              <label
                                key={escolha.id}
                                className="flex cursor-pointer items-center justify-between gap-3 text-[13px]"
                              >
                                <span className="flex items-center gap-2.5">
                                  <input
                                    type={grupo.kind === 'single' ? 'radio' : 'checkbox'}
                                    name={`${id}-${grupo.id}`}
                                    checked={marcado}
                                    onChange={() =>
                                      trocar(grupo.id, escolha.id, grupo.kind === 'single')
                                    }
                                    className="accent-[color:var(--brand-accent)]"
                                  />
                                  {escolha.label}
                                </span>
                                {escolha.priceDelta > 0 ? (
                                  <span className="font-mono-brand shrink-0 text-[12px] text-muted">
                                    + R$ {escolha.priceDelta}
                                  </span>
                                ) : null}
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ) : null}

        <button
          type="button"
          onClick={aoAdicionar}
          disabled={item.soldOut}
          className="mt-4 w-full bg-[color:var(--brand-accent)] px-4 py-3 text-[13px] font-medium text-[color:var(--brand-bg)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {item.soldOut
            ? 'Acabou hoje'
            : confirmado
              ? 'Adicionado ✓'
              : `Adicionar · R$ ${preco}`}
        </button>

        {/* O leitor de tela precisa da confirmação, e ela não pode depender de
            o foco continuar no botão — daí uma região viva à parte. */}
        <span role="status" aria-live="polite" className="sr-only">
          {confirmado ? `${item.name} adicionado à sacola.` : ''}
        </span>
      </div>
    </article>
  );
}
