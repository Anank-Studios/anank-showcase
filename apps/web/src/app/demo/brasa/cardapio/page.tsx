import type { Metadata } from 'next';
import { BrasaCardapio } from '@/demos/brasa/BrasaCardapio';

export const metadata: Metadata = { title: 'Cardápio' };

export default function BrasaCardapioPage() {
  return <BrasaCardapio />;
}
