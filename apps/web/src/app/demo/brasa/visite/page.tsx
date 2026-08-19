import type { Metadata } from 'next';
import { BrasaVisite } from '@/demos/brasa/BrasaVisite';

export const metadata: Metadata = { title: 'Visite' };

export default function BrasaVisitePage() {
  return <BrasaVisite />;
}
