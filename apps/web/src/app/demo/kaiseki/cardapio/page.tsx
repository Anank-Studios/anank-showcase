import type { Metadata } from 'next';
import { KaisekiCardapio } from '@/demos/kaiseki/KaisekiCardapio';

export const metadata: Metadata = { title: 'Cardápio' };

export default function KaisekiCardapioPage() {
  return <KaisekiCardapio />;
}
