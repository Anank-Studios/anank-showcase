'use client';

import { useId, useState } from 'react';
import { ApiError, createLead } from '@/shared/lib/api';

/**
 * Pedido de reserva de mesa.
 *
 * É um LEAD, não um pedido: a Brasa é a demo informativa do nicho e não recebe
 * pedido pelo site. Reservar mesa não fura essa regra — não há item, carrinho
 * nem pagamento —, e dá ao formulário uma função real em vez de um "fale
 * conosco" decorativo.
 *
 * Nada é armazenado: a API devolve um recibo e descarta. O aviso na tela de
 * sucesso vem do servidor (`demoNotice`), não de um texto local, para não
 * existir caminho em que ele deixe de aparecer.
 */
export function ReservaForm() {
  const id = useId();
  const [enviando, setEnviando] = useState(false);
  const [recibo, setRecibo] = useState<{ id: string; aviso: string } | null>(null);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  async function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);

    setEnviando(true);
    setErros({});
    setErroGeral(null);

    try {
      const resposta = await createLead({
        demo: 'brasa',
        source: 'contato',
        name: String(dados.get('nome') ?? ''),
        phone: String(dados.get('telefone') ?? ''),
        email: String(dados.get('email') ?? ''),
        message: String(dados.get('mensagem') ?? ''),
      });
      setRecibo({ id: resposta.id, aviso: resposta.demoNotice });
    } catch (erro) {
      if (erro instanceof ApiError) {
        setErros(erro.fieldErrors);
        /* Só mostra a faixa geral quando NÃO há erro de campo: com as duas
           coisas na tela, a pessoa lê a faixa e não vê o campo destacado. */
        if (Object.keys(erro.fieldErrors).length === 0) setErroGeral(erro.message);
      } else {
        setErroGeral('Não foi possível enviar agora. Tente de novo.');
      }
    } finally {
      setEnviando(false);
    }
  }

  if (recibo) {
    return (
      /* `role="status"` para o leitor de tela anunciar a troca — o formulário
         desaparece e, sem isso, quem não vê a tela não sabe que deu certo. */
      <div role="status" className="border-l-[3px] border-accent bg-[color:var(--brand-bg)] p-7">
        <p className="font-display text-[1.5rem] leading-tight tracking-[-0.03em]">
          Recebemos seu pedido de reserva.
        </p>
        <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">
          A casa confirma por WhatsApp em até duas horas. Protocolo{' '}
          <span className="font-mono-brand">{recibo.id}</span>.
        </p>
        <p className="font-mono-brand mt-5 text-[11px] tracking-[0.08em] text-accent uppercase">
          {recibo.aviso}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={aoEnviar} noValidate className="space-y-5">
      <Campo
        id={`${id}-nome`}
        name="nome"
        label="Nome"
        autoComplete="name"
        erro={erros.name}
        required
      />
      <Campo
        id={`${id}-telefone`}
        name="telefone"
        label="WhatsApp"
        type="tel"
        autoComplete="tel"
        erro={erros.phone}
        required
      />
      <Campo
        id={`${id}-email`}
        name="email"
        label="E-mail (opcional)"
        type="email"
        autoComplete="email"
        erro={erros.email}
      />

      <div>
        <label htmlFor={`${id}-mensagem`} className="block text-[13px] font-semibold">
          Dia, horário e quantas pessoas
        </label>
        <textarea
          id={`${id}-mensagem`}
          name="mensagem"
          rows={3}
          placeholder="Sexta, 20h, 4 pessoas"
          aria-invalid={erros.message ? true : undefined}
          aria-describedby={erros.message ? `${id}-mensagem-erro` : undefined}
          className="mt-2 w-full border border-[color:var(--brand-muted)] bg-[color:var(--brand-surface)] px-3.5 py-2.5 text-[15px] outline-none focus:border-[color:var(--brand-accent)]"
        />
        {erros.message ? (
          <p id={`${id}-mensagem-erro`} className="mt-1.5 text-[12px] text-accent">
            {erros.message}
          </p>
        ) : null}
      </div>

      {erroGeral ? (
        <p role="alert" className="text-[13px] text-accent">
          {erroGeral}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={enviando}
        className="w-full bg-accent px-7 py-3.5 text-[14px] font-semibold text-[color:var(--brand-surface)] transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {enviando ? 'Enviando…' : 'Pedir reserva'}
      </button>

      <p className="text-[12px] leading-relaxed text-muted">
        Demonstração: nenhum dado é armazenado e nenhuma reserva é criada de fato.
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */

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
      <label htmlFor={id} className="block text-[13px] font-semibold">
        {label}
      </label>
      <input
        id={id}
        name={name}
        /* Borda em `--brand-muted` (5.4:1 sobre o papel). Em `--brand-line`
           ficaria 1.3:1: o campo some, e contorno é o único limite de um
           input. O Lighthouse não audita contraste de não-texto. */
        className="mt-2 w-full border border-[color:var(--brand-muted)] bg-[color:var(--brand-surface)] px-3.5 py-2.5 text-[15px] outline-none focus:border-[color:var(--brand-accent)]"
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        {...resto}
      />
      {erro ? (
        <p id={`${id}-erro`} className="mt-1.5 text-[12px] text-accent">
          {erro}
        </p>
      ) : null}
    </div>
  );
}
