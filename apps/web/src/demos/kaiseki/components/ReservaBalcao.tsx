'use client';

import { useId, useState } from 'react';
import { ApiError, createLead } from '@/shared/lib/api';

/**
 * Pedido de reserva do balcão.
 *
 * É um LEAD, não um pedido: reservar lugar não tem item, carrinho nem
 * pagamento, então não se confunde com o fluxo de compra da sacola. São duas
 * coisas diferentes na mesma casa, e a demo mostra as duas.
 *
 * Nada é armazenado. O aviso na tela de sucesso vem do servidor
 * (`demoNotice`), não de um texto local — assim não existe caminho em que ele
 * deixe de aparecer.
 */
export function ReservaBalcao() {
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
        demo: 'kaiseki',
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
        /* Faixa geral só quando NÃO há erro de campo: com as duas coisas na
           tela, a pessoa lê a faixa e não vê o campo destacado. */
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
      <div
        role="status"
        className="border-l-2 border-[color:var(--brand-accent)] bg-[color:var(--brand-surface)] p-7"
      >
        <p className="font-display text-[1.375rem] leading-tight">Pedido de reserva recebido.</p>
        <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-muted">
          A casa confirma por WhatsApp assim que abrir a agenda da semana. Protocolo{' '}
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
      <Campo id={`${id}-nome`} name="nome" label="Nome" autoComplete="name" erro={erros.name} />
      <Campo
        id={`${id}-telefone`}
        name="telefone"
        label="WhatsApp"
        type="tel"
        autoComplete="tel"
        erro={erros.phone}
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
        <label htmlFor={`${id}-mensagem`} className="block text-[13px]">
          Que noite e quantos lugares
        </label>
        <textarea
          id={`${id}-mensagem`}
          name="mensagem"
          rows={3}
          placeholder="Sexta ou sábado, 2 lugares, primeiro serviço"
          aria-invalid={erros.message ? true : undefined}
          aria-describedby={erros.message ? `${id}-mensagem-erro` : undefined}
          className="mt-2 w-full border border-[color:var(--brand-muted)] bg-[color:var(--brand-surface)] px-3.5 py-2.5 text-[15px] outline-none focus:border-[color:var(--brand-accent)]"
        />
        {erros.message ? (
          <p
            id={`${id}-mensagem-erro`}
            className="mt-1.5 text-[12px] text-[color:var(--brand-accent-2)]"
          >
            {erros.message}
          </p>
        ) : null}
      </div>

      {erroGeral ? (
        <p role="alert" className="text-[13px] text-[color:var(--brand-accent-2)]">
          {erroGeral}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={enviando}
        className="w-full bg-[color:var(--brand-accent)] px-7 py-3.5 text-[14px] font-medium text-[color:var(--brand-bg)] transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {enviando ? 'Enviando…' : 'Pedir lugar no balcão'}
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
      <label htmlFor={id} className="block text-[13px]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        /* Borda em `--brand-muted` (7.3:1); `--brand-line` daria 1.3:1 e o
           campo sumiria. Contorno é o único limite de um input. */
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
