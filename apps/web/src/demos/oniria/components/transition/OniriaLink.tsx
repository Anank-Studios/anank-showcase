'use client';

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { useOniriaNavigate } from './TransitionProvider';

type CursorLabel = 'VER' | 'ARRASTAR' | 'AGENDAR' | 'LER';

interface OniriaLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  cursorLabel?: CursorLabel;
  children: ReactNode;
}

/**
 * `<a href>` real. Clique simples (sem modificador, botão esquerdo) dispara
 * a transição cinematográfica via `navigate()`; Ctrl/Cmd/Shift/botão do meio
 * seguem o comportamento nativo (nova aba etc.).
 */
export function OniriaLink({ href, cursorLabel, onClick, children, ...rest }: OniriaLinkProps) {
  const navigate = useOniriaNavigate();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (modified) return;

    event.preventDefault();
    navigate(href);
  }

  return (
    <a href={href} onClick={handleClick} data-cursor={cursorLabel} {...rest}>
      {children}
    </a>
  );
}
