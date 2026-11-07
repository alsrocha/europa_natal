export interface Tip {
  id: string
  title: string
  category: 'alimentacao' | 'transporte' | 'dinheiro' | 'tecnologia' | 'geral'
  summary: string
  howTo?: string[]
  forTheTrip?: string[]
  links?: { label: string; url: string }[]
  /** O que ainda precisa ser conferido (nada aqui é presumido). */
  toConfirm?: string
}

export const tipCategoryLabel: Record<Tip['category'], string> = {
  alimentacao: 'Alimentação',
  transporte: 'Transporte',
  dinheiro: 'Dinheiro',
  tecnologia: 'Tecnologia',
  geral: 'Geral',
}

/** Dicas da viagem. Para incluir uma nova, acrescente um item a esta lista. */
export const tips: Tip[] = [
  {
    id: 'too-good-to-go',
    title: 'Too Good To Go',
    category: 'alimentacao',
    summary:
      'Aplicativo em que restaurantes, padarias, cafés e mercados vendem a comida que sobrou no dia, com desconto, perto do horário de fechar. A compra vem numa “sacola surpresa”: você sabe o tipo de estabelecimento, mas não escolhe exatamente os itens.',
    howTo: [
      'Baixar o app e criar a conta antes da viagem.',
      'Em cada cidade, ajustar a localização e ver as ofertas próximas ao hotel ou ao passeio do dia.',
      'Reservar e pagar pelo próprio app.',
      'Retirar no estabelecimento dentro da janela de horário indicada, mostrando a reserva no celular.',
    ],
    forTheTrip: [
      'Boa opção para o jantar depois dos mercados de Natal ou para o café da manhã do dia seguinte (padarias e confeitarias).',
      'Conferir se a janela de retirada combina com a programação do dia antes de reservar.',
      'Útil nos dias de trem: dá para pegar a sacola na véspera e levar como lanche.',
    ],
    links: [{ label: 'Site oficial', url: 'https://www.toogoodtogo.com/' }],
    toConfirm: 'a quantidade de ofertas varia por cidade e por dia; conferir no app em Barcelona, Paris, Colmar, Strasbourg, Luxemburgo e Madrid.',
  },
]
