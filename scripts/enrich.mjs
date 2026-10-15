#!/usr/bin/env node
/**
 * Enriquecimento de fotos e coordenadas — Europa Natal 2026
 *
 * Para cada atração com `wiki` (título de artigo da Wikipédia em inglês):
 *   1. consulta a Wikipédia: imagem principal do artigo (pageimage) e coordenadas;
 *   2. consulta o Wikimedia Commons: autor, licença e URL da imagem;
 *   3. aceita SOMENTE licenças livres (CC0, domínio público, CC BY, CC BY-SA);
 *   4. baixa uma versão de 1280 px para public/images/<cidade>/<id>.jpg;
 *   5. grava créditos e coordenadas em src/data/generated/enrichment.json.
 * Também procura fotos de mercados de Natal no Commons (identificadas como de edições
 * anteriores, com o ano da foto quando disponível).
 *
 * Uso: npm run enrich   (requer Node 20+ e acesso à internet)
 * Overrides manuais: scripts/photo-overrides.json  { "<id-da-atracao>": "File:Nome.jpg" }
 * Nada é inventado: se a consulta falhar, a atração continua com placeholder.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'src/data/generated/enrichment.json')
const UA = 'EuropaNatal2026/1.0 (guia pessoal de viagem; https://github.com/)'
const WIDTH = 1280
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Extrai {id, cityId, name, wiki} de src/data/attractions.ts sem precisar compilar TypeScript. */
async function loadAttractions() {
  const src = await readFile(path.join(ROOT, 'src/data/attractions.ts'), 'utf8')
  const re = /a\(\s*'([^']+)',\s*'([^']+)',\s*'((?:[^'\\]|\\.)*)',\s*'([^']+)'([\s\S]*?)\),\n/g
  const out = []
  let m
  while ((m = re.exec(src))) {
    const wiki = /wiki:\s*'((?:[^'\\]|\\.)*)'/.exec(m[5])?.[1]?.replace(/\\'/g, "'")
    out.push({ id: m[1], cityId: m[2], name: m[3].replace(/\\'/g, "'"), category: m[4], wiki })
  }
  return out
}

/** Atração usada como foto de capa de cada cidade. */
const HERO = {
  barcelona: 'sagrada-familia',
  paris: 'palais-garnier',
  colmar: 'maison-pfister',
  strasbourg: 'cathedrale-strasbourg',
  freiburg: 'freiburger-munster',
  luxemburgo: 'corniche',
  madrid: 'plaza-mayor',
}

/** Artigos da Wikipédia (en) das cidades: a imagem principal entra na galeria. */
const CITY_WIKI = {
  barcelona: 'Barcelona',
  paris: 'Paris',
  colmar: 'Colmar',
  strasbourg: 'Strasbourg',
  freiburg: 'Freiburg im Breisgau',
  luxemburgo: 'Luxembourg City',
  madrid: 'Madrid',
}

/** Buscas no Commons para fotos de mercados de Natal (edições anteriores). */
const MARKET_SEARCH = {
  barcelona: 'Fira de Santa Llúcia Barcelona',
  paris: 'Marché de Noël Paris',
  colmar: 'Colmar marché de Noël',
  strasbourg: 'Christkindelsmärik Strasbourg',
  freiburg: 'Freiburg Weihnachtsmarkt',
  luxemburgo: 'Luxembourg marché de Noël',
  madrid: 'Mercado de Navidad Plaza Mayor Madrid',
}

async function api(host, params) {
  const url = `https://${host}/w/api.php?` + new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params })
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } })
      if (res.ok) return res.json()
      if (res.status === 429) await sleep(3000 * (i + 1))
    } catch {
      await sleep(1000 * (i + 1))
    }
  }
  throw new Error(`Falha ao consultar ${host}`)
}

const stripHtml = (s = '') => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
const FREE = /^(cc0|public domain|pd|cc by(-sa)?( \d\.\d)?|cc-by(-sa)?-\d\.\d)/i

async function commonsInfo(fileTitle) {
  const r = await api('commons.wikimedia.org', {
    action: 'query',
    titles: fileTitle.startsWith('File:') ? fileTitle : `File:${fileTitle}`,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|mime',
    iiurlwidth: String(WIDTH),
  })
  const page = r.query?.pages?.[0]
  const ii = page?.imageinfo?.[0]
  if (!ii || !/^image\/(jpeg|png|webp)$/.test(ii.mime)) return null
  const md = ii.extmetadata ?? {}
  const license = stripHtml(md.LicenseShortName?.value)
  if (!FREE.test(license) || /fair use|non-free/i.test(md.UsageTerms?.value ?? '')) return null
  return {
    file: page.title,
    thumb: ii.thumburl ?? ii.url,
    sourceUrl: ii.descriptionurl,
    author: stripHtml(md.Artist?.value) || undefined,
    license,
    licenseUrl: md.LicenseUrl?.value,
    description: stripHtml(md.ImageDescription?.value).slice(0, 200) || undefined,
    date: stripHtml(md.DateTimeOriginal?.value) || undefined,
  }
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))
}

