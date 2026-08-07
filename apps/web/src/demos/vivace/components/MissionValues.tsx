import { RevealItem } from './RevealItem';

const BLOCKS = [
  {
    label: 'Missão',
    text: 'Entregar avaliação individual, protocolo escrito e resultado mensurável — sem prometer o que a pele não pode cumprir.',
  },
  {
    label: 'Visão',
    text: 'Ser referência em estética avançada no Sul do Brasil, com o mesmo padrão técnico em Curitiba, Joinville e Florianópolis.',
  },
  {
    label: 'Valores',
    text: 'Avaliação antes de qualquer aparelho, biossegurança sem atalho e transparência sobre o resultado esperado.',
  },
] as const;

export function MissionValues() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {BLOCKS.map((block, i) => (
        <RevealItem
          key={block.label}
          index={i}
          className="grid grid-cols-1 gap-3 py-8 md:grid-cols-[200px_1fr] md:gap-8 md:py-10"
        >
          <p className="label-caps text-accent">{block.label}</p>
          <p className="max-w-[60ch] text-lg leading-relaxed">{block.text}</p>
        </RevealItem>
      ))}
    </div>
  );
}
