import { describe, expect, it } from 'vitest'
import { cities, baseCities, hotels, TOTAL_NIGHTS } from '../src/data/cities'
import { itinerary } from '../src/data/itinerary'
import { attractions, attractionById, futureIdeas } from '../src/data/attractions'
import { transport, ticketSeeds } from '../src/data/logistics'
import { daysBetween } from '../src/utils/dates'

describe('dados da viagem', () => {
  it('tem as seis cidades-base e Freiburg', () => {
    expect(baseCities.map((c) => c.id)).toEqual(['barcelona', 'paris', 'colmar', 'strasbourg', 'luxemburgo', 'madrid'])
    expect(cities.some((c) => c.id === 'freiburg' && !c.isBase)).toBe(true)
  })

  it('soma 23 noites e as noites de cada hotel batem com as datas', () => {
    expect(TOTAL_NIGHTS).toBe(23)
    for (const h of hotels) expect(daysBetween(h.checkIn, h.checkOut)).toBe(h.nights)
  })

  it('representa todos os dias de 26/11 a 20/12, em ordem e sem lacunas', () => {
    expect(itinerary[0].date).toBe('2026-11-26')
    expect(itinerary[itinerary.length - 1].date).toBe('2026-12-20')
    expect(itinerary).toHaveLength(25)
    for (let i = 1; i < itinerary.length; i++) expect(daysBetween(itinerary[i - 1].date, itinerary[i].date)).toBe(1)
  })

  it('todas as atrações referenciadas no roteiro existem', () => {
    for (const d of itinerary) for (const it of d.items) if (it.attractionId) expect(attractionById[it.attractionId], it.attractionId).toBeDefined()
  })

  it('ids de atrações são únicos e todas têm descrição útil', () => {
    const ids = attractions.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const a of attractions) expect(a.description.length).toBeGreaterThan(20)
  })

  it('Mont-Saint-Michel não faz parte do roteiro ativo nem do mapa', () => {
    const active = JSON.stringify({ itinerary, attractions, transport, ticketSeeds })
    expect(active).not.toMatch(/Mont-Saint-Michel/i)
    expect(futureIdeas.map((f) => f.name)).toContain('Mont-Saint-Michel')
  })

  it('nenhuma atração aparece como reservada por padrão e horários não são inventados', () => {
    for (const a of attractions) expect(a.hours).toBeUndefined()
    for (const t of ticketSeeds) expect(['reservado', 'pago', 'concluido']).not.toContain(t.status)
  })

  it('transportes confirmados e pendentes conforme informado', () => {
    const confirmed = transport.filter((t) => t.status === 'confirmado').map((t) => t.id)
    expect(confirmed).toEqual(['for-mad', 'mad-bcn', 'bcn-par', 'par-col', 'sxb-lux', 'lux-mad', 'mad-gru'])
    expect(transport.find((t) => t.id === 'mad-gru')?.departure).toBeUndefined()
    expect(transport.find((t) => t.id === 'sxb-lux')).toMatchObject({ departure: '12:31', arrival: '14:15', seats: 'Vagão 11, assentos 174 e 175' })
  })

  it('não expõe dados privados no bundle público', () => {
    const publicData = JSON.stringify({ cities, hotels, itinerary, attractions, transport, ticketSeeds })
    expect(publicData).not.toMatch(/R\$\s?\d/)
    expect(publicData).not.toMatch(/2\.861|6\.204|27\.263|confirma(ção|cao) n/i)
  })
})
