import type { ChecklistCategory, Ticket, TransportLeg } from '../types'

/**
 * Deslocamentos. Apenas dados informados pelos viajantes — nenhum aeroporto,
 * companhia, número de trem ou assento foi inferido.
 */
export const transport: TransportLeg[] = [
  { id: 'for-mad', date: '2026-11-26', from: 'Fortaleza', to: 'Madrid', fromCity: 'fortaleza', toCity: 'madrid', mode: 'aviao', operator: 'Iberia', travelClass: 'Executiva', status: 'confirmado', notes: ['Horários conforme bilhete.'] },
  { id: 'mad-bcn', date: '2026-11-27', from: 'Madrid', to: 'Barcelona', fromCity: 'madrid', toCity: 'barcelona', mode: 'trem', operator: 'Iryo', travelClass: 'Infinita', departure: '11:22', arrival: '14:39', status: 'confirmado' },
  { id: 'bcn-par', date: '2026-12-01', from: 'Barcelona', to: 'Paris', fromCity: 'barcelona', toCity: 'paris', mode: 'aviao', departure: '14:10', status: 'confirmado', notes: ['Emitido com Avios. Companhia, aeroportos e horário de chegada: conferir no bilhete.'] },
  { id: 'par-col', date: '2026-12-06', from: 'Paris (Gare de l’Est)', to: 'Colmar', fromCity: 'paris', toCity: 'colmar', mode: 'trem', operator: 'SNCF', service: 'TGV INOUI', departure: '10:43', arrival: '13:06', status: 'confirmado' },
  { id: 'col-sxb', date: '2026-12-09', from: 'Colmar', to: 'Strasbourg', fromCity: 'colmar', toCity: 'strasbourg', mode: 'trem', operator: 'SNCF', service: 'TGV', departure: '11:52', arrival: '12:24', travelClass: '1ª classe', status: 'confirmado', notes: ['Comprado.'] },
  { id: 'alsacia', date: '2026-12-08', from: 'Colmar', to: 'Eguisheim / Riquewihr', fromCity: 'colmar', mode: 'onibus', status: 'pendente', notes: ['Comparar navetas sazonais, ônibus regulares e excursões. Verificar o calendário de 2026.'] },
  { id: 'sxb-lux', date: '2026-12-14', from: 'Strasbourg', to: 'Luxemburgo', fromCity: 'strasbourg', toCity: 'luxemburgo', mode: 'trem', operator: 'SNCF', service: 'TGV INOUI 9898', departure: '12:31', arrival: '14:15', travelClass: '1ª classe', seats: 'Vagão 11, assentos 174 e 175', status: 'confirmado' },
  { id: 'lux-mad', date: '2026-12-17', from: 'Luxemburgo', to: 'Madrid', fromCity: 'luxemburgo', toCity: 'madrid', mode: 'aviao', operator: 'Ryanair', service: 'FR5055', departure: '20:05', arrival: '22:35', status: 'confirmado', notes: ['Voo direto, já comprado.'] },
  { id: 'mad-gru', date: '2026-12-20', from: 'Madrid', to: 'São Paulo (Guarulhos)', fromCity: 'madrid', toCity: 'saopaulo', mode: 'aviao', status: 'confirmado', notes: ['Horário de saída: conferir no bilhete.'] },
]

/** Coordenadas de referência (centro das cidades) para os pontos de origem/destino fora da Europa. */
export const extraPlaces = {
  fortaleza: { name: 'Fortaleza', lat: -3.7319, lng: -38.5267 },
  saopaulo: { name: 'São Paulo (Guarulhos)', lat: -23.4356, lng: -46.4731 },
}

/** Ingressos e reservas — sementes iniciais; tudo é editável e salvo no aparelho. */
/** Aumente ao mudar ticketSeeds: os aparelhos com lista salva recebem a versão nova. */
export const TICKET_SEEDS_VERSION = 3

