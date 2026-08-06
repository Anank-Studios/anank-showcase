import { Scaffold } from '@/demos/_scaffold/Scaffold';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <Scaffold slug="oniria" page={`/demo/oniria/protocolos/${slug}`} />;
}
