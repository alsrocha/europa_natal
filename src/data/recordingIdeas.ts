import type { CityId } from '../types'

export type IdeaStatus = 'ideia' | 'planejada' | 'gravada' | 'editada'

export interface RecordingIdea {
  id: string
  title: string
  description?: string
  /** Cidade onde gravar; vazio = qualquer lugar da viagem. */
  cityId?: CityId
  equipment?: string
  status: IdeaStatus
  createdAt: string
}

export const ideaStatusLabel: Record<IdeaStatus, string> = {
  ideia: 'Ideia',
  planejada: 'Planejada',
  gravada: 'Gravada',
  editada: 'Editada',
}

/** Ideias iniciais (aparecem em todos os aparelhos). As novas ficam salvas no aparelho. */
export const ideaSeeds: RecordingIdea[] = [
  {
    id: 'ideia-bastao-cinematic',
    title: 'Vídeo cinematic com o bastão da GoPro esticado',
    description:
      'Esticar o bastão da GoPro (uns 2 m) e fazer vários takes em vários lugares da viagem. Depois juntar tudo numa edição só, no estilo cinematic.',
    equipment: 'GoPro + bastão extensível (~2 m)',
    status: 'ideia',
    createdAt: '2026-10-25',
  },
]
