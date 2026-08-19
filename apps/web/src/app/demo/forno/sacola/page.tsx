import type { Metadata } from 'next';
import { FornoSacola } from '@/demos/forno/FornoSacola';

export const metadata: Metadata = { title: 'Sacola' };

export default function FornoSacolaPage() {
  return <FornoSacola />;
}
