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
    /*
      SÓ WebP. O AVIF foi tentado e teve que sair — medido em produção:

        Accept: image/avif,image/webp   ->  JPEG   395.798 bytes
        Accept: image/webp              ->  WebP    25.482 bytes

      Aqueles 395.798 bytes são, byte a byte, o arquivo original do Unsplash: a
      codificação AVIF FALHA neste container (1 CPU e 768 MB, ver
      docker-compose.yml) e o Next cai no passthrough, servindo a foto sem
      otimização alguma. Como todo navegador moderno anuncia `image/avif`,
      quase todo visitante recebia 15x mais bytes do que precisava.

      Na máquina de desenvolvimento o AVIF funciona, e foi por isso que passou:
      o defeito só existe sob o limite de CPU da VPS. Aumentar o limite para
      recuperar o AVIF não compensa — o WebP já entrega 25 kB.
    */
    formats: ['image/webp'],
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
