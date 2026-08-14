import { fornoFonts } from '@/app/fonts/forno';

/** Só o Forno carrega Instrument Serif e Inter Tight. Ver `app/fonts/`. */
export default function FornoLayout({ children }: { children: React.ReactNode }) {
  return <div className={fornoFonts}>{children}</div>;
}
