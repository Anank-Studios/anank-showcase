import { Scaffold } from '@/demos/_scaffold/Scaffold';

/**
 * PONTO DE ENTRADA do detalhe do protocolo. Recebe o slug já resolvido.
 * O nome e a assinatura NÃO podem mudar.
 */
export async function OniriaProtocoloDetalhe({ slug }: { slug: string }) {
  return <Scaffold slug="oniria" page={`/demo/oniria/protocolos/${slug}`} />;
}
