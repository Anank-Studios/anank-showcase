import { z } from 'zod';

/** Mesma regra de telefone/nome/e-mail de `contactSchema` — ver o comentário lá. */
export const newsletterSchema = z.object({
  name: z
    .string({ required_error: 'Informe seu nome.' })
    .trim()
    .min(2, 'Informe seu nome completo.')
    .max(120, 'Nome muito longo.'),
  email: z.string({ required_error: 'Informe seu e-mail.' }).trim().email('Informe um e-mail válido.'),
  phone: z
    .string({ required_error: 'Informe um telefone.' })
    .transform((value) => value.replace(/\D/g, ''))
    .refine((digits) => digits.length === 10 || digits.length === 11, {
      message: 'Informe um telefone válido com DDD.',
    }),
});

export type NewsletterInput = z.input<typeof newsletterSchema>;
export type NewsletterFieldErrors = Partial<Record<keyof NewsletterInput, string>>;
