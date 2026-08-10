import { vivaceFonts } from '@/app/fonts';

/**
 * Cobre `/demo/vivace` e as três rotas filhas (serviços, sobre, contato):
 * todas carregam Newsreader e Manrope, e só elas.
 */
export default function VivaceLayout({ children }: { children: React.ReactNode }) {
  return <div className={vivaceFonts}>{children}</div>;
}
