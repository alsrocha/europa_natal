import { describe, expect, it, beforeEach } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ChecklistPage } from '../src/pages/ChecklistPage'
import { ItineraryPage } from '../src/pages/ItineraryPage'
import { BookingsPage } from '../src/pages/BookingsPage'
import { FinancePage } from '../src/pages/FinancePage'
import { Route, Routes } from 'react-router-dom'

beforeEach(() => localStorage.clear())

describe('interface', () => {
  it('checklist marca itens e persiste no LocalStorage', () => {
    render(
      <MemoryRouter>
        <ChecklistPage />
      </MemoryRouter>,
    )
    const box = screen.getByRole('checkbox', { name: /Passaportes/ })
    expect(box).not.toBeChecked()
    fireEvent.click(box)
    expect(box).toBeChecked()
    expect(JSON.parse(localStorage.getItem('en26:checklist')!)).toMatchObject({ passaportes: true })
  })

  it('roteiro navega para um dia específico', () => {
    render(
      <MemoryRouter initialEntries={['/roteiro/2026-12-04']}>
        <Routes>
          <Route path="/roteiro/:date" element={<ItineraryPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Paris histórica e literária' })).toBeInTheDocument()
    expect(screen.getByText('Musée Carnavalet')).toBeInTheDocument()
  })

  it('reservas separa transportes confirmados e pendentes', () => {
    render(
      <MemoryRouter>
        <BookingsPage />
      </MemoryRouter>,
    )
    const pend = screen.getByRole('heading', { name: /Pendentes/ }).parentElement!
    expect(within(pend).getByText(/Colmar → Strasbourg/)).toBeInTheDocument()
  })

  it('financeiro começa vazio (dados privados não vêm no site)', () => {
    render(
      <MemoryRouter>
        <FinancePage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Nenhum dado financeiro neste aparelho/)).toBeInTheDocument()
  })
})
