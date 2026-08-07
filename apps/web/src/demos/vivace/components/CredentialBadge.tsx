import { cn } from '@/shared/lib/cn';

/**
 * Selo de credencial — identidade obrigatória da Vivace.
 * Borda 1px accent-2 (dourado fosco), caixa alta, letter-spacing largo.
 */
export function CredentialBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'label-caps inline-flex items-center gap-2 rounded-brand border border-[color:var(--brand-accent-2)] px-3 py-1.5 text-[11px] tracking-[.14em] text-ink',
        className
      )}
    >
      {children}
    </span>
  );
}
