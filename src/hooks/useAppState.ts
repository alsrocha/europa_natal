import { ideaSeeds, type RecordingIdea } from '../data/recordingIdeas'
import type { AttractionStatus, Ticket } from '../types'
import { useLocalStorage } from './useLocalStorage'
import { ticketSeeds } from '../data/logistics'

export function useTheme() {
  const prefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const [theme, setTheme] = useLocalStorage<'claro' | 'escuro'>('tema', prefersDark ? 'escuro' : 'claro')
  return { theme, setTheme, toggle: () => setTheme(theme === 'escuro' ? 'claro' : 'escuro') }
}

/** Status das atrações (planejada/reservada/visitada/cancelada), por id. */
export function useAttractionStatus() {
  const [map, setMap] = useLocalStorage<Record<string, AttractionStatus>>('status-atracoes', {})
  const get = (id: string): AttractionStatus => map[id] ?? 'planejada'
  const set = (id: string, s: AttractionStatus) => setMap((m) => ({ ...m, [id]: s }))
  return { get, set, map }
}

export function useTickets() {
  const [stored, setTickets] = useLocalStorage<Ticket[]>('ingressos', ticketSeeds)
  const [removed, setRemoved] = useLocalStorage<string[]>('ingressos-removidos', [])
  // Ingressos novos do roteiro aparecem também em aparelhos que já tinham uma lista salva.
  const missing = ticketSeeds.filter((s) => !stored.some((x) => x.id === s.id) && !removed.includes(s.id))
  const tickets = missing.length ? [...stored, ...missing] : stored
  return {
    tickets,
    upsert: (t: Ticket) => setTickets(() => (tickets.some((x) => x.id === t.id) ? tickets.map((x) => (x.id === t.id ? t : x)) : [...tickets, t])),
    remove: (id: string) => {
      setRemoved((r) => [...r, id])
      setTickets(() => tickets.filter((x) => x.id !== id))
    },
    reset: () => {
      setRemoved([])
      setTickets(ticketSeeds)
    },
  }
}

export function useRecordingIdeas() {
  const [stored, setIdeas] = useLocalStorage<RecordingIdea[]>('ideias-gravacao', ideaSeeds)
  const [removed, setRemoved] = useLocalStorage<string[]>('ideias-removidas', [])
  const missing = ideaSeeds.filter((s) => !stored.some((x) => x.id === s.id) && !removed.includes(s.id))
  const ideas = missing.length ? [...missing, ...stored] : stored
  return {
    ideas,
    add: (d: Omit<RecordingIdea, 'id' | 'status' | 'createdAt'>) =>
      setIdeas(() => [{ ...d, id: `ideia-${Date.now().toString(36)}`, status: 'ideia', createdAt: new Date().toISOString().slice(0, 10) }, ...ideas]),
    update: (i: RecordingIdea) => setIdeas(() => ideas.map((x) => (x.id === i.id ? i : x))),
    remove: (id: string) => {
      setRemoved((r) => [...r, id])
      setIdeas(() => ideas.filter((x) => x.id !== id))
    },
    /** Mescla ideias de um arquivo exportado (o arquivo prevalece em ids repetidos). */
    importIdeas: (list: RecordingIdea[]) => setIdeas(() => [...list, ...ideas.filter((x) => !list.some((y) => y.id === x.id))]),
  }
}

export function useChecklist() {
  const [done, setDone] = useLocalStorage<Record<string, boolean>>('checklist', {})
  const [custom, setCustom] = useLocalStorage<Record<string, { id: string; label: string }[]>>('checklist-extra', {})
  return {
    done,
    toggle: (id: string) => setDone((d) => ({ ...d, [id]: !d[id] })),
    custom,
    addCustom: (cat: string, label: string) =>
      setCustom((c) => ({ ...c, [cat]: [...(c[cat] ?? []), { id: `x-${Date.now().toString(36)}`, label }] })),
    removeCustom: (cat: string, id: string) => setCustom((c) => ({ ...c, [cat]: (c[cat] ?? []).filter((x) => x.id !== id) })),
  }
}

/** Notas livres por cidade (observações e experiências). */
export function useCityNotes(cityId: string) {
  return useLocalStorage<string>(`notas-${cityId}`, '')
}
