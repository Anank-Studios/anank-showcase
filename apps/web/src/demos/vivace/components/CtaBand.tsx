import Link from 'next/link';

export function CtaBand() {
  return (
    <section className="bg-accent py-16 text-center text-white md:py-20">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="text-display text-white">Comece pela avaliação, não pelo aparelho.</h2>
        <p className="mt-4 text-white/85">
          Conte o que você quer resolver. A gente diz o que é possível — e o que não é.
        </p>
        <Link
          href="/demo/vivace/contato"
          className="mt-8 inline-block rounded-brand bg-bg px-8 py-3.5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
        >
          Agendar avaliação
        </Link>
      </div>
    </section>
  );
}
