import { getDemo, getTeam } from '@/shared/lib/api';
import { OniriaFooter, OniriaNav } from './components/OniriaNav';
import { SplitText } from './components/SplitText';
import { TeamPortrait } from './components/TeamPortrait';

export async function OniriaEquipe() {
  const [demo, team] = await Promise.all([getDemo('oniria'), getTeam('oniria')]);

  return (
    <div className="relative">
      <OniriaNav />

      <section className="px-5 pt-40 pb-16 md:px-10 md:pt-52 lg:px-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-caps text-accent">Equipe</p>
          <SplitText
            text="Seis pessoas. Uma unidade. Por escolha."
            as="h1"
            className="mt-6 max-w-[16ch] font-display text-[clamp(2.25rem,9vw,6rem)] leading-[0.96]"
          />
        </div>
      </section>

      <section className="px-5 pb-28 md:px-10 lg:px-14">
        <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 lg:gap-x-8">
          {team.map((member) => (
            <li key={member.id}>
              <TeamPortrait photo={member.photo} alt={member.photo.alt} />
              <h2 className="mt-5 font-display text-lg leading-tight md:text-2xl">{member.name}</h2>
              <p className="label-caps mt-2 text-accent">{member.role}</p>
              {member.registry ? (
                <p className="label-caps mt-1 text-muted">{member.registry}</p>
              ) : null}
              <p className="mt-3 text-[13px] leading-relaxed text-muted md:text-sm">{member.bio}</p>
            </li>
          ))}
        </ul>
      </section>

      <OniriaFooter legalName={demo.legalName} cnpj={demo.cnpj} address={demo.address} />
    </div>
  );
}