export const ticketSeeds: Ticket[] = [
  { id: 't-sagrada', cityId: 'barcelona', attraction: 'Sagrada Família', plannedDate: '2026-11-28', time: '10:15 (Ricardo) · 10:45 (André)', people: 2, icomPossible: 'Ricardo: gratuito com ICOM, ingresso recebido', officialUrl: 'https://sagradafamilia.org/', status: 'pago', level: 'essencial', notes: 'Ambos com ingresso. Ainda não há confirmação de que possam entrar juntos.' },
  { id: 't-guell', cityId: 'barcelona', attraction: 'Park Güell — zona monumental', plannedDate: '2026-11-29', people: 2, icomPossible: 'Consulta preparada; benefício não confirmado', officialUrl: 'https://parkguell.barcelona/en/buy-tickets', status: 'pendente', level: 'essencial', notes: 'Comprar. Confirmar a resposta sobre o ICOM e escolher o horário.' },
  { id: 't-palauguell', cityId: 'barcelona', attraction: 'Palau Güell', plannedDate: '2026-11-29', people: 2, icomPossible: 'Ricardo: gratuito com ICOM', status: 'pendente', level: 'alta', notes: 'Retirar na bilheteria.' },
  { id: 't-santpau', cityId: 'barcelona', attraction: 'Recinte Modernista de Sant Pau', plannedDate: '2026-11-28', people: 2, icomPossible: 'Não confirmado', officialUrl: 'https://santpaubarcelona.org/', status: 'em-analise', level: 'alta', notes: 'Decidir ingresso.' },
  { id: 't-palau', cityId: 'barcelona', attraction: 'Palau de la Música Catalana', plannedDate: '2026-11-30', people: 2, icomPossible: 'Não confirmado', officialUrl: 'https://www.palaumusica.cat/', status: 'nao-pesquisado', level: 'alta', notes: 'Opcional, conforme agenda.' },
  { id: 't-picasso', cityId: 'barcelona', attraction: 'Museu Picasso', plannedDate: '2026-11-30', people: 2, icomPossible: 'Ricardo: gratuito com ICOM', officialUrl: 'https://museupicasso.bcn.cat/', status: 'nao-pesquisado', level: 'opcional', notes: 'Alternativa; não reservado.' },
  { id: 't-vicens', cityId: 'barcelona', attraction: 'Casa Vicens', plannedDate: '2026-11-29', people: 2, icomPossible: 'A confirmar (somente Ricardo)', officialUrl: 'https://casavicens.org/', status: 'nao-pesquisado', level: 'opcional', notes: 'Alternativa, somente se escolhida.' },
  { id: 't-garnier', cityId: 'paris', attraction: 'Palais Garnier', plannedDate: '2026-12-02', people: 2, icomPossible: 'Gratuidade não confirmada', officialUrl: 'https://www.operadeparis.fr/en/visits/palais-garnier/', status: 'pendente', level: 'essencial', notes: 'Reservar; encaixar antes do Louvre.' },
  { id: 't-louvre', cityId: 'paris', attraction: 'Museu do Louvre', plannedDate: '2026-12-02', people: 2, icomPossible: 'Ricardo: gratuito com ICOM', officialUrl: 'https://ticket.louvre.fr/en', status: 'pendente', level: 'essencial', notes: 'Reservar entrada para os dois.' },
  { id: 't-orsay', cityId: 'paris', attraction: 'Musée d’Orsay', plannedDate: '2026-12-03', people: 2, icomPossible: 'Ricardo: gratuito com ICOM', officialUrl: 'https://billetterie.musee-orsay.fr/', status: 'pendente', level: 'essencial', notes: 'Reservar; verificar a emissão do ingresso gratuito ICOM.' },
  { id: 't-grandpalais', cityId: 'paris', attraction: 'Grand Palais (conforme exposição)', plannedDate: '2026-12-03', people: 2, icomPossible: 'A confirmar (somente Ricardo)', officialUrl: 'https://www.grandpalais.fr/', status: 'nao-pesquisado', level: 'opcional', notes: 'Possibilidade, sem sobrecarregar o dia 3.' },
  { id: 't-pantheon', cityId: 'paris', attraction: 'Panthéon — nave, cripta e exposições', plannedDate: '2026-12-05', time: '10:30–12:00', people: 2, icomPossible: 'Ricardo: gratuito com ICOM', officialUrl: 'https://tickets.monuments-nationaux.fr/fr-FR/familles?site=2007056652440400272', status: 'pendente', level: 'alta', notes: 'Comprar o ingresso do André. Urgência menor que Louvre, Orsay e Palais Garnier.' },
  { id: 't-unterlinden', cityId: 'colmar', attraction: 'Musée Unterlinden', plannedDate: '2026-12-07', people: 2, icomPossible: 'Não confirmado', officialUrl: 'https://www.musee-unterlinden.com/', status: 'pendente', level: 'alta', notes: 'Verificar.' },
  { id: 't-alsacia', cityId: 'colmar', attraction: 'Vilas da Alsácia (Eguisheim, Riquewihr, Kaysersberg)', plannedDate: '2026-12-08', people: 2, icomPossible: 'Não se aplica', status: 'em-analise', level: 'alta', notes: 'Transporte ainda a definir.' },
  { id: 't-parlamento', cityId: 'strasbourg', attraction: 'Parlamento Europeu', plannedDate: '2026-12-10', people: 2, icomPossible: 'Não se aplica: gratuito para todos', officialUrl: 'https://visiting.europarl.europa.eu/en/visitor-offer/strasbourg/hemicycle', status: 'pendente', level: 'alta', notes: 'Confirmar horário de visitação e acesso.' },
  { id: 't-floresta', cityId: 'strasbourg', attraction: 'Experiência Premium de Natal — Floresta Negra', plannedDate: '2026-12-11', time: '09:00–18:00', people: 2, icomPossible: 'Não se aplica', status: 'reservado', level: 'alta', notes: 'Encontro na Place de l’Étoile. Funicular Merkurberg, Baden-Baden, Castelo Staufenberg (taça de vinho incluída) e Gengenbach. Guia brasileira e van incluídas; almoço e compras não incluídos.' },
  { id: 't-rohan', cityId: 'strasbourg', attraction: 'Palais Rohan / Musée de l’Œuvre Notre-Dame', plannedDate: '2026-12-13', people: 2, icomPossible: 'Ricardo: gratuito com ICOM', officialUrl: 'https://www.musees.strasbourg.eu/', status: 'nao-pesquisado', level: 'alta', notes: 'Visita flexível.' },
  { id: 't-bock', cityId: 'luxemburgo', attraction: 'Casamatas do Bock', plannedDate: '2026-12-15', people: 2, icomPossible: 'Não confirmado', status: 'nao-pesquisado', level: 'alta', notes: 'Verificar abertura no inverno.' },
  { id: 't-madrid', cityId: 'madrid', attraction: 'Museus de Madrid', plannedDate: '2026-12-19', people: 2, icomPossible: 'Conforme museu', status: 'nao-pesquisado', level: 'opcional', notes: 'Decidir depois.' },
]

