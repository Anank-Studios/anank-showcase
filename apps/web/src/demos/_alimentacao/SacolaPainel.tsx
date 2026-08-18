'use client';

import Image from 'next/image';
import { useId, useState } from 'react';
import type { DemoSlug, Order, OrderMode } from '@anank/contracts';
import { ApiError, createOrder } from '@/shared/lib/api';
import { IntentLink } from '@/shared/components/IntentLink';
import { precoUnitario, useSacola } from './sacola';

/**
 * Sacola e fechamento.
 *
 * O TOTAL que aparece antes de enviar é uma ESTIMATIVA de tela. Quem fecha a
 * conta é o servidor: o corpo do pedido não leva preço nenhum, e o recibo que
 * volta é a fonte da verdade. Se os dois divergirem, o certo é o de baixo.
 *
 * Nada é armazenado. O aviso de demonstração vem do servidor (`demoNotice`) e
 * é renderizado sem condicional, para não existir caminho em que ele suma.
 */

export interface SacolaPainelProps {
  slug: DemoSlug;
  /** Só para a ESTIMATIVA de tela. O valor que vale é o do recibo, calculado
   *  pelo servidor a partir de `DemoData.deliveryFee`. */
  taxaEntrega: number;
  /** Rota do cardápio desta marca, para os dois links de volta. */
  rotaCardapio: string;
}

