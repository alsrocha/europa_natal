import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, CheckSquare, Gift, Hourglass, NotebookPen, Ticket, TrainFront, Sparkles } from 'lucide-react'
import { baseCities, cities, TOTAL_NIGHTS } from '../data/cities'
import { itinerary } from '../data/itinerary'
import { transport, checklist } from '../data/logistics'
import { cityHero } from '../data/photos'
import { tripPhase, localTime } from '../utils/dates'
import { useNow } from '../hooks/useMisc'
import { useChecklist, useTickets } from '../hooks/useAppState'
import { TripTimeline } from '../components/TripTimeline'
import { ShareButton } from '../components/ShareButton'
import { DayView, dayLabel } from '../components/DayView'
import { PhotoView, SectionTitle, Stat } from '../components/ui'

export function HomePage() {
  const now = useNow()
  const phase = tripPhase(now)
  const { tickets } = useTickets()
  const { done } = useChecklist()
  const pendingTickets = tickets.filter((t) => ['nao-pesquisado', 'pendente', 'em-analise'].includes(t.status)).length
  const pendingTransport = transport.filter((t) => t.status === 'pendente').length
  const allItems = checklist.flatMap((c) => c.items)
  const doneCount = allItems.filter((i) => done[i.id]).length
  const hero = cityHero('strasbourg')

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-navy text-cream">
        <div className="absolute inset-0 -z-10">
          {hero ? (
            <img src={hero.src} alt={hero.alt} className="h-full w-full object-cover opacity-55" />
          ) : (
            <div className="twinkle-dots h-full w-full bg-gradient-to-br from-navy via-navy-2 to-petrol" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-16 md:px-8 md:pb-20 md:pt-28">
          <p className="fade-in mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">26 de novembro — 20 de dezembro de 2026</p>
          <h1 className="fade-in max-w-3xl text-5xl font-semibold leading-[1.02] md:text-7xl">
            Europa Natal 2026
            <span className="block text-3xl italic text-gold md:text-5xl">Destino &amp; História</span>
          </h1>
          <p className="fade-in mt-3 font-display text-2xl text-cream md:text-3xl">
            <span aria-hidden className="mr-2 text-gold">✦</span>André &amp; Ricardo
          </p>
          <p className="fade-in mt-5 max-w-2xl text-lg text-cream/85">
            Uma viagem entre cidades históricas, mercados de Natal, arquitetura, cultura e gastronomia — Espanha, França, Alemanha e Luxemburgo.
          </p>
          <div className="fade-in mt-7 flex flex-wrap gap-3">
            <Link to="/hoje" className="btn bg-gold text-navy hover:bg-[#d6b77f]">
              <Sparkles className="h-4 w-4" aria-hidden /> Programação de hoje
            </Link>
            <Link to="/roteiro" className="btn border border-cream/40 text-cream hover:bg-white/10">
              <CalendarDays className="h-4 w-4" aria-hidden /> Roteiro completo
            </Link>
            <ShareButton
              variant="light"
              title="Europa Natal 2026 — André & Ricardo"
              text="Nosso roteiro pelos mercados de Natal da Europa, de 26/11 a 20/12/2026."
              url={window.location.href.split('#')[0]}
            />
          </div>
          {hero && <p className="mt-6 text-[10px] text-cream/60">Foto: {hero.author ?? 'ver créditos'} · {hero.license}</p>}
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 pt-8 md:px-8">
        {/* FASE DA VIAGEM */}
        <section aria-label="Situação da viagem" className="-mt-14 md:-mt-16">
          <div className="surface relative rounded-3xl p-5 shadow-xl md:p-7">
            {phase.phase === 'antes' && (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Hourglass className="h-10 w-10 text-gold" aria-hidden />
                  <div>
                    <p className="text-2 text-sm">Faltam</p>
                    <p className="font-display text-5xl font-semibold leading-none">
                      {phase.daysLeft} <span className="text-2xl">{phase.daysLeft === 1 ? 'dia' : 'dias'}</span>
                    </p>
                    <p className="text-2 text-sm">para o embarque em Fortaleza (26/11)</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm md:w-1/2">
                  <Link to="/reservas" className="rounded-xl bg-amber-100 p-3 text-amber-950 dark:bg-amber-900/40 dark:text-amber-50">
                    <Ticket className="mb-1 h-4 w-4" aria-hidden />
                    <strong>{pendingTickets}</strong> ingressos sem compra
                  </Link>
                  <Link to="/reservas#transportes" className="rounded-xl bg-amber-100 p-3 text-amber-950 dark:bg-amber-900/40 dark:text-amber-50">
                    <TrainFront className="mb-1 h-4 w-4" aria-hidden />
                    <strong>{pendingTransport}</strong> deslocamentos pendentes
                  </Link>
                  <Link to="/checklist" className="col-span-2 rounded-xl bg-surface-2 p-3">
                    <CheckSquare className="mb-1 h-4 w-4 text-gold" aria-hidden />
                    Checklist: <strong>{doneCount}</strong> de {allItems.length} itens concluídos
                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
                      <span className="block h-full bg-petrol" style={{ width: `${(doneCount / allItems.length) * 100}%` }} />
                    </span>
                  </Link>
                </div>
              </div>
            )}
            {phase.phase === 'durante' && (
              <div>
                <p className="text-goldx mb-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  Hoje · {dayLabel(phase.day)} · {localTime(now, phase.day.timezone)} (hora local)
                </p>
                <DayView day={phase.day} compact />
                <Link to="/hoje" className="btn btn-primary mt-4">
                  Abrir o dia completo <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            )}
            {phase.phase === 'depois' && (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Gift className="h-10 w-10 text-gold" aria-hidden />
                  <div>
                    <p className="font-display text-4xl font-semibold">Viagem concluída</p>
                    <p className="text-2">25 dias, 23 noites, 7 cidades. Hora de transformar o roteiro em memória.</p>
                  </div>
                </div>
                <Link to="/caderno" className="btn btn-primary">
                  <NotebookPen className="h-4 w-4" aria-hidden /> Abrir o Caderno de Viagem
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* NÚMEROS */}
        <section aria-label="Resumo" className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Dias" value={itinerary.length} hint="26/11 a 20/12" />
          <Stat label="Noites" value={TOTAL_NIGHTS} hint="em 6 hospedagens" />
          <Stat label="Países" value={4} hint="Espanha, França, Alemanha, Luxemburgo" />
          <Stat label="Viajantes" value={2} hint="com cartão ICOM para Ricardo" />
        </section>

        {/* LINHA DO TEMPO */}
        <section>
          <SectionTitle eyebrow="Percurso" title="Seis bases, um inverno europeu">
            Chegada por Madrid, trem até Barcelona e, de lá, Paris, Alsácia, Luxemburgo e o retorno a Madrid. Freiburg entra como bate-volta a partir de Strasbourg.
          </SectionTitle>
          <TripTimeline currentCity={phase.phase === 'durante' ? phase.day.cityId : undefined} />
        </section>

        {/* CIDADES */}
        <section>
          <SectionTitle eyebrow="Destinos" title="As cidades" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <Link key={c.id} to={`/cidades/${c.id}`} className="surface group overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-xl">
                <PhotoView photo={cityHero(c.id)} title={c.name} ratio="aspect-[16/10]" showCredit={false} />
                <div className="p-4">
                  <p className="text-2 text-xs font-semibold uppercase tracking-wider">
                    <span aria-hidden>{c.flag}</span> {c.country} · {c.isBase ? `${c.nights} noites` : 'bate-volta'}
                  </p>
                  <h3 className="text-2xl font-semibold group-hover:text-[var(--accent-text)]">{c.name}</h3>
                  <p className="text-2 mt-1 text-sm">{c.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-2 mt-3 text-xs">{baseCities.length} bases de hospedagem + Freiburg im Breisgau como passeio adicional.</p>
        </section>
      </div>
    </>
  )
}
