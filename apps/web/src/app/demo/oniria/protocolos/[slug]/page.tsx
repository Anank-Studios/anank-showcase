import { OniriaProtocoloDetalhe } from '@/demos/oniria/OniriaProtocoloDetalhe';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <OniriaProtocoloDetalhe slug={slug} />;
}
