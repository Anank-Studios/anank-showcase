/**
 * Tema claro/escuro do hub da Anank.
 *
 * Vale SÓ para o hub. As três demos têm identidade fixa — Aurea creme, Vivace
 * clara, Oniria preta — e poder trocar o tema delas destruiria justamente o
 * argumento comercial de que são marcas diferentes.
 *
 * A escolha vive num COOKIE, não em `localStorage` (proibido por ESLint neste
 * projeto). O cookie é a melhor das opções, não só a permitida: o servidor lê
 * antes de renderizar, então o HTML já sai no tema certo e não há flash.
 *
 * Este arquivo é deliberadamente livre de `next/headers`: ele é importado tanto
 * pelo layout (servidor) quanto pelo toggle (cliente). Quem precisa de
 * `cookies()` importa direto de `next/headers`.
 */

export type Theme = 'light' | 'dark';

export const THEME_COOKIE = 'anank-theme';

/** Escuro é o padrão: é assim que a marca Anank se apresenta de verdade. */
export const DEFAULT_THEME: Theme = 'dark';

/** Um ano. É preferência de exibição — não há motivo para expirar antes. */
export const THEME_MAX_AGE = 60 * 60 * 24 * 365;

/** Qualquer valor que não seja exatamente `light` cai no padrão. */
export function parseTheme(value: string | undefined): Theme {
  return value === 'light' ? 'light' : DEFAULT_THEME;
}

/**
 * Cookie funcional: sem dado pessoal, sem rastreio, `SameSite=Lax`.
 * Não leva `Secure` porque precisa funcionar em `http://localhost` no dev.
 */
export function themeCookie(theme: Theme): string {
  return `${THEME_COOKIE}=${theme}; path=/; max-age=${THEME_MAX_AGE}; samesite=lax`;
}
