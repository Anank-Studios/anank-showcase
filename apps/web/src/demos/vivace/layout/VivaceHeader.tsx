'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/shared/lib/cn';
import { useLenis } from '../lib/useLenis';
import { CloseIcon, MenuIcon } from '../components/icons';

const NAV_LINKS = [
  { href: '/demo/vivace/servicos', label: 'Serviços' },
  { href: '/demo/vivace/sobre', label: 'Sobre' },
  { href: '/demo/vivace#unidades', label: 'Unidades' },
  { href: '/demo/vivace/contato', label: 'Contato' },
];

const FOCUSABLE = 'a[href], button:not([disabled])';

function NavLink({
  href,
  label,
  active,
  onNavigate,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn('group relative inline-block py-1', className)}
      aria-current={active ? 'page' : undefined}
    >
      {label}
      <span
        className={cn(
          'absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-[220ms] ease-out',
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        )}
      />
    </Link>
  );
}

export function VivaceHeader() {
  useLenis();

  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => {
    const clean = href.split('#')[0] ?? href;
    if (clean === '/demo/vivace') return pathname === '/demo/vivace';
    return pathname.startsWith(clean);
  };

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusables?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  // Fecha ao navegar.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-10 lg:px-14">
        <Link href="/demo/vivace" className="flex flex-col leading-none">
          <span className="text-display text-[24px]">VIVACE</span>
          <span className="label-caps mt-0.5 text-[9px] tracking-[.2em] text-[#636e67]">
            ESTÉTICA AVANÇADA
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={isActive(link.href)}
            />
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/demo/vivace/contato"
            className="hidden rounded-brand bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 md:inline-block"
          >
            Agendar avaliação
          </Link>

          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls="vivace-mobile-menu"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
            className="rounded-brand border border-line p-2 text-ink md:hidden"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.button
              type="button"
              aria-label="Fechar menu"
              className="absolute inset-0 bg-ink/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
            />
            <motion.div
              id="vivace-mobile-menu"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              className="absolute inset-y-0 right-0 flex w-[88vw] max-w-sm flex-col bg-surface"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <span className="text-display text-[20px]">VIVACE</span>
                <button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={close}
                  className="rounded-brand border border-line p-2"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-6 px-6 py-8" aria-label="Navegação móvel">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className="text-display text-[28px]"
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-line p-6">
                <Link
                  href="/demo/vivace/contato"
                  onClick={close}
                  className="block rounded-brand bg-accent px-5 py-3 text-center text-sm font-medium text-bg"
                >
                  Agendar avaliação
                </Link>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
