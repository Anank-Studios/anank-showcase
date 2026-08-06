import { cn } from '@/shared/lib/cn';
import { RevealItem } from './RevealItem';

const MILESTONES = [
  {
    year: 2014,
    title: 'Fundação em Curitiba',
    body: 'A Vivace abre as portas no Batel, com atendimento inteiramente facial.',
  },
  {
    year: 2017,
    title: 'Primeira sala de laser',
    body: 'Depilação a laser entra no portfólio, com sala dedicada e climatizada.',
  },
  {
    year: 2019,
    title: 'Unidade Joinville',
    body: 'A segunda unidade chega a Santa Catarina, replicando o mesmo protocolo de avaliação.',
  },
  {
    year: 2021,
    title: 'Protocolo fotográfico padronizado',
    body: 'Passamos a registrar cada tratamento com luz e ângulo padronizados, para medir evolução de verdade.',
  },
  {
    year: 2023,
    title: 'Unidade Florianópolis',
    body: 'A terceira unidade abre no Centro, completando a presença nas três capitais do Sul.',
  },
  {
    year: 2025,
    title: '40 mil atendimentos',
    body: 'Alcançamos a marca de 40 mil atendimentos realizados nas três unidades.',
  },
  {
    year: 2026,
    title: 'Centro de formação interno',
    body: 'Criamos um centro de formação para padronizar o treinamento técnico entre as equipes.',
  },
] as const;

export function Timeline() {
  return (
    <div className="relative">
      <div className="absolute left-4 top-2 h-[calc(100%-1rem)] w-px bg-line lg:left-1/2" aria-hidden="true" />

      <ol className="flex flex-col gap-12">
        {MILESTONES.map((milestone, i) => {
          const rightSide = i % 2 === 1;
          return (
            <li key={milestone.year} className="relative pl-12 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:pl-0">
              <span
                className="absolute left-4 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent lg:left-1/2"
                aria-hidden="true"
              />
              <RevealItem
                index={i}
                className={cn(rightSide ? 'lg:col-start-2 lg:pl-12 lg:text-left' : 'lg:col-start-1 lg:pr-12 lg:text-right')}
              >
                <p className="text-display text-[22px] text-accent">{milestone.year}</p>
                <h3 className="mt-1 text-lg font-medium">{milestone.title}</h3>
                <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted lg:ml-auto">
                  {milestone.body}
                </p>
              </RevealItem>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
