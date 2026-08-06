/**
 * Helpers de formatação da demo Aurea. Sem dependência externa.
 */

/** Aplica a máscara brasileira progressivamente enquanto o usuário digita. */
export function formatPhoneBR(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';

  const ddd = digits.slice(0, 2);
  if (digits.length <= 2) return `(${ddd}`;

  const rest = digits.slice(2);
  // 11 dígitos → celular (5+4). Até 10 → fixo (4+4).
  const splitAt = digits.length > 10 ? 5 : 4;
  const part1 = rest.slice(0, splitAt);
  const part2 = rest.slice(splitAt);

  return part2 ? `(${ddd}) ${part1}-${part2}` : `(${ddd}) ${part1}`;
}

/** Monta o link do WhatsApp com mensagem pré-preenchida. */
export function whatsappLink(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
