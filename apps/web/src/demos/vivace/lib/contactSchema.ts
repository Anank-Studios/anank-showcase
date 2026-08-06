import { z } from 'zod';

/**
 * Espelha, campo a campo, a validação de `leadSchema` em
 * `apps/api/src/schemas/index.ts` (fora do escopo deste subagente — arquivo
 * do orquestrador). O telefone usa a MESMA regra (10 ou 11 dígitos após
 * remover a máscara) e a mesma mensagem de erro em pt-BR, para que o erro
 * que o servidor devolve num 422 seja idêntico ao que o cliente já teria
 * mostrado. `unidade` e `consentimento` são exclusivos do formulário — não
 * fazem parte de `LeadRequest` e não são reenviados como campos separados
 * (a unidade é prefixada na mensagem antes do POST).
 */
export const contactSchema = z.object({
  name: z
    .string({ required_error: 'Informe seu nome.' })
    .trim()
    .min(2, 'Informe seu nome completo.')
    .max(120, 'Nome muito longo.'),
  email: z
    .string()
    .trim()
    .email('Informe um e-mail válido.')
    .optional()
    .or(z.literal('')),
  phone: z
    .string({ required_error: 'Informe um telefone.' })
    .transform((value) => value.replace(/\D/g, ''))
    .refine((digits) => digits.length === 10 || digits.length === 11, {
      message: 'Informe um telefone válido com DDD.',
    }),
  unit: z.string({ required_error: 'Escolha uma unidade.' }).min(1, 'Escolha uma unidade.'),
  interest: z.string({ required_error: 'Escolha um serviço.' }).min(1, 'Escolha um serviço de interesse.'),
  message: z.string().trim().max(2000, 'Mensagem muito longa.').optional().or(z.literal('')),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'É preciso concordar com o uso dos dados para prosseguir.' }),
  }),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;
