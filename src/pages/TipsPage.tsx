import { CircleHelp, Lightbulb } from 'lucide-react'
import { tipCategoryLabel, tips } from '../data/tips'
import { ExternalLink, PageHeader } from '../components/ui'

export function TipsPage() {
  return (
    <>
      <PageHeader eyebrow="Para aproveitar melhor" title="Dicas">
        Aplicativos, truques e boas ideias para a viagem. Cada dica diz o que ainda precisa ser conferido.
      </PageHeader>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 md:grid-cols-2 md:px-8">
        {tips.map((t) => (
          <article key={t.id} id={t.id} className="surface rounded-2xl p-5">
            <p className="text-2 text-xs font-semibold uppercase tracking-wider">{tipCategoryLabel[t.category]}</p>
            <h2 className="mt-1 flex items-center gap-2 text-3xl font-semibold">
              <Lightbulb className="h-6 w-6 shrink-0 text-gold" aria-hidden /> {t.title}
            </h2>
            <p className="mt-3 leading-relaxed">{t.summary}</p>
            {t.howTo && (
              <>
                <p className="text-2 mt-4 text-xs font-semibold uppercase tracking-wider">Como usar</p>
                <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">
                  {t.howTo.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </>
            )}
            {t.forTheTrip && (
              <>
                <p className="text-2 mt-4 text-xs font-semibold uppercase tracking-wider">Na nossa viagem</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                  {t.forTheTrip.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </>
            )}
            {t.toConfirm && (
              <p className="text-2 mt-4 flex gap-2 text-sm">
                <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> <span>A confirmar: {t.toConfirm}</span>
              </p>
            )}
            {t.links && (
              <p className="mt-4 flex flex-wrap gap-3 text-sm">
                {t.links.map((l) => (
                  <ExternalLink key={l.url} href={l.url}>
                    {l.label}
                  </ExternalLink>
                ))}
              </p>
            )}
          </article>
        ))}
      </div>
    </>
  )
}
