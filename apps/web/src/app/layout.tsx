import type { Metadata, Viewport } from 'next';
import {
  Bodoni_Moda,
  DM_Serif_Display,
  Fraunces,
  Inter,
  Inter_Tight,
  JetBrains_Mono,
  Manrope,
  Poppins,
} from 'next/font/google';
import '@/styles/globals.css';

/* Uma única passada de fontes para as 4 marcas. Cada escopo [data-brand]
   escolhe quais variáveis usar — ver src/styles/globals.css. */

/* Anank Studios — tipografia oficial da marca (site-anank):
   Poppins como principal, JetBrains Mono para a camada técnica. */
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-dm-serif-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni-moda',
  display: 'swap',
});

const fontVars = [
  poppins.variable,
  jetbrainsMono.variable,
  interTight.variable,
  fraunces.variable,
  inter.variable,
  dmSerifDisplay.variable,
  manrope.variable,
  bodoniModa.variable,
].join(' ');

export const metadata: Metadata = {
  title: 'Anank Studios — Três níveis. Um padrão.',
  description:
    'Três demonstrações de sites para beleza e estética, do essencial bem-feito ao que se espera de uma marca de luxo. Portfólio da Anank Studios.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F7F7F7',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