export function SacolaPainel({ slug, taxaEntrega, rotaCardapio }: SacolaPainelProps) {
  const id = useId();
  const { linhas, subtotal, pecas, alterar, remover, limpar } = useSacola();

  const [modo, setModo] = useState<OrderMode>('entrega');
  const [enviando, setEnviando] = useState(false);
  const [recibo, setRecibo] = useState<Order | null>(null);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  async function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);

    setEnviando(true);
    setErros({});
    setErroGeral(null);

    try {
      const pedido = await createOrder(slug, {
        demo: slug,
        mode: modo,
        lines: linhas.map((l) => ({
          itemId: l.itemId,
          quantity: l.quantidade,
          choiceIds: l.escolhas.map((e) => e.id),
        })),
        customerName: String(dados.get('nome') ?? ''),
        phone: String(dados.get('telefone') ?? ''),
        address: String(dados.get('endereco') ?? ''),
        payment: String(dados.get('pagamento') ?? 'pix') as 'pix' | 'credito' | 'dinheiro',
        note: String(dados.get('obs') ?? ''),
      });
      setRecibo(pedido);
      /* A sacola só é esvaziada DEPOIS do recibo. Limpar junto com o envio
         perderia o pedido se a requisição falhasse no meio. */
      limpar();
    } catch (erro) {
      if (erro instanceof ApiError) {
        setErros(erro.fieldErrors);
        if (Object.keys(erro.fieldErrors).length === 0) setErroGeral(erro.message);
      } else {
        setErroGeral('Não foi possível enviar agora. Tente de novo.');
      }
    } finally {
      setEnviando(false);
    }
  }

  /* ---- recibo ---------------------------------------------------- */

  if (recibo) {
    return (
      <div role="status" className="mx-auto max-w-[46rem]">
        <p className="font-mono-brand text-[10px] tracking-[0.2em] text-accent uppercase">
          Pedido {recibo.code}
        </p>
        <h2 className="mt-4 font-display text-[clamp(1.75rem,5vw,3rem)] leading-[1.06]">
          A cozinha recebeu.
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-muted">
          {recibo.mode === 'entrega' ? 'Entrega' : 'Retirada'} estimada em{' '}
          <span className="text-[color:var(--brand-ink)]">{recibo.etaMin} minutos</span>.
        </p>

        <ul className="mt-9 divide-y divide-[color:var(--brand-line)] border-y border-line">
          {recibo.lines.map((l) => (
            <li key={`${l.itemId}-${l.choices.join()}`} className="flex justify-between gap-5 py-4">
              <span>
                <span className="text-[15px]">
                  {l.quantity}× {l.name}
                </span>
                {l.choices.length ? (
                  <span className="mt-1 block text-[13px] text-muted">{l.choices.join(' · ')}</span>
                ) : null}
              </span>
              <span className="font-mono-brand shrink-0 text-[14px]">R$ {l.lineTotal}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2 text-[14px]">
          <Linha rotulo="Subtotal" valor={`R$ ${recibo.subtotal}`} />
          {recibo.deliveryFee > 0 ? (
            <Linha rotulo="Entrega" valor={`R$ ${recibo.deliveryFee}`} />
          ) : null}
          <div className="flex justify-between border-t border-line pt-3 text-[17px]">
            <dt className="font-display">Total</dt>
            <dd className="font-mono-brand">R$ {recibo.total}</dd>
          </div>
        </dl>

        {/*
          Sem condicional: o aviso do servidor aparece SEMPRE na tela de
          sucesso. É o único ponto do fluxo em que alguém poderia acreditar que
          gastou dinheiro.
        */}
        <p className="mt-8 border-l-2 border-[color:var(--brand-accent-2)] bg-[color:var(--brand-surface)] p-5 text-[13px] leading-relaxed">
          <strong className="font-semibold">{recibo.demoNotice}</strong> Esta é uma demonstração da
          Anank Studios. Nenhuma cozinha foi avisada e nenhum valor foi cobrado.
        </p>

        <IntentLink
          href={rotaCardapio}
          className="mt-8 inline-flex items-center gap-2 border-b border-accent pb-1 text-[14px] font-medium"
        >
          Fazer outro pedido
          <span aria-hidden="true">→</span>
        </IntentLink>
      </div>
    );
  }

  /* ---- sacola vazia ---------------------------------------------- */

  if (linhas.length === 0) {
    return (
      <div className="mx-auto max-w-[42rem] text-center">
        <h2 className="font-display text-[clamp(1.5rem,4.5vw,2.5rem)] leading-[1.08]">
          Sua sacola está vazia.
        </h2>
        <p className="mx-auto mt-5 max-w-[42ch] text-[15px] leading-relaxed text-muted">
          Ela também esvazia se você recarregar a página: esta demonstração não guarda nada sobre
          quem visita — nem sessão, nem conta, nem carrinho salvo.
        </p>
        <IntentLink
          href={rotaCardapio}
          className="mt-8 inline-block bg-[color:var(--brand-accent)] px-7 py-3.5 text-[14px] font-medium text-[color:var(--brand-bg)]"
        >
          Ver o cardápio
        </IntentLink>
      </div>
    );
  }

  /* ---- sacola com itens ------------------------------------------ */

  const estimado = subtotal + (modo === 'entrega' ? taxaEntrega : 0);

  return (
    <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      {/* ---- itens ---- */}
      <div>
        <h2 className="font-display text-[1.5rem] leading-tight">
          {pecas === 1 ? '1 item' : `${pecas} itens`}
        </h2>

        <ul className="mt-6 divide-y divide-[color:var(--brand-line)] border-y border-line">
          {linhas.map((l) => (
            <li key={l.key} className="flex gap-4 py-5">
              <div className="relative size-[72px] shrink-0 overflow-hidden bg-[color:var(--brand-surface)]">
                <Image
                  src={l.imagem.url}
                  alt={l.imagem.alt}
                  fill
                  quality={62}
                  sizes="72px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-4">
                  <h3 className="text-[15px]">{l.nome}</h3>
                  <span className="font-mono-brand shrink-0 text-[14px]">
                    R$ {precoUnitario(l) * l.quantidade}
                  </span>
                </div>

                {l.escolhas.length ? (
                  <p className="mt-1 text-[13px] text-muted">
                    {l.escolhas.map((e) => e.label).join(' · ')}
                  </p>
                ) : null}

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center border border-[color:var(--brand-muted)]">
                    <button
                      type="button"
                      onClick={() => alterar(l.key, -1)}
                      aria-label={`Diminuir ${l.nome}`}
                      className="px-2.5 py-1 text-[15px] leading-none hover:text-accent"
                    >
                      −
                    </button>
                    <span
                      className="font-mono-brand min-w-[2rem] text-center text-[13px]"
                      aria-live="polite"
                    >
                      {l.quantidade}
                    </span>
                    <button
                      type="button"
                      onClick={() => alterar(l.key, 1)}
                      aria-label={`Aumentar ${l.nome}`}
                      className="px-2.5 py-1 text-[15px] leading-none hover:text-accent"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remover(l.key)}
                    className="text-[12px] text-muted underline underline-offset-4 hover:text-accent"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ---- fechamento ---- */}
      <form onSubmit={aoEnviar} noValidate className="space-y-6">
        <fieldset>
          <legend className="font-mono-brand text-[10px] tracking-[0.16em] text-muted uppercase">
            Como você quer receber
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(['entrega', 'retirada'] as const).map((opcao) => (
              <label
                key={opcao}
                className={[
                  'cursor-pointer border px-4 py-3 text-center text-[14px] capitalize transition-colors',
                  modo === opcao
                    ? 'border-[color:var(--brand-accent)] text-accent'
                    : 'border-[color:var(--brand-muted)]',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="modo"
                  value={opcao}
                  checked={modo === opcao}
                  onChange={() => setModo(opcao)}
                  className="sr-only"
                />
                {opcao}
              </label>
            ))}
          </div>
        </fieldset>

        {/* `customerName`, nao `name`: e o nome do campo NO SCHEMA do servidor,
            e e por ele que o erro volta. Com `erros.name` o campo nunca
            acendia — o pedido era recusado e a tela nao dizia por que. */}
        <Campo
          id={`${id}-nome`}
          name="nome"
          label="Nome"
          autoComplete="name"
          erro={erros.customerName}
        />
        <Campo
          id={`${id}-telefone`}
          name="telefone"
          label="WhatsApp"
          type="tel"
          autoComplete="tel"
          erro={erros.phone}
        />

        {/* O endereço só existe na entrega — e o servidor só o exige nesse
            modo, com o erro apontado para este campo. */}
        {modo === 'entrega' ? (
          <Campo
            id={`${id}-endereco`}
            name="endereco"
            label="Endereço com número"
            autoComplete="street-address"
            erro={erros.address}
          />
        ) : null}

        <div>
          <label htmlFor={`${id}-pagamento`} className="block text-[13px]">
            Pagamento
          </label>
          <select
            id={`${id}-pagamento`}
            name="pagamento"
            defaultValue="pix"
            className="mt-2 w-full border border-[color:var(--brand-muted)] bg-[color:var(--brand-surface)] px-3.5 py-2.5 text-[15px] outline-none focus:border-[color:var(--brand-accent)]"
          >
            <option value="pix">Pix</option>
            <option value="credito">Cartão de crédito</option>
            <option value="dinheiro">Dinheiro</option>
          </select>
        </div>

        <div>
          <label htmlFor={`${id}-obs`} className="block text-[13px]">
            Observações (opcional)
          </label>
          <textarea
            id={`${id}-obs`}
            name="obs"
            rows={2}
            placeholder="Sem cebolinha, por favor"
            className="mt-2 w-full border border-[color:var(--brand-muted)] bg-[color:var(--brand-surface)] px-3.5 py-2.5 text-[15px] outline-none focus:border-[color:var(--brand-accent)]"
          />
        </div>

        <dl className="space-y-2 border-t border-line pt-5 text-[14px]">
          <Linha rotulo="Subtotal" valor={`R$ ${subtotal}`} />
          <Linha
            rotulo="Entrega"
            valor={modo === 'entrega' ? `R$ ${taxaEntrega}` : 'Grátis na retirada'}
          />
          <div className="flex justify-between border-t border-line pt-3 text-[17px]">
            <dt className="font-display">Total</dt>
            <dd className="font-mono-brand">R$ {estimado}</dd>
          </div>
        </dl>

        {erroGeral ? (
          <p role="alert" className="text-[13px] text-[color:var(--brand-accent-2)]">
            {erroGeral}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-[color:var(--brand-accent)] px-7 py-3.5 text-[14px] font-medium text-[color:var(--brand-bg)] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {enviando ? 'Enviando…' : `Enviar pedido · R$ ${estimado}`}
        </button>

        <p className="text-[12px] leading-relaxed text-muted">
          Demonstração da Anank Studios. O pedido percorre o fluxo inteiro, mas nenhuma cozinha é
          avisada, nada é armazenado e nada é cobrado.
        </p>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{rotulo}</dt>
      <dd className="font-mono-brand">{valor}</dd>
    </div>
  );
}

function Campo({
  id,
  name,
  label,
  erro,
  ...resto
}: {
  id: string;
  name: string;
  label: string;
  erro?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        /* Borda em `--brand-muted` (7.3:1). Em `--brand-line` daria 1.3:1: o
           campo some, e contorno é o único limite de um input. O Lighthouse
           não audita contraste de não-texto. */
        className="mt-2 w-full border border-[color:var(--brand-muted)] bg-[color:var(--brand-surface)] px-3.5 py-2.5 text-[15px] outline-none focus:border-[color:var(--brand-accent)]"
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        {...resto}
      />
      {erro ? (
        <p id={`${id}-erro`} className="mt-1.5 text-[12px] text-[color:var(--brand-accent-2)]">
          {erro}
        </p>
      ) : null}
    </div>
  );
}
