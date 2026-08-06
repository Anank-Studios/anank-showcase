'use client';

import { useEffect, useState } from 'react';
import type { Demo } from '@anank/contracts';
import { cn } from '@/shared/lib/cn';
import { whatsappLink } from '../lib/format';
import { CloseIcon, MenuIcon, WhatsappIcon } from './icons';

const LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#transformacoes', label: 'Transformações' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' },
];

/**
 * Header sticky. Ganha blur/sombra depois de 80px de scroll — listener
 * `scroll` com `{ passive: true }`, nunca `useScroll` do Motion (proibido
 * nesta demo, ver specs/10-demo-aurea.md).
 */
export function Header({ demo }: { demo: Demo }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const [firstName, ...rest] = demo.brandName.split(' ');
  const suffix = rest.join(' ').toUpperCase();
  const wa = whatsappLink(demo.whatsapp, 'Oi! Vim pelo site do Aurea e quero agendar um horário.');

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-250',
        scrolled
          ? 'border-b border-line bg-[rgb(251_247_242_/_0.82)] shadow-[0_1px_0_0_rgb(42_33_28_/_0.04)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-10 lg:h-20 lg:px-14">
        <a href="#topo" className="flex flex-col leading-none">
          <span className="font-display text-[22px] font-medium text-ink">{firstName}</span>
          <span
            className="mt-0.5 text-[9px] font-medium text-muted"
            style={{ letterSpacing: '.22em' }}
          >
            {suffix}
          </span>
        </a>

        <nav aria-label="Navegação principal" className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-1 text-sm font-medium text-ink"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-250 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-brand bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-[transform,box-shadow] duration-250 hover:-translate-y-0.5 hover:shadow-brand"
          >
            <WhatsappIcon className="size-4" />
            Agendar no WhatsApp
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile-aurea"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex size-10 items-center justify-center rounded-full text-ink transition-colors duration-250 hover:bg-surface lg:hidden"
        >
          {menuOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      <div
        id="menu-mobile-aurea"
        className={cn(
          'fixed inset-0 top-16 z-30 bg-bg transition-[opacity,transform] duration-250 lg:hidden',
          menuOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        )}
      >
        <nav
          aria-label="Navegação mobile"
          className="flex h-full flex-col justify-center gap-8 px-8 pb-20"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-[2.25rem] font-medium text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-brand bg-accent px-6 py-3.5 text-base font-medium text-bg"
          >
            <WhatsappIcon className="size-5" />
            Agendar no WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
