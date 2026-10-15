import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  Home,
  Info,
  Landmark,
  Map as MapIcon,
  Menu,
  Moon,
  NotebookPen,
  Sun,
  Ticket,
  Wallet,
  WifiOff,
  X,
  Sparkles,
} from 'lucide-react'
import { useTheme } from '../hooks/useAppState'
import { useOnline } from '../hooks/useMisc'

const sections = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/roteiro', label: 'Roteiro', icon: CalendarDays },
  { to: '/cidades', label: 'Cidades', icon: Landmark },
  { to: '/mapa', label: 'Mapa', icon: MapIcon },
  { to: '/reservas', label: 'Reservas', icon: Ticket },
  { to: '/financeiro', label: 'Financeiro', icon: Wallet },
  { to: '/checklist', label: 'Checklist', icon: CheckSquare },
  { to: '/caderno', label: 'Caderno', icon: NotebookPen },
  { to: '/informacoes', label: 'Informações', icon: Info },
]

const mobileTabs = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/hoje', label: 'Hoje', icon: Sparkles },
  { to: '/cidades', label: 'Cidades', icon: Landmark },
  { to: '/mapa', label: 'Mapa', icon: MapIcon },
  { to: '/checklist', label: 'Checklist', icon: CheckSquare },
]

export function Layout({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const online = useOnline()
  const { pathname, hash } = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'escuro')
  }, [theme])

  useEffect(() => {
    setOpen(false)
    if (!hash) window.scrollTo({ top: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div className="min-h-dvh pb-20 lg:pb-0">
      <a href="#conteudo" className="skip-link btn btn-primary">
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 text-cream backdrop-blur no-print">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2" aria-label="Europa Natal 2026 — início">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="h-7 w-7" />
            <span className="font-display text-xl font-semibold leading-none">
              Europa Natal <span className="text-gold">2026</span>
            </span>
          </Link>
          <nav aria-label="Seções" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {sections.map((s) => (
                <li key={s.to}>
                  <NavLink
                    to={s.to}
                    end={s.end}
                    className={({ isActive }) =>
                      `rounded-full px-3 py-1.5 text-sm font-medium transition ${isActive ? 'bg-gold text-navy' : 'text-cream/85 hover:bg-white/10'}`
                    }
                  >
                    {s.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={toggle}
            className="ml-auto grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 lg:ml-2"
            aria-label={theme === 'escuro' ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {theme === 'escuro' ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="menu-movel"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
        {!online && (
          <div role="status" className="flex items-center justify-center gap-2 bg-amber-200 px-4 py-1.5 text-center text-xs font-medium text-amber-950">
            <WifiOff className="h-4 w-4" aria-hidden /> Sem conexão: roteiro, cidades, checklist e caderno continuam disponíveis. Mapas e fotos podem não carregar.
          </div>
        )}
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu" id="menu-movel">
          <button className="absolute inset-0 bg-black/50" aria-label="Fechar menu" onClick={() => setOpen(false)} />
          <nav className="fade-in absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-navy p-5 text-cream">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-2xl">Seções</span>
              <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" onClick={() => setOpen(false)} aria-label="Fechar menu">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <ul className="space-y-1">
              {[...sections, { to: '/creditos', label: 'Créditos das fotos', icon: BookOpen }].map((s) => (
                <li key={s.to}>
                  <NavLink
                    to={s.to}
                    end={'end' in s ? s.end : false}
                    className={({ isActive }) =>
                      `flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-base ${isActive ? 'bg-gold text-navy' : 'hover:bg-white/10'}`
                    }
                  >
                    <s.icon className="h-5 w-5" aria-hidden />
                    {s.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <main id="conteudo" tabIndex={-1} className="outline-none">
        {children}
      </main>

      <footer className="border-line mt-16 border-t px-4 py-8 text-sm md:px-8 no-print">
        <div className="text-2 mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:justify-between">
          <p>
            <span className="font-display text-lg text-[var(--text)]">Europa Natal 2026 — Destino &amp; História</span>
            <br />
            Guia pessoal de viagem. Informações marcadas como “a confirmar” devem ser verificadas nas fontes oficiais.
          </p>
          <p className="flex gap-4">
            <Link className="text-accent underline" to="/creditos">
              Créditos das fotos
            </Link>
            <Link className="text-accent underline" to="/informacoes#confiabilidade">
              Legenda de confiabilidade
            </Link>
          </p>
        </div>
      </footer>

      <nav aria-label="Navegação rápida" className="border-line fixed inset-x-0 bottom-0 z-40 border-t bg-[var(--surface)]/95 backdrop-blur lg:hidden no-print" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <ul className="grid grid-cols-5">
          {mobileTabs.map((t) => (
            <li key={t.to}>
              <NavLink
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  `flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${isActive ? 'text-accent' : 'text-2'}`
                }
              >
                <t.icon className="h-5 w-5" aria-hidden />
                {t.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
