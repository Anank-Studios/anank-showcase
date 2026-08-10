'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, type ComponentProps } from 'react';

/**
 * Link que só baixa a próxima rota quando o visitante demonstra INTENÇÃO.
 *
 * O `<Link>` do Next prefetcha assim que entra na viewport. No hub isso era
 * caro: a página tem 17 kB de HTML e disparava 106 kB de prefetch para as três
 * demos (Aurea 46, Vivace 35, Oniria 25) — seis vezes o próprio peso, para
 * conteúdo que o visitante talvez nunca abra. Ele escolhe UMA demo.
 *
 * Desligar o prefetch e parar aí deixaria a navegação lenta. Então ele é
 * adiado, não removido: dispara no primeiro hover, foco por teclado ou toque.
 * Na prática o download começa centenas de milissegundos antes do clique, que
 * é tempo suficiente para a troca continuar parecendo imediata — e quem só
 * passa os olhos no hub não baixa nada.
 *
 * `once`: o router do Next já deduplica, mas sem a trava um mouse parado sobre
 * o card dispara `onMouseEnter` a cada re-render.
 */
export function IntentLink({
  href,
  onMouseEnter,
  onFocus,
  onTouchStart,
  ...rest
}: ComponentProps<typeof Link>) {
  const router = useRouter();
  const jaPediu = useRef(false);

  function prefetch() {
    if (jaPediu.current) return;
    jaPediu.current = true;
    router.prefetch(String(href));
  }

  return (
    <Link
      href={href}
      /* Desliga só o prefetch automático por viewport. */
      prefetch={false}
      onMouseEnter={(e) => {
        prefetch();
        onMouseEnter?.(e);
      }}
      /* `onFocus` cobre navegação por teclado, que não gera hover nenhum. */
      onFocus={(e) => {
        prefetch();
        onFocus?.(e);
      }}
      /* No celular não existe hover: `touchstart` chega antes do clique. */
      onTouchStart={(e) => {
        prefetch();
        onTouchStart?.(e);
      }}
      {...rest}
    />
  );
}
