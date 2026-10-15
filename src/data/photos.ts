import enrichment from './generated/enrichment.json'
import type { Attraction, CityId, LatLng, Photo } from '../types'

interface EnrichedAttraction {
  coords?: LatLng
  coordsSource?: string
  photo?: Photo
}
interface EnrichedCity {
  hero?: Photo
  gallery?: Photo[]
}
interface Enrichment {
  generatedAt: string | null
  attractions: Record<string, EnrichedAttraction>
  cities: Record<string, EnrichedCity>
}

const data = enrichment as unknown as Enrichment

export const enrichmentDate = data.generatedAt

/** Resolve caminhos relativos de /public considerando o `base` do Vite. */
function withBase(p: Photo): Photo {
  if (/^(https?:|data:|blob:)/.test(p.src)) return p
  return { ...p, src: import.meta.env.BASE_URL + p.src.replace(/^\//, '') }
}

export function attractionPhoto(id: string): Photo | undefined {
  const p = data.attractions[id]?.photo
  return p ? withBase(p) : undefined
}

export function cityHero(cityId: CityId): Photo | undefined {
  const p = data.cities[cityId]?.hero
  return p ? withBase(p) : undefined
}

export function cityGallery(cityId: CityId): Photo[] {
  return (data.cities[cityId]?.gallery ?? []).map(withBase)
}

/** Coordenadas: verificadas (Wikipédia) quando disponíveis, senão aproximadas do cadastro. */
export function attractionCoords(a: Attraction): { coords?: LatLng; verified: boolean; source?: string } {
  const e = data.attractions[a.id]
  if (e?.coords) return { coords: e.coords, verified: true, source: e.coordsSource }
  return { coords: a.coords, verified: false }
}
