/**
 * Schemas Zod. Mensagens SEMPRE em português do Brasil —
 * elas aparecem sob os campos do formulário no front.
 */

import { z } from 'zod';
import { DEMO_SLUGS } from '@anank/contracts';

/** Aceita máscara brasileira e valida por dígitos: 10 (fixo) ou 11 (celular). */
const phone = z
  .string({ required_error: 'Informe um telefone.' })
  .transform((value) => value.replace(/\D/g, ''))
  .refine((digits) => digits.length === 10 || digits.length === 11, {
    message: 'Informe um telefone válido com DDD.',
  });

export const leadSchema = z.object({
  demo: z.enum(DEMO_SLUGS, { errorMap: () => ({ message: 'Demonstração inválida.' }) }),
  name: z
    .string({ required_error: 'Informe seu nome.' })
    .trim()
    .min(2, 'Informe seu nome completo.')
    .max(120, 'Nome muito longo.'),
  phone,
  email: z.string().trim().email('Informe um e-mail válido.').optional().or(z.literal('')),
  interest: z.string().trim().max(160, 'Texto muito longo.').optional(),
  message: z.string().trim().max(2000, 'Mensagem muito longa.').optional(),
  source: z.enum(['hero', 'contato', 'newsletter', 'cta-final'], {
    errorMap: () => ({ message: 'Origem inválida.' }),
  }),
});

export const bookingSchema = z.object({
  protocolId: z.string({ required_error: 'Escolha um protocolo.' }).min(1, 'Escolha um protocolo.'),
  practitionerId: z
    .string({ required_error: 'Escolha uma profissional.' })
    .min(1, 'Escolha uma profissional.'),
  date: z
    .string({ required_error: 'Escolha uma data.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida.'),
  time: z
    .string({ required_error: 'Escolha um horário.' })
    .regex(/^\d{2}:\d{2}$/, 'Horário inválido.'),
  name: z
    .string({ required_error: 'Informe seu nome.' })
    .trim()
    .min(2, 'Informe seu nome completo.')
    .max(120, 'Nome muito longo.'),
  email: z
    .string({ required_error: 'Informe seu e-mail.' })
    .trim()
    .email('Informe um e-mail válido.'),
  phone,
  firstVisit: z.boolean({ required_error: 'Diga se é a sua primeira visita.' }),
  notes: z.string().trim().max(2000, 'Texto muito longo.').optional(),
});

export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida.'),
  practitionerId: z.string().optional(),
  protocolId: z.string().optional(),
});

export const monthQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Mês inválido. Use o formato AAAA-MM.'),
  practitionerId: z.string().optional(),
  protocolId: z.string().optional(),
});

/**
 * Pedido do nicho alimentacao.
 *
 * O corpo NAO traz preco. Preco de item, acrescimo de escolha, taxa de entrega
 * e total sao todos recalculados no servidor a partir do cardapio: aceitar
 * valor vindo do cliente e aceitar que o cliente escolha quanto pagar.
 */
export const orderSchema = z
  .object({
    demo: z.enum(DEMO_SLUGS, { errorMap: () => ({ message: 'Demonstracao invalida.' }) }),
    mode: z.enum(['entrega', 'retirada'], {
      errorMap: () => ({ message: 'Escolha entrega ou retirada.' }),
    }),
    lines: z
      .array(
        z.object({
          itemId: z.string().min(1, 'Item invalido.'),
          quantity: z
            .number({ invalid_type_error: 'Quantidade invalida.' })
            .int('Quantidade invalida.')
            .min(1, 'Quantidade minima e 1.')
            .max(20, 'Maximo de 20 por item.'),
          choiceIds: z.array(z.string()).optional(),
          note: z.string().trim().max(200, 'Observacao muito longa.').optional(),
        })
      )
      .min(1, 'Sua sacola esta vazia.'),
    customerName: z
      .string({ required_error: 'Informe seu nome.' })
      .trim()
      .min(2, 'Informe seu nome completo.')
      .max(120, 'Nome muito longo.'),
    phone,
    address: z.string().trim().max(240, 'Endereco muito longo.').optional().or(z.literal('')),
    payment: z.enum(['pix', 'credito', 'dinheiro'], {
      errorMap: () => ({ message: 'Escolha a forma de pagamento.' }),
    }),
    note: z.string().trim().max(500, 'Observacao muito longa.').optional(),
  })
  /* Endereco so e obrigatorio na ENTREGA. Marcado no proprio campo para o erro
     cair sob ele no formulario, e nao numa faixa generica no topo. */
  .refine((body) => body.mode !== 'entrega' || (body.address ?? '').trim().length >= 8, {
    message: 'Informe o endereco de entrega.',
    path: ['address'],
  });

export type OrderInput = z.infer<typeof orderSchema>;

export type LeadInput = z.infer<typeof leadSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;

/** Converte um ZodError no formato `details` do envelope de erro. */
export function toDetails(error: z.ZodError): { field: string; message: string }[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || '_',
    message: issue.message,
  }));
}