export const ticketStatusLabel: Record<Ticket['status'], string> = {
  'nao-pesquisado': 'Não pesquisado',
  pendente: 'Pendente',
  'em-analise': 'Em análise',
  reservado: 'Reservado',
  pago: 'Pago',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
}

export const checklist: ChecklistCategory[] = [
  {
    id: 'documentos',
    title: 'Documentos',
    items: [
      { id: 'passaportes', label: 'Passaportes' },
      { id: 'seguro', label: 'Seguro viagem' },
      { id: 'reservas', label: 'Reservas e bilhetes (cópias offline)' },
      { id: 'migratorio', label: 'Requisitos migratórios vigentes', note: 'Conferir regras de entrada no Espaço Schengen perto da data de partida.' },
      { id: 'icom', label: 'Cartão ICOM do Ricardo' },
    ],
  },
  {
    id: 'ingressos',
    title: 'Ingressos',
    items: [
      { id: 'i-sagrada', label: 'Sagrada Família (28/11)', note: 'Comprado para os dois.' },
      { id: 'i-guell', label: 'Comprar Park Güell (29/11)', note: 'Confirmar resposta sobre ICOM e escolher horário.' },
      { id: 'i-louvre', label: 'Reservar Louvre (02/12)', note: 'Entrada para ambos, Ricardo com ICOM.' },
      { id: 'i-garnier', label: 'Reservar Palais Garnier (02/12)', note: 'Encaixar antes do Louvre.' },
      { id: 'i-orsay', label: 'Reservar Musée d’Orsay (03/12)', note: 'Verificar ingresso gratuito ICOM.' },
      { id: 'i-pantheon', label: 'Comprar ingresso do Panthéon (05/12)', note: 'André; Ricardo com ICOM.' },
      { id: 'i-parlamento', label: 'Confirmar visita ao Parlamento Europeu (10/12)', note: 'Horário de funcionamento e acesso.' },
      { id: 'i-museus', label: 'Museus selecionados' },
    ],
  },
  {
    id: 'transportes',
    title: 'Transportes',
    items: [
      { id: 'tr-colmar', label: 'Trem Colmar → Strasbourg (09/12)', note: 'TGV 1ª classe, comprado.' },
      { id: 'tr-vilarejos', label: 'Organizar vilas da Alsácia (08/12)', note: 'Eguisheim, Riquewihr e Kaysersberg.' },
      { id: 'tr-floresta', label: 'Floresta Negra (11/12): encontro às 9h na Place de l’Étoile', note: 'Programa e horários conferidos; falta registrar o valor pago.' },
    ],
  },
  {
    id: 'roupas',
    title: 'Roupas e acessórios',
    items: [
      { id: 'termicas', label: 'Roupas térmicas' },
      { id: 'casacos', label: 'Casacos de inverno' },
      { id: 'luvas', label: 'Luvas' },
      { id: 'cachecois', label: 'Cachecóis' },
      { id: 'calcados', label: 'Calçados apropriados' },
      { id: 'gorro', label: 'Gorro de Papai Noel para fotografias natalinas' },
    ],
  },
  {
    id: 'tecnologia',
    title: 'Tecnologia',
    items: [
      { id: 'celulares', label: 'Celulares' },
      { id: 'carregadores', label: 'Carregadores' },
      { id: 'adaptadores', label: 'Adaptadores de tomada' },
      { id: 'powerbank', label: 'Power bank' },
      { id: 'foto', label: 'Equipamentos de fotografia e vídeo' },
    ],
  },
  {
    id: 'tarefas',
    title: 'Outras tarefas',
    items: [
      { id: 'avisar-madrid', label: 'Avisar o chic&basic dot sobre o check-in tardio', due: '2026-12-10', note: 'Sete dias antes da chegada (17/12).' },
      { id: 'horarios-mercados', label: 'Conferir horários dos mercados de Natal' },
      { id: 'clima', label: 'Conferir clima perto da partida' },
      { id: 'mapas-offline', label: 'Baixar mapas offline' },
      { id: 'bagagem', label: 'Verificar regras de bagagem (inclusive Ryanair)' },
    ],
  },
]
