# Europa Natal 2026 — Destino & História

Guia de viagem editorial e interativo para a viagem de **26/11 a 20/12/2026** pelos mercados de Natal da Europa:
Barcelona, Paris, Colmar, Strasbourg, Freiburg im Breisgau (bate-volta), Luxemburgo e Madrid.

Site 100% estático (React + TypeScript + Vite), publicado no GitHub Pages, sem servidor, login ou chaves de API.

## O que tem

| Seção | Recursos |
|---|---|
| **Início** | Contagem regressiva antes da viagem; durante, o dia atual (no fuso local) com a programação; depois, “viagem concluída” e atalho ao Caderno. Linha do tempo horizontal (desktop) / vertical (celular). |
| **Hoje** | Programação do dia em tela cheia. Teste com `#/hoje?data=2026-12-04`. |
| **Roteiro** | Os 25 dias, com seletor de datas, selo de confiabilidade em cada item e botão “Ir até lá”. |
| **Cidades** | Página por cidade: cabeçalho fotográfico, datas, hotel, história, clima (estimativa), atrações com status editável, mapa, mercados, gastronomia, curiosidades, deslocamento, links oficiais, galeria e notas. |
| **Mapa** | Leaflet + OpenStreetMap; filtros por cidade, categoria e status; ícones por categoria; sequência da viagem com linhas **esquemáticas** (trem × avião × pendente); roteiro a pé do dia. |
| **Reservas** | Hotéis, transportes confirmados × pendentes, controle de ingressos com filtros, indicadores e edição. |
| **Financeiro** | Módulo **privado** (importação de arquivo local): totais por moeda, pontos, cashback previsto × recebido, custo líquido, câmbio com data, gráfico. |
| **Checklist** | Categorias do briefing, itens extras, prazos (aviso ao hotel de Madrid em 10/12). |
| **Caderno** | Registro real por dia (visitado × planejado, relato, restaurantes, despesas, fotos), exportação JSON/Markdown e importação. |
| **Informações** | Legenda de confiabilidade, fuso, moeda, tomadas, emergência, transporte urbano, pesquisa da biblioteca flutuante, ideias futuras. |

Também: modo claro/escuro, layout mobile-first com menu inferior, PWA instalável com service worker (uso offline do roteiro), acessibilidade (HTML semântico, foco visível, `prefers-reduced-motion`, textos alternativos), testes automatizados.

## Comandos

```bash
npm install
npm run dev       # desenvolvimento em http://localhost:5173/europa-natal-2026/
npm test          # testes (dados, datas/fusos, financeiro, interface)
npm run build     # build de produção em dist/
npm run preview   # serve o build localmente
npm run enrich    # baixa fotos licenciadas e coordenadas verificadas (precisa de internet)
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (por exemplo, `europa_natal_2026`) e envie este projeto para a branch `main`.
2. No repositório, abra **Settings → Pages** e, em **Build and deployment → Source**, escolha **GitHub Actions**.
3. A cada push na `main`, o workflow `.github/workflows/deploy.yml`:
   - instala as dependências;
   - baixa as fotos licenciadas do Wikimedia Commons (se ainda não estiverem no repositório);
   - roda os testes e o build com o `base` correto (`/<nome-do-repositório>/`);
   - publica em `https://<usuario>.github.io/<nome-do-repositório>/`.

O roteamento usa `HashRouter` (`/#/cidades/paris`), então recarregar qualquer página interna funciona no GitHub Pages.

## Fotografias

As fotos são **reais e com licença livre** (CC0, domínio público, CC BY, CC BY-SA), vindas do Wikimedia Commons.
O script `scripts/enrich.mjs` usa a imagem principal do artigo da Wikipédia de cada atração (campo `wiki` em
`src/data/attractions.ts`), confere a licença no Commons, baixa uma versão de 1280 px em `public/images/<cidade>/`
e grava autor, licença e fonte em `src/data/generated/enrichment.json`. Imagens não livres são descartadas.
Fotos de mercados de Natal são legendadas como “foto de arquivo” com o ano — nunca como edição de 2026.

