import { useId, useRef, useState } from 'react'
import { Clapperboard, Download, Pencil, Plus, Trash2, Upload } from 'lucide-react'
import { cities, cityById } from '../data/cities'
import { ideaStatusLabel, type IdeaStatus, type RecordingIdea } from '../data/recordingIdeas'
import { useRecordingIdeas } from '../hooks/useAppState'
import { EmptyState, PageHeader, Pill } from '../components/ui'
import { downloadFile, readFileAsText } from '../utils/download'
import type { CityId } from '../types'

const statuses = Object.keys(ideaStatusLabel) as IdeaStatus[]
const statusCls: Record<IdeaStatus, string> = {
  ideia: 'bg-surface-2',
  planejada: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100',
  gravada: 'bg-teal-100 text-teal-900 dark:bg-teal-900/50 dark:text-teal-100',
  editada: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100',
}

type Draft = Pick<RecordingIdea, 'title' | 'description' | 'cityId' | 'equipment'>
const emptyDraft: Draft = { title: '', description: '', cityId: undefined, equipment: '' }

function IdeaForm({ initial, onSave, onCancel }: { initial: Draft; onSave: (d: Draft) => void; onCancel?: () => void }) {
  const [d, setD] = useState<Draft>(initial)
  const id = useId()
  const field = 'surface mt-1 min-h-[44px] w-full rounded-xl px-3 text-sm'
  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (!d.title.trim()) return
        onSave({ ...d, title: d.title.trim(), description: d.description?.trim(), equipment: d.equipment?.trim() })
        if (!onCancel) setD(emptyDraft)
      }}
    >
      <label className="text-sm font-medium" htmlFor={`${id}-t`}>
        Ideia
        <input id={`${id}-t`} required value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="Ex.: timelapse do mercado de Natal ao anoitecer" className={field} />
      </label>
      <label className="text-sm font-medium" htmlFor={`${id}-d`}>
        Detalhes
        <textarea id={`${id}-d`} rows={3} value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} placeholder="Como gravar, enquadramento, música, roteiro…" className={`${field} py-2`} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium" htmlFor={`${id}-c`}>
          Onde
          <select id={`${id}-c`} value={d.cityId ?? ''} onChange={(e) => setD({ ...d, cityId: (e.target.value || undefined) as CityId | undefined })} className={field}>
            <option value="">Qualquer lugar da viagem</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium" htmlFor={`${id}-e`}>
          Equipamento
          <input id={`${id}-e`} value={d.equipment} onChange={(e) => setD({ ...d, equipment: e.target.value })} placeholder="GoPro, celular, drone…" className={field} />
        </label>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary btn-sm">
          {onCancel ? 'Salvar' : (
            <>
              <Plus className="h-4 w-4" aria-hidden /> Adicionar ideia
            </>
          )}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export function IdeasPage() {
  const { ideas, add, update, remove, importIdeas } = useRecordingIdeas()
  const [filter, setFilter] = useState<IdeaStatus | 'todas'>('todas')
  const [editing, setEditing] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const shown = ideas.filter((i) => filter === 'todas' || i.status === filter)

  return (
    <>
      <PageHeader eyebrow="Destino & História" title="Ideias de gravação">
        Anote aqui, ao longo do tempo, as ideias de vídeos e takes para gravar na viagem. As ideias novas ficam salvas neste aparelho; use “Exportar” e “Importar” para levar a outro aparelho.
      </PageHeader>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:px-8 lg:grid-cols-[1fr_22rem]">
        <section aria-label="Lista de ideias">
          <div className="mb-4 flex flex-wrap gap-2">
            <Pill active={filter === 'todas'} onClick={() => setFilter('todas')}>
              Todas ({ideas.length})
            </Pill>
            {statuses.map((s) => (
              <Pill key={s} active={filter === s} onClick={() => setFilter(s)}>
                {ideaStatusLabel[s]} ({ideas.filter((i) => i.status === s).length})
              </Pill>
            ))}
          </div>
          {shown.length === 0 ? (
            <EmptyState icon={<Clapperboard className="h-8 w-8" aria-hidden />} title="Nenhuma ideia aqui ainda">
              Use o formulário para anotar a próxima.
            </EmptyState>
          ) : (
            <ul className="grid gap-3">
              {shown.map((i) => (
                <li key={i.id} className="surface rounded-2xl p-5">
                  {editing === i.id ? (
                    <IdeaForm
                      initial={{ title: i.title, description: i.description ?? '', cityId: i.cityId, equipment: i.equipment ?? '' }}
                      onSave={(d) => {
                        update({ ...i, ...d })
                        setEditing(null)
                      }}
                      onCancel={() => setEditing(null)}
                    />
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <Clapperboard className="mt-1 h-5 w-5 shrink-0 text-petrol" aria-hidden />
                        <div className="min-w-0 flex-1">
                          <h2 className="text-xl font-semibold leading-snug">{i.title}</h2>
                          <p className="text-2 mt-0.5 text-xs">
                            {i.cityId ? cityById[i.cityId].name : 'Qualquer lugar da viagem'}
                            {i.equipment && ` · ${i.equipment}`}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${statusCls[i.status]}`}>{ideaStatusLabel[i.status]}</span>
                      </div>
                      {i.description && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{i.description}</p>}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <label className="sr-only" htmlFor={`st-${i.id}`}>
                          Situação de {i.title}
                        </label>
                        <select id={`st-${i.id}`} value={i.status} onChange={(e) => update({ ...i, status: e.target.value as IdeaStatus })} className="surface min-h-[40px] rounded-xl px-3 text-sm">
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {ideaStatusLabel[s]}
                            </option>
                          ))}
                        </select>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(i.id)}>
                          <Pencil className="h-4 w-4" aria-hidden /> Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => confirm(`Apagar a ideia “${i.title}”?`) && remove(i.id)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden /> Apagar
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
        <aside className="order-first space-y-4 lg:order-none">
          <section className="surface rounded-2xl p-5" aria-labelledby="nova-ideia">
            <h2 id="nova-ideia" className="mb-3 text-2xl font-semibold">
              Nova ideia
            </h2>
            <IdeaForm initial={emptyDraft} onSave={add} />
          </section>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => downloadFile('ideias-de-gravacao.json', JSON.stringify(ideas, null, 2))}>
              <Download className="h-4 w-4" aria-hidden /> Exportar
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" aria-hidden /> Importar
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                e.target.value = ''
                if (!f) return
                try {
                  const data = JSON.parse(await readFileAsText(f))
                  if (!Array.isArray(data)) throw new Error()
                  importIdeas(data.filter((x) => x && typeof x.id === 'string' && typeof x.title === 'string'))
                } catch {
                  alert('Arquivo inválido. Use um arquivo exportado nesta página.')
                }
              }}
            />
          </div>
        </aside>
      </div>
    </>
  )
}