async function main() {
  const attractions = await loadAttractions()
  const overridesPath = path.join(ROOT, 'scripts/photo-overrides.json')
  const overrides = existsSync(overridesPath) ? JSON.parse(await readFile(overridesPath, 'utf8')) : {}
  const result = { generatedAt: new Date().toISOString(), note: 'Gerado por scripts/enrich.mjs. Não edite manualmente; rode `npm run enrich`.', attractions: {}, cities: {} }
  let ok = 0
  let failed = 0

  for (const a of attractions) {
    if (!a.wiki && !overrides[a.id]) continue
    try {
      let fileTitle = overrides[a.id]
      const entry = {}
      if (a.wiki) {
        const r = await api('en.wikipedia.org', { action: 'query', titles: a.wiki, redirects: '1', prop: 'pageimages|coordinates', piprop: 'name', coprimary: 'primary' })
        const page = r.query?.pages?.[0]
        const co = page?.coordinates?.[0]
        if (co) {
          entry.coords = { lat: +co.lat.toFixed(5), lng: +co.lon.toFixed(5) }
          entry.coordsSource = `Wikipédia: ${page.title}`
        }
        fileTitle ??= page?.pageimage
      }
      if (fileTitle) {
        const info = await commonsInfo(fileTitle)
        if (info) {
          const rel = `images/${a.cityId}/${a.id}.jpg`
          await download(info.thumb, path.join(ROOT, 'public', rel))
          entry.photo = {
            src: rel,
            alt: `${a.name}${info.description ? ` — ${info.description}` : ''}`,
            title: a.name,
            author: info.author,
            license: info.license,
            licenseUrl: info.licenseUrl,
            sourceUrl: info.sourceUrl,
          }
        }
      }
      if (entry.coords || entry.photo) {
        result.attractions[a.id] = entry
        ok++
        console.log(`✓ ${a.id}${entry.photo ? ' [foto]' : ''}${entry.coords ? ' [coord]' : ''}`)
      }
    } catch (e) {
      failed++
      console.warn(`✗ ${a.id}: ${e.message}`)
    }
    await sleep(250)
  }

  // Capas e mercados de Natal por cidade
  for (const [cityId, heroId] of Object.entries(HERO)) {
    const c = (result.cities[cityId] = { gallery: [] })
    const hero = result.attractions[heroId]?.photo
    if (hero) c.hero = hero
    try {
      const r = await api('en.wikipedia.org', { action: 'query', titles: CITY_WIKI[cityId], redirects: '1', prop: 'pageimages', piprop: 'name' })
      const file = r.query?.pages?.[0]?.pageimage
      const info = file ? await commonsInfo(file) : null
      if (info) {
        const rel = `images/${cityId}/cidade.jpg`
        await download(info.thumb, path.join(ROOT, 'public', rel))
        const photo = { src: rel, alt: `Vista de ${CITY_WIKI[cityId]}${info.description ? ` — ${info.description}` : ''}`, title: CITY_WIKI[cityId], author: info.author, license: info.license, licenseUrl: info.licenseUrl, sourceUrl: info.sourceUrl }
        c.gallery.push(photo)
        c.hero ??= photo
        console.log(`✓ cidade ${cityId}: ${file}`)
      }
    } catch (e) {
      console.warn(`✗ cidade ${cityId}: ${e.message}`)
    }
    try {
      const r = await api('commons.wikimedia.org', { action: 'query', list: 'search', srsearch: `${MARKET_SEARCH[cityId]} filetype:bitmap`, srnamespace: '6', srlimit: '6' })
      for (const hit of r.query?.search ?? []) {
        const info = await commonsInfo(hit.title)
        if (!info) continue
        const year = /(\d{4})/.exec(info.date ?? '')?.[1]
        const rel = `images/${cityId}/mercado-natal.jpg`
        await download(info.thumb, path.join(ROOT, 'public', rel))
        c.gallery.push({
          src: rel,
          alt: `Mercado de Natal em ${CITY_WIKI[cityId]}${year ? `, foto de ${year}` : ''} (edição anterior, não 2026)${info.description ? ` — ${info.description}` : ''}`,
          title: `Mercado de Natal — foto de arquivo${year ? ` (${year})` : ''}`,
          author: info.author,
          license: info.license,
          licenseUrl: info.licenseUrl,
          sourceUrl: info.sourceUrl,
        })
        console.log(`✓ mercado ${cityId}: ${hit.title}`)
        break
      }
    } catch (e) {
      console.warn(`✗ mercado ${cityId}: ${e.message}`)
    }
    await sleep(250)
  }

  await writeFile(OUT, JSON.stringify(result, null, 2) + '\n')
  console.log(`\nConcluído: ${ok} atrações enriquecidas, ${failed} falhas. Arquivo: ${path.relative(ROOT, OUT)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
