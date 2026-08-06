import Image from 'next/image';
import type { ImageRef } from '@anank/contracts';
import { BLUR } from '@/shared/lib/blur';
import { cn } from '@/shared/lib/cn';
import { CredentialBadge } from './CredentialBadge';
import { RevealItem } from './RevealItem';

const ITEMS = [
  {
    key: 'avaliacao',
    title: 'Avaliação antes de qualquer aparelho',
    body: 'Toda indicação nasce de uma conversa com fotos, histórico de pele e expectativa real. Nenhum protocolo começa sem esse passo.',
    badge: 'Avaliação individual',
  },
  {
    key: 'protocolo',
    title: 'Protocolo escrito, com previsão de sessões',
    body: 'Você sai com um documento: quantas sessões, qual intervalo, o que esperar em cada etapa. Nada fica combinado só de boca.',
    badge: 'Protocolo por escrito',
  },
  {
    key: 'equipamento',
    title: 'Equipamentos com registro Anvisa',
    body: 'Cada aparelho usado nas três unidades tem registro sanitário conferível. Manutenção e calibração seguem cronograma documentado.',
    badge: 'Registro Anvisa',
  },
  {
    key: 'acompanhamento',
    title: 'Acompanhamento fotográfico padronizado',
    body: 'Fotos sempre na mesma luz, no mesmo ângulo, no mesmo equipamento. É como medimos progresso sem depender de memória.',
    badge: 'Padrão fotográfico',
  },
] as const;

export function DifferentialsSection({ images }: { images: Record<string, ImageRef> }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 lg:px-14 lg:py-28">
      <div className="flex flex-col gap-16 md:gap-24">
        {ITEMS.map((item, i) => {
          const image = images[item.key];
          if (!image) return null;
          const reversed = i % 2 === 1;

          return (
            <RevealItem key={item.key} index={i} className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8">
              <div
                className={cn(
                  'relative aspect-[4/3] overflow-hidden rounded-brand bg-line lg:col-span-6',
                  reversed && 'lg:order-2'
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 42vw, 92vw"
                  placeholder="blur"
                  blurDataURL={BLUR.vivace}
                  className="object-cover"
                />
              </div>
              <div className={cn('mt-6 lg:col-span-6 lg:mt-0', reversed && 'lg:order-1')}>
                <h3 className="text-display text-[26px]">{item.title}</h3>
                <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                  {item.body}
                </p>
                <CredentialBadge className="mt-6">{item.badge}</CredentialBadge>
              </div>
            </RevealItem>
          );
        })}
      </div>
    </section>
  );
}
