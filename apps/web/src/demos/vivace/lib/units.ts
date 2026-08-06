/**
 * As 3 unidades da Vivace. Endereços e telefones fictícios — a base (cidade,
 * endereço da matriz) vem de specs/11-demo-vivace.md; o restante (telefone,
 * horário por unidade) foi completado aqui porque o contrato `Demo` só modela
 * um endereço/telefone únicos, não uma lista de unidades. Não há endpoint na
 * API para isso, então este conteúdo é local à demo (não é fetch de dado —
 * é copy editorial fixo, como o restante do texto institucional da página).
 *
 * As fotos usam as chaves de `Demo['images']`, que essas SIM vêm da API.
 */
export interface VivaceUnit {
  slug: string;
  city: string;
  matriz?: boolean;
  address: string;
  phone: string;
  whatsapp: string;
  hours: string;
  imageKey: string;
}

export const VIVACE_UNITS: VivaceUnit[] = [
  {
    slug: 'curitiba',
    city: 'Curitiba',
    matriz: true,
    address: 'Rua Comendador Araújo, 611 · Batel · Curitiba · PR',
    phone: '(41) 3016-7788',
    whatsapp: '5541988203344',
    hours: 'Seg–sex 8h–20h · Sáb 8h–14h',
    imageKey: 'unidadeCuritiba',
  },
  {
    slug: 'joinville',
    city: 'Joinville',
    address: 'Rua Otto Boehm, 380 · América · Joinville · SC',
    phone: '(47) 3422-5511',
    whatsapp: '5547988201122',
    hours: 'Seg–sex 8h–19h · Sáb 8h–13h',
    imageKey: 'unidadeJoinville',
  },
  {
    slug: 'florianopolis',
    city: 'Florianópolis',
    address: 'Av. Rio Branco, 404 · Centro · Florianópolis · SC',
    phone: '(48) 3225-9090',
    whatsapp: '5548988203030',
    hours: 'Seg–sex 8h–19h · Sáb 8h–13h',
    imageKey: 'unidadeFloripa',
  },
];
