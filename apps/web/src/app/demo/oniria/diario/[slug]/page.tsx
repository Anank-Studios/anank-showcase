import { OniriaArtigo } from '@/demos/oniria/OniriaArtigo';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <OniriaArtigo slug={slug} />;
}
