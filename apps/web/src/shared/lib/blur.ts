/**
 * `blurDataURL` para o `placeholder="blur"` do next/image.
 * Um SVG de cor sólida em base64 — barato, sem requisição, e evita o flash branco.
 */

const CACHE = new Map<string, string>();

export function blurFor(hex: string): string {
  const cached = CACHE.get(hex);
  if (cached) return cached;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="${hex}"/></svg>`;
  const encoded =
    typeof window === 'undefined'
      ? Buffer.from(svg, 'utf8').toString('base64')
      : window.btoa(unescape(encodeURIComponent(svg)));

  const url = `data:image/svg+xml;base64,${encoded}`;
  CACHE.set(hex, url);
  return url;
}

/** Atalhos por marca — a cor de fundo de cada uma. */
export const BLUR = {
  anank: blurFor('#E4E3DE'),
  aurea: blurFor('#E8D5C4'),
  vivace: blurFor('#DDDCD3'),
  oniria: blurFor('#131315'),
} as const;
