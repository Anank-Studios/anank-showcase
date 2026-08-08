'use client';

import { useState } from 'react';
import { themeCookie, type Theme } from '@/shared/lib/theme';

/**
 * Interruptor de tema do hub.
 *
 * `role="switch"` é a semântica exata: ligado = escuro. Um `<button>` comum com
 * `aria-pressed` descreveria "pressionado", que não é o que o controle diz.
 *
 * Aplica o atributo no `<html>` na hora e só então grava o cookie. A resposta
 * visual não espera round-trip; o cookie serve para o PRÓXIMO carregamento,
 * onde o servidor já entrega o HTML no tema certo — por isso não há flash.
 */
export function ThemeToggle({ initial }: { initial: Theme }) {
  const [theme, setTheme] = useState<Theme>(initial);
  const dark = theme === 'dark';

  function toggle() {
    const next: Theme = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.cookie = themeCookie(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      /* Rótulo do CONTROLE, não da ação: o estado quem dá é o aria-checked.
         Descrever a ação ("ativar modo claro") faria o leitor de tela anunciar
         uma coisa e o estado dizer o contrário. */
      aria-label="Modo escuro"
      onClick={toggle}
      className="group relative inline-flex h-9 w-[62px] shrink-0 cursor-pointer items-center rounded-full border border-line bg-surface transition-colors duration-300 hover:border-[color:var(--brand-accent)]"
    >
      {/* Os ícones ficam no trilho, atrás do botão — o que estiver sob o botão
          apaga, dando a leitura de "o tema atual é este". */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-[9px]">
        <SunIcon className={iconClass(!dark)} />
        <MoonIcon className={iconClass(dark)} />
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-[3px] size-7 -translate-y-1/2 rounded-full bg-[color:var(--brand-accent)] shadow-[0_2px_10px_-2px_var(--accent-glow)] transition-transform duration-300 ease-out"
        style={{ transform: `translateY(-50%) translateX(${dark ? 26 : 0}px)` }}
      />
    </button>
  );
}

/** O ícone sob o botão vira quase invisível; o outro fica em texto normal. */
function iconClass(active: boolean): string {
  return [
    'size-[15px] transition-opacity duration-300',
    active ? 'text-[color:var(--brand-bg)] opacity-90' : 'text-muted opacity-70',
  ].join(' ');
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}
