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
      /*
        O trilho precisa SER VISÍVEL — antes ele não era, e o controle lia como
        uma bolinha verde solta no ar. `border-line` sobre o fundo da página dá
        1.29:1 no escuro e 1.15:1 no claro; o mínimo para contorno de componente
        é 3:1. O Lighthouse não reprova isso (ele não audita contraste de
        elemento não-textual), então só se pega no olho.

        Derivar do `--brand-muted`, que já é validado, resolve os dois temas com
        um valor só: 80% dá 5.9:1 no escuro e 3.6:1 no claro. O preenchimento a
        14% é só para o trilho ter corpo — quem garante o contorno é a borda.
      */
      style={
        {
          /* Vai numa VARIÁVEL, não em `borderColor` direto: estilo inline vence
             classe, e o `hover:` deixaria de funcionar. */
          '--track-line': 'color-mix(in srgb, var(--brand-muted) 80%, var(--brand-bg))',
          background: 'color-mix(in srgb, var(--brand-muted) 14%, var(--brand-bg))',
        } as React.CSSProperties
      }
      className="group relative inline-flex h-9 w-[62px] shrink-0 cursor-pointer items-center rounded-full border border-[color:var(--track-line)] transition-colors duration-300 hover:border-[color:var(--brand-accent)]"
    >
      {/*
        Geometria em pixel, sem porcentagem. A versão anterior usava
        `top-1/2` + `translateY(-50%)` e o botão saía 10px POR CIMA do trilho:
        o `top: 50%` não pegava, o elemento caía na posição estática do flex
        (3px) e ainda levava os -14px do translate. Medido, não suposto.

        Trilho 62x36 com borda de 1px → caixa interna de 60x34.
        Botão 28px, folga de 3px nos quatro lados; percurso = 60-28-3-3 = 26px.
      */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[3px] left-[3px] flex size-7 items-center justify-center rounded-full bg-[color:var(--brand-accent)] shadow-[0_2px_10px_-2px_var(--accent-glow)] transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${dark ? 26 : 0}px)` }}
      >
        {/*
          O ícone mora DENTRO do botão, e por isso sempre mostra o tema ATUAL.
          Antes ele ficava no trilho e o botão cobria um dos dois: no escuro
          sobrava o sol à vista, o que se lê como "clique para clarear" — visual
          de AÇÃO enquanto o `aria-checked` anuncia ESTADO. Metáfora misturada.

          Pinho fixo (#1c3a2d, cor oficial) nos dois temas: o botão é sempre
          verde Anank, então o ícone precisa de contraste contra o VERDE e não
          contra o fundo da página — 4.5:1, acima dos 3:1 exigidos para gráfico.
          Usar `--brand-ink` daria 2.6:1 no claro.
        */}
        {dark ? (
          <MoonIcon className="size-[15px] text-[#1c3a2d]" />
        ) : (
          <SunIcon className="size-[15px] text-[#1c3a2d]" />
        )}
      </span>
    </button>
  );
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
