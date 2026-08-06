const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

/** "A partir de R$ 220" */
export function formatPriceFrom(value: number): string {
  return `A partir de ${currency.format(value)}`;
}

const integer = new Intl.NumberFormat('pt-BR');

/** Formata números inteiros com separador de milhar pt-BR: 40000 -> "40.000". */
export function formatInteger(value: number): string {
  return integer.format(Math.round(value));
}
