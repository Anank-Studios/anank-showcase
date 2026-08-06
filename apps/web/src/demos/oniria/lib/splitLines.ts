/**
 * SplitText próprio — o plugin oficial do GSAP é pago, não pode ser usado.
 *
 * `splitIntoLines` reconstrói o conteúdo de `el` em linhas medidas por
 * `offsetTop`: cada linha vira `<span class="oniria-line"><span
 * class="oniria-line-inner">…</span></span>`, com overflow escondido na
 * linha externa para o efeito de cortina subindo.
 *
 * Uso pretendido: `components/SplitText.tsx` chama isto dentro de um efeito,
 * anima os `.oniria-line-inner` de y:100% a y:0%, e re-chama no resize
 * (debounce). O texto original fica em `data-original-text` para poder
 * restaurar sem split (reduced motion, ou limpeza no unmount).
 */

export interface SplitResult {
  lines: HTMLSpanElement[];
  words: HTMLSpanElement[];
}

export function splitIntoLines(container: HTMLElement, text: string): SplitResult {
  container.dataset.originalText = text;
  container.textContent = '';

  const words = text.split(/\s+/).filter(Boolean);
  const wordSpans: HTMLSpanElement[] = words.map((word, index) => {
    const span = document.createElement('span');
    span.textContent = word + (index < words.length - 1 ? ' ' : '');
    span.style.display = 'inline-block';
    container.appendChild(span);
    return span;
  });

  // Agrupa por offsetTop enquanto o fluxo ainda está "achatado".
  const rows: HTMLSpanElement[][] = [];
  let currentTop: number | null = null;

  for (const span of wordSpans) {
    const top = span.offsetTop;
    if (currentTop === null || Math.abs(top - currentTop) > 2) {
      rows.push([span]);
      currentTop = top;
    } else {
      rows[rows.length - 1]!.push(span);
    }
  }

  container.textContent = '';
  const lineInners: HTMLSpanElement[] = [];

  for (const row of rows) {
    const line = document.createElement('span');
    line.className = 'oniria-line';
    line.style.display = 'block';
    line.style.overflow = 'hidden';
    line.setAttribute('aria-hidden', 'true');

    const inner = document.createElement('span');
    inner.className = 'oniria-line-inner';
    inner.style.display = 'block';
    inner.style.willChange = 'transform';

    for (const word of row) inner.appendChild(word);
    line.appendChild(inner);
    container.appendChild(line);
    lineInners.push(inner);
  }

  return { lines: lineInners, words: wordSpans };
}

/** Restaura o texto plano — usado sob reduced-motion e na limpeza do efeito. */
export function restorePlainText(container: HTMLElement): void {
  const original = container.dataset.originalText;
  if (original !== undefined) container.textContent = original;
}