Sem foto verificada, o site mostra um placeholder elegante com o nome da atração e “imagem licenciada pendente”.

- **Trocar a foto de uma atração:** em `scripts/photo-overrides.json`, adicione `"<id-da-atracao>": "File:Nome_no_Commons.jpg"` e rode `npm run enrich`.
- **Versionar as fotos:** rode `npm run enrich` localmente e faça commit de `public/images/` e `enrichment.json` (o workflow então não baixa de novo).
- **Fotos próprias:** use “Adicionar fotos próprias” nas galerias das cidades ou no Caderno. Ficam no navegador (IndexedDB) e entram na exportação JSON do Caderno.

## Editar conteúdo

| O quê | Onde |
|---|---|
| Cidades, clima, mercados, gastronomia, links, hotéis | `src/data/cities.ts` |
| Atrações (descrição, ingressos, ICOM, link oficial, coordenadas) | `src/data/attractions.ts` |
| Programação diária | `src/data/itinerary.ts` |
| Transportes, ingressos iniciais, checklist | `src/data/logistics.ts` |

Regras de conteúdo (seção 18 do briefing): não inventar horários, preços, gratuidade ICOM, disponibilidade, mercados
confirmados, coordenadas, números de reserva, fotos ou horários de transporte. Use `reliability` (`confirmado`,
`planejado`, `opcional`, `pendente`) em cada item do roteiro. `hours` só deve ser preenchido com fonte oficial.

**Atualizar reservas:** quando comprar um ingresso, edite-o na página **Reservas** (fica salvo no aparelho) ou altere
`ticketSeeds` em `src/data/logistics.ts` para valer para todos os aparelhos. Para um transporte pendente que foi comprado,
mude `status` para `'confirmado'` e preencha horário/serviço em `transport`.

**Incluir registros de viagem:** abra **Caderno → dia**, marque o que foi visitado e escreva. Use “Exportar JSON” como
cópia de segurança e “Importar JSON” para levar a outro aparelho (não há sincronização automática).

## Privacidade

O site é público. Por isso:

- **Não há** números de reserva, nomes completos, dados de pagamento ou documentos no código.
- Os **valores financeiros** ficam em `privado/financeiro.json`, que está no `.gitignore` e **não é publicado**. Na página
  Financeiro, use **Importar arquivo**; os dados ficam apenas no LocalStorage daquele navegador.
- LocalStorage não é um cofre: não guarde ali números de cartão, de reserva ou de passaporte.

## Estrutura

```text
├── .github/workflows/deploy.yml   # build + publicação no GitHub Pages
├── privado/                       # dados privados (ignorados pelo Git)
├── public/                        # favicon, manifest, service worker, imagens
├── scripts/enrich.mjs             # fotos licenciadas + coordenadas verificadas
├── src/
│   ├── components/                # Layout, DayView, AttractionCard, MapView, Gallery, ui…
│   ├── data/                      # conteúdo tipado da viagem
│   ├── hooks/                     # LocalStorage, tema, status, data/hora
│   ├── pages/                     # uma página por seção
│   ├── styles/index.css           # Tailwind v4 + identidade visual
│   ├── types/                     # tipos TypeScript
│   └── utils/                     # datas/fusos, financeiro, downloads, IndexedDB
└── tests/                         # Vitest + Testing Library
```

## Bibliotecas

React 19, React Router (HashRouter), Tailwind CSS 4, Lucide (ícones), Leaflet/React-Leaflet (mapas OSM),
Recharts (gráfico financeiro, carregado só na página Financeiro), Vitest e Testing Library (testes).
Não foi usada biblioteca de animação: as transições são CSS e respeitam `prefers-reduced-motion`.
