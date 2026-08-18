import type { Metadata } from 'next';
import { FornoCardapio } from '@/demos/forno/FornoCardapio';

export const metadata: Metadata = { title: 'Cardápio' };

export default function FornoCardapioPage() {
  return <FornoCardapio />;
}
