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
    /* AVIF antes de WebP: negociado pelo header `Accept`, então navegador que
       não suporta cai no WebP sozinho. Numa vitrine que é quase toda fotografia
       — 1.357 kB só na home da Oniria — é o corte de bytes mais barato que
       existe, sem tocar em componente nenhum. */
    formats: ['image/avif', 'image/webp'],
    /*
      O padrão do Next vai até 3840. As fotos do banco são servidas em `w=1600`,
      então pedir 3840 mandava o otimizador AMPLIAR a imagem: mais bytes para
      entregar menos nitidez. Teto em 1920, acima da fonte e suficiente para
      tela retina.
    */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    /* As fotos são fixas e fictícias; nunca mudam. */
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
