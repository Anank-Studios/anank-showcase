import { Scaffold } from '@/demos/_scaffold/Scaffold';

/**
 * PONTO DE ENTRADA da demo — o orquestrador importa este componente em
 * `app/demo/...`. O nome e a assinatura NÃO podem mudar.
 *
 * Substitua o corpo pelo conteúdo real da demo. Ver specs/.
 */
export async function OniriaProtocolos() {
  return <Scaffold slug="oniria" page="/demo/oniria/protocolos" />;
}
