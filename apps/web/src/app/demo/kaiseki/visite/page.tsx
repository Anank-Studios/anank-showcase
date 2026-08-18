import type { Metadata } from 'next';
import { KaisekiVisite } from '@/demos/kaiseki/KaisekiVisite';

export const metadata: Metadata = { title: 'A casa' };

export default function KaisekiVisitePage() {
  return <KaisekiVisite />;
}
