import { HashRouter, Link, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { HomePage } from './pages/HomePage'
import { TodayPage } from './pages/TodayPage'
import { ItineraryPage } from './pages/ItineraryPage'
import { CitiesPage, CityPage } from './pages/CityPage'
import { MapPage } from './pages/MapPage'
import { BookingsPage } from './pages/BookingsPage'
import { FinancePage } from './pages/FinancePage'
import { ChecklistPage } from './pages/ChecklistPage'
import { JournalPage } from './pages/JournalPage'
import { InfoPage } from './pages/InfoPage'
import { CreditsPage } from './pages/CreditsPage'

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-goldx text-xs font-semibold uppercase tracking-[0.25em]">Página não encontrada</p>
      <h1 className="mt-2 text-5xl font-semibold">Caminho fora do mapa</h1>
      <Link to="/" className="btn btn-primary mt-6">
        Voltar ao início
      </Link>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Layout>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hoje" element={<TodayPage />} />
          <Route path="/roteiro" element={<ItineraryPage />} />
          <Route path="/roteiro/:date" element={<ItineraryPage />} />
          <Route path="/cidades" element={<CitiesPage />} />
          <Route path="/cidades/:id" element={<CityPage />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/reservas" element={<BookingsPage />} />
          <Route path="/financeiro" element={<FinancePage />} />
          <Route path="/checklist" element={<ChecklistPage />} />
          <Route path="/caderno" element={<JournalPage />} />
          <Route path="/caderno/:date" element={<JournalPage />} />
          <Route path="/informacoes" element={<InfoPage />} />
          <Route path="/creditos" element={<CreditsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  )
}
