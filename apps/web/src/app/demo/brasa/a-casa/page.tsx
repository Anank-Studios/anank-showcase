import type { Metadata } from 'next';
import { BrasaCasa } from '@/demos/brasa/BrasaCasa';

export const metadata: Metadata = { title: 'A casa' };

export default function BrasaCasaPage() {
  return <BrasaCasa />;
}
