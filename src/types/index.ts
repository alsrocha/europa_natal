export type CityId =
  | 'barcelona'
  | 'paris'
  | 'colmar'
  | 'strasbourg'
  | 'freiburg'
  | 'luxemburgo'
  | 'madrid'

/** Grau de confiabilidade de uma informação (seção 18 do briefing). */
export type Reliability = 'confirmado' | 'planejado' | 'opcional' | 'pendente' | 'visitado'

/** Status de uma atração, editável pelos viajantes. */
export type AttractionStatus = 'planejada' | 'reservada' | 'visitada' | 'cancelada'

export type Category =
  | 'museu'
  | 'monumento'
  | 'igreja'
  | 'mercado'
  | 'bairro'
  | 'parque'
  | 'compras'
  | 'biblioteca'
  | 'mirante'
  | 'gastronomia'
  | 'hotel'
  | 'estacao'
  | 'aeroporto'

export interface LatLng {
  lat: number
  lng: number
}

export interface SourceLink {
  label: string
  url: string
  /** Data em que a fonte foi consultada (AAAA-MM-DD), quando aplicável. */
  consultedAt?: string
}

export interface Attraction {
  id: string
  cityId: CityId
  name: string
  category: Category
  /** Coordenadas aproximadas; `coordsVerified` indica se vieram de fonte (Wikipedia/Wikidata via script). */
  coords?: LatLng
  description: string
  address?: string
  /** Horário de funcionamento — só preenchido quando verificado em fonte oficial. */
  hours?: string
  tickets: string
  icom?: string
  officialUrl?: string
  /** Título do artigo na Wikipédia (en) usado pelo script de enriquecimento para foto e coordenadas. */
  wiki?: string
  optional?: boolean
  tags?: string[]
}

export interface Hotel {
  cityId: CityId
  name: string
  nights: number
  checkIn: string
  checkOut: string
  address?: string
  coords?: LatLng
  notes?: string[]
}

export interface Climate {
  minC: number
  maxC: number
  daylight: string
  note: string
}

export interface City {
  id: CityId
  name: string
  country: string
  countryCode: 'ES' | 'FR' | 'DE' | 'LU'
  flag: string
  timezone: string
  coords: LatLng
  zoom: number
  arrival: string
  departure: string
  nights: number
  isBase: boolean
  tagline: string
  summary: string
  history: string[]
  climate: Climate
  markets: { name: string; description: string; status: string }[]
  food: string[]
  curiosities: string[]
  gettingAround: string[]
  links: SourceLink[]
  wiki: string
  accent: string
}

export type ItemKind = 'visita' | 'transporte' | 'refeicao' | 'logistica' | 'livre'

export interface DayItem {
  time?: string
  text: string
  kind: ItemKind
  attractionId?: string
  reliability: Reliability
  note?: string
}

export interface TripDay {
  date: string // AAAA-MM-DD
  cityId: CityId | 'voo'
  timezone: string
  title: string
  items: DayItem[]
  notes?: string[]
}

export type TransportMode = 'aviao' | 'trem' | 'local' | 'onibus'

export interface TransportLeg {
  id: string
  date: string
  from: string
  to: string
  fromCity?: CityId | 'fortaleza' | 'saopaulo'
  toCity?: CityId | 'fortaleza' | 'saopaulo'
  mode: TransportMode
  operator?: string
  service?: string
  departure?: string
  arrival?: string
  travelClass?: string
  seats?: string
  status: 'confirmado' | 'pendente'
  notes?: string[]
}

export type TicketStatus =
  | 'nao-pesquisado'
  | 'pendente'
  | 'em-analise'
  | 'reservado'
  | 'pago'
  | 'concluido'
  | 'cancelado'

export interface Ticket {
  id: string
  cityId: CityId
  attraction: string
  plannedDate?: string
  time?: string
  ticketType?: string
  unitPrice?: string
  people: number
  icomPossible: string
  officialUrl?: string
  status: TicketStatus
  purchaseDate?: string
  notes?: string
  priority?: boolean
}

export interface ChecklistItem {
  id: string
  label: string
  note?: string
  due?: string
}

export interface ChecklistCategory {
  id: string
  title: string
  items: ChecklistItem[]
}

export interface Photo {
  src: string
  alt: string
  title: string
  author?: string
  license?: string
  licenseUrl?: string
  sourceUrl?: string
  /** true quando é uma foto adicionada pelos viajantes. */
  own?: boolean
}

export type Currency = 'BRL' | 'EUR' | 'GBP' | 'USD'

export interface Money {
  amount: number
  currency: Currency
}
