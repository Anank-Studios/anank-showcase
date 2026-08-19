import type { FastifyInstance } from 'fastify';
import type { Order, OrderLine, MenuItem } from '@anank/contracts';
import { DEMO_NOTICE_ORDER, isDemoSlug } from '@anank/contracts';
import { DEMOS } from '../data/index.js';
import { orderSchema, toDetails } from '../schemas/index.js';
import { sleep } from '../services/calendar.mock.js';
import { fail, ok } from '../lib/envelope.js';

/**
 * Pedido do nicho alimentação.
 *
 * NADA é persistido: o pedido é montado em memória e devolvido como recibo,
 * exatamente como o agendamento da Oniria. `demoNotice` vai SEMPRE na resposta
 * e o front é obrigado a exibi-lo — assim não existe caminho, nem de erro nem
 * de sucesso, em que a tela deixe de dizer que nada foi cobrado.
 *
 * Todo o dinheiro é calculado AQUI. O corpo da requisição não tem campo de
 * preço, e é de propósito: preço que vem do cliente é preço que o cliente
 * escolhe.
 */

let contador = 0;

/** Resolve os rótulos e o acréscimo das escolhas de UM item. */
function resolverEscolhas(
  item: MenuItem,
  escolhidos: string[]
): { rotulos: string[]; acrescimo: number; erro?: string } {
  const rotulos: string[] = [];
  let acrescimo = 0;

  for (const grupo of item.options ?? []) {
    const daqui = grupo.choices.filter((c) => escolhidos.includes(c.id));

    /* Grupo `single` é radio: exatamente uma. Nem zero (o preço mudaria
       conforme o item, e o cliente não escolheu), nem duas. */
    if (grupo.kind === 'single' && daqui.length !== 1) {
      return { rotulos: [], acrescimo: 0, erro: `Escolha uma opção em "${grupo.label}".` };
    }

    for (const escolha of daqui) {
      rotulos.push(escolha.label);
      acrescimo += escolha.priceDelta;
    }
  }

  /* Id que não pertence a nenhum grupo do item: ou o cardápio mudou desde que
     a página carregou, ou alguém montou o corpo à mão. Nos dois casos é erro. */
  const conhecidos = new Set((item.options ?? []).flatMap((g) => g.choices.map((c) => c.id)));
  const intruso = escolhidos.find((id) => !conhecidos.has(id));
  if (intruso) {
    return { rotulos: [], acrescimo: 0, erro: 'Opção indisponível. Recarregue o cardápio.' };
  }

  return { rotulos, acrescimo };
}

export async function ordersRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Params: { slug: string } }>('/api/demos/:slug/order', async (request, reply) => {
    const { slug } = request.params;
    if (!isDemoSlug(slug)) {
      return reply.code(404).send(fail('NOT_FOUND', 'Demonstração não encontrada.'));
    }

    const dados = DEMOS[slug];
    /* A hamburgueria cai aqui: ela tem cardápio e NÃO vende. Sem esta guarda,
       um POST montado à mão receberia um recibo de uma casa que, no site,
       diz não receber pedido. */
    if (!dados.menu || !dados.acceptsOrders) {
      return reply.code(404).send(fail('NOT_FOUND', 'Esta casa não recebe pedidos pelo site.'));
    }

    const parsed = orderSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply
        .code(422)
        .send(fail('VALIDATION_ERROR', 'Confira os campos destacados.', toDetails(parsed.error)));
    }

    const corpo = parsed.data;
    if (corpo.demo !== slug) {
      return reply.code(422).send(
        fail('VALIDATION_ERROR', 'Confira os campos destacados.', [
          { field: 'demo', message: 'Pedido enviado para a casa errada.' },
        ])
      );
    }

    const linhas: OrderLine[] = [];

    for (const [i, pedida] of corpo.lines.entries()) {
      const item = dados.menu.items.find((m) => m.id === pedida.itemId);
      if (!item) {
        return reply.code(422).send(
          fail('VALIDATION_ERROR', 'Confira os campos destacados.', [
            { field: `lines.${i}.itemId`, message: 'Item fora do cardápio.' },
          ])
        );
      }
      if (item.soldOut) {
        return reply.code(422).send(
          fail('VALIDATION_ERROR', 'Confira os campos destacados.', [
            { field: `lines.${i}.itemId`, message: `${item.name} acabou hoje.` },
          ])
        );
      }

      const escolhas = resolverEscolhas(item, pedida.choiceIds ?? []);
      if (escolhas.erro) {
        return reply.code(422).send(
          fail('VALIDATION_ERROR', 'Confira os campos destacados.', [
            { field: `lines.${i}.choiceIds`, message: escolhas.erro },
          ])
        );
      }

      const unitPrice = item.price + escolhas.acrescimo;
      linhas.push({
        itemId: item.id,
        name: item.name,
        quantity: pedida.quantity,
        choices: escolhas.rotulos,
        unitPrice,
        lineTotal: unitPrice * pedida.quantity,
      });
    }

    // Latência artificial: dá função ao estado de "enviando" do botão.
    await sleep(700);

    const subtotal = linhas.reduce((soma, l) => soma + l.lineTotal, 0);
    const deliveryFee = corpo.mode === 'entrega' ? (dados.deliveryFee ?? 0) : 0;
    const pecas = linhas.reduce((soma, l) => soma + l.quantity, 0);

    /* Tempo cresce com o tamanho do pedido, mas com teto: uma conta linear
       devolveria "180 min" num pedido grande e ninguém acredita nisso. */
    const etaMin = Math.min(90, (corpo.mode === 'entrega' ? 45 : 20) + Math.max(0, pecas - 1) * 4);

    contador += 1;
    const order: Order = {
      /* Código curto, do jeito que a casa gritaria no balcão. */
      code: String(4000 + ((Date.now() + contador) % 5000)),
      demo: slug,
      mode: corpo.mode,
      lines: linhas,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      etaMin,
      placedAt: new Date().toISOString(),
      demoNotice: DEMO_NOTICE_ORDER,
    };

    // O pedido NÃO é armazenado. Só ecoamos o recibo.
    return reply.code(201).send(ok(order));
  });
}
