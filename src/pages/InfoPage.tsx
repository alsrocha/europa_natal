import { Link } from 'react-router-dom'
import { Clock, Coins, Plug, Phone, ShieldCheck, TrainFront, WifiOff, Lightbulb, BookMarked } from 'lucide-react'
import { cities } from '../data/cities'
import { futureIdeas } from '../data/attractions'
import { ExternalLink, PageHeader, ReliabilityBadge, SectionTitle, reliabilityMeta } from '../components/ui'
import { useHashScroll } from '../hooks/useHashScroll'
import type { Reliability } from '../types'

export function InfoPage() {
  useHashScroll()
  return (
    <>
      <PageHeader eyebrow="Informações úteis" title="Antes de sair do hotel">
        Clima, transporte urbano, horários, moedas e dicas práticas.
      </PageHeader>
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-8 md:px-8">
        <section id="confiabilidade">
          <SectionTitle eyebrow="Como ler este guia" title="Legenda de confiabilidade" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(Object.keys(reliabilityMeta) as Reliability[]).map((r) => (
              <li key={r} className="surface rounded-2xl p-4">
                <ReliabilityBadge value={r} />
                <p className="text-2 mt-2 text-sm">{reliabilityMeta[r].help}</p>
              </li>
            ))}
          </ul>
          <p className="text-2 mt-3 text-sm">
            Horários de funcionamento, preços, datas de mercados e benefícios ICOM não verificados aparecem como <strong>“a confirmar”</strong>, com link para a fonte
            oficial. Coordenadas sem verificação automática aparecem como aproximadas.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="surface rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-2xl font-semibold">
              <Clock className="h-5 w-5 text-gold" aria-hidden /> Fuso horário
            </h3>
            <p className="text-2 mt-2 text-sm">
              Espanha, França, Alemanha e Luxemburgo usam o Horário da Europa Central (CET, UTC+1) em dezembro — 4 horas à frente de Fortaleza e de Brasília (UTC−3).
              O site calcula o “hoje” pelo fuso local de cada cidade.
            </p>
          </div>
          <div className="surface rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-2xl font-semibold">
              <Coins className="h-5 w-5 text-gold" aria-hidden /> Moeda
            </h3>
            <p className="text-2 mt-2 text-sm">
              Euro (€) nos quatro países. Cartões por aproximação são amplamente aceitos, mas leve algum dinheiro para barracas de mercados de Natal. Algumas compras
              (ex.: o trem Strasbourg → Luxemburgo) foram feitas em libras (£); valores ficam registrados na moeda original.
            </p>
          </div>
          <div className="surface rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-2xl font-semibold">
              <Plug className="h-5 w-5 text-gold" aria-hidden /> Tomadas
            </h3>
            <p className="text-2 mt-2 text-sm">Tomadas europeias dos tipos C e F, 230 V / 50 Hz. Leve adaptador e confira se os carregadores são bivolt.</p>
          </div>
          <div className="surface rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-2xl font-semibold">
              <Phone className="h-5 w-5 text-gold" aria-hidden /> Emergências
            </h3>
            <p className="text-2 mt-2 text-sm">112 — número único de emergência na União Europeia, válido nos quatro países.</p>
          </div>
          <div className="surface rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-2xl font-semibold">
              <ShieldCheck className="h-5 w-5 text-gold" aria-hidden /> Entrada no Espaço Schengen
            </h3>
            <p className="text-2 mt-2 text-sm">
              Regras de entrada para brasileiros (registro EES, autorização ETIAS e documentos exigidos) podem mudar. Verifique perto da partida:{' '}
              <ExternalLink href="https://travel-europe.europa.eu/">travel-europe.europa.eu</ExternalLink>.
            </p>
          </div>
          <div className="surface rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-2xl font-semibold">
              <WifiOff className="h-5 w-5 text-gold" aria-hidden /> Uso sem internet
            </h3>
            <p className="text-2 mt-2 text-sm">
              Depois da primeira visita, o site funciona offline: roteiro, cidades, reservas, checklist e caderno. Mapas (OpenStreetMap) e fotografias externas precisam
              de conexão, exceto o que já tiver sido carregado. Para navegação offline, baixe mapas no app de mapas do celular. Instale o site na tela inicial pelo menu
              do navegador (“Adicionar à tela inicial”).
            </p>
          </div>
        </section>

        <section>
          <SectionTitle eyebrow="Transporte urbano" title="Como se deslocar em cada cidade" />
          <div className="grid gap-4 md:grid-cols-2">
            {cities.map((c) => (
              <div key={c.id} className="surface rounded-2xl p-5">
                <h3 className="flex items-center gap-2 text-2xl font-semibold">
                  <TrainFront className="h-5 w-5 text-gold" aria-hidden /> {c.flag} {c.name}
                </h3>
                <ul className="text-2 mt-2 list-disc space-y-1 pl-5 text-sm">
                  {c.gettingAround.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm">
                  Dezembro: {c.climate.minC}° a {c.climate.maxC}°C (estimativa), {c.climate.daylight}.
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-2xl border border-petrol/40 bg-petrol/10 p-4 text-sm">
            <strong>Luxemburgo:</strong> o transporte público doméstico (ônibus, bonde, funicular e trens em 2ª classe) é gratuito, conforme as regras vigentes. A 1ª classe
            nos trens é paga. Confira em <ExternalLink href="https://www.mobiliteit.lu/">mobiliteit.lu</ExternalLink>.
          </p>
        </section>

        <section>
          <SectionTitle eyebrow="Mercados de Natal" title="Horários e datas" >
            As edições de 2026 ainda precisam ser confirmadas nas fontes oficiais de cada cidade (links nas páginas das cidades). Fotografias de mercados neste site são de
            edições anteriores.
          </SectionTitle>
        </section>

        <section id="biblioteca-flutuante">
          <SectionTitle eyebrow="Pesquisa" title="A “biblioteca flutuante” de Paris">
            Pesquisa feita em 14/10/2026. Foram encontradas duas candidatas; o nome não foi presumido e os viajantes devem confirmar qual é a mencionada.
          </SectionTitle>
          <ul className="grid gap-3 md:grid-cols-2">
            <li className="surface rounded-2xl p-4 text-sm">
              <p className="font-display text-xl font-semibold">Nanna</p>
              <p className="text-2">
                Péniche literária com cerca de 5.000 livros usados para leitura no local e empréstimo, e bar, no Port de Montebello (5º arr.), diante da Notre-Dame;
                atracada desde maio de 2026, segundo a fonte.
              </p>
              <ExternalLink href="https://www.sortiraparis.com/en/where-to-eat-in-paris/bars-cafes/articles/337914-nanna-the-cozy-literary-barge-with-a-library-and-a-bar-at-the-foot-of-notre-dame-cathedral">
                Sortiraparis (atualizado em 21/05/2026)
              </ExternalLink>
            </li>
            <li className="surface rounded-2xl p-4 text-sm">
              <p className="font-display text-xl font-semibold">L’Eau et les Rêves</p>
              <p className="text-2">Livraria em uma péniche no Canal de l’Ourcq, 9 Quai de l’Oise (19º arr.).</p>
              <ExternalLink href="https://theearfultower.com/2022/03/16/meet-the-man-with-the-floating-paris-bookshop/">The Earful Tower (2022)</ExternalLink>
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle eyebrow="Para depois" title="Ideias para futuras viagens" />
          <ul className="space-y-2">
            {futureIdeas.map((f) => (
              <li key={f.name} className="surface flex gap-3 rounded-2xl p-4">
                <Lightbulb className="h-5 w-5 shrink-0 text-gold" aria-hidden />
                <p>
                  <strong>{f.name}</strong> — <span className="text-2">{f.reason}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle eyebrow="Dica" title="Testar a visão “Hoje”" />
          <p className="text-2 text-sm">
            Para ver como o site se comporta durante a viagem, acrescente <code>?data=AAAA-MM-DD</code> ao endereço da página Hoje — por exemplo,{' '}
            <Link className="text-accent underline" to="/hoje?data=2026-12-10">
              Hoje em 10/12
            </Link>
            .
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm">
            <BookMarked className="h-4 w-4 text-gold" aria-hidden />
            <Link className="text-accent underline" to="/creditos">
              Créditos das fotografias, mapas e fontes
            </Link>
          </p>
        </section>
      </div>
    </>
  )
}
