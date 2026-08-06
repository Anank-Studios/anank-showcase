import { z } from 'zod';

/**
 * Validação do formulário no cliente. Espelha `bookingSchema` do backend
 * (`apps/api/src/schemas/index.ts`) — o servidor revalida tudo de qualquer
 * forma; isto existe para dar erro imediato sob o campo, sem round-trip.
 */
export const bookingFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Informe seu nome completo.')
    .max(120, 'Nome muito longo.'),
  email: z.string().trim().email('Informe um e-mail válido.'),
  phone: z
    .string()
    .transform((value) => value.replace(/\D/g, ''))
    .refine((digits) => digits.length === 10 || digits.length === 11, {
      message: 'Informe um telefone válido com DDD.',
    }),
  firstVisit: z
    .boolean({ invalid_type_error: 'Diga se é a sua primeira visita.' })
    .nullable()
    .refine((value): value is boolean => value !== null, {
      message: 'Diga se é a sua primeira visita.',
    }),
  notes: z.string().trim().max(2000, 'Texto muito longo.'),
});

export type BookingFormErrors = Record<string, string>;
