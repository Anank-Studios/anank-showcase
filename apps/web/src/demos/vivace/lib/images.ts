import type { ImageRef } from '@anank/contracts';

/**
 * Lê uma imagem de `Demo['images']` (Record<string, ImageRef>) com segurança
 * de tipos sob `noUncheckedIndexedAccess`. As chaves usadas aqui são sempre
 * as que `apps/api/src/data/vivace.ts` garante existir — se uma faltar é bug
 * de dados, não algo para silenciar.
 */
export function pickImage(images: Record<string, ImageRef>, key: string): ImageRef {
  const image = images[key];
  if (!image) {
    throw new Error(`Imagem "${key}" não encontrada em demo.images (vivace).`);
  }
  return image;
}

export function pickImages(images: Record<string, ImageRef>, keys: string[]): ImageRef[] {
  return keys.map((key) => pickImage(images, key));
}
