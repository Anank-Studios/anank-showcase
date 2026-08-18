import type { Metadata } from 'next';
import { KaisekiSacola } from '@/demos/kaiseki/KaisekiSacola';

export const metadata: Metadata = { title: 'Sacola' };

export default function KaisekiSacolaPage() {
  return <KaisekiSacola />;
}
