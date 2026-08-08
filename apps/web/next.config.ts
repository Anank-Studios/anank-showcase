import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Imagem Docker enxuta: o `next build` emite um bundle auto-contido em
  // `.next/standalone`, sem precisar do node_modules inteiro no runtime.
  output: 'standalone',
  // Monorepo: sem isto o tracing enraíza em `apps/web` e deixa de fora os
  // pacotes do workspace (@anank/contracts) e o store do pnpm.
  outputFileTracingRoot: path.join(import.meta.dirname, '../..'),
  experimental: {
    // Habilita a View Transitions API nativa — usada pela demo Oniria
    // para o elemento compartilhado entre a listagem e o detalhe do protocolo.
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
};

export default nextConfig;
