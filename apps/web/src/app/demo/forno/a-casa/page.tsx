import type { Metadata } from 'next';
import { FornoCasa } from '@/demos/forno/FornoCasa';

export const metadata: Metadata = { title: 'A casa' };

export default function FornoCasaPage() {
  return <FornoCasa />;
}
