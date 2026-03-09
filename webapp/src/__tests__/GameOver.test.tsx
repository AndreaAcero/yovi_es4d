import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { describe, test, expect, vi } from 'vitest'
import GameOver from '../components/GameOver'
import * as reactRouter from 'react-router-dom'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...await vi.importActual<typeof reactRouter>('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
}))

vi.mock('../components/game/Triangle', () => ({
  default: ({ onHexClick }: { onHexClick: () => void }) => (
    <button data-testid="triangle" onClick={onHexClick}>Triangle</button>
  ),
}))

const baseState = {
  winner: 'j1',
  players: [
    { id: 'p1', name: 'Alice', points: 5 },
    { id: 'p2', name: 'Bot',   points: 3 },
  ],
  hexData: [],
}

describe('GameOver', () => {

  test('muestra mensaje de no hay partida cuando no hay state', () => {
    render(
      <reactRouter.MemoryRouter>
        <GameOver />
      </reactRouter.MemoryRouter>
    )
    expect(screen.getByText(/no hay partida/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /volver al inicio/i })).toBeInTheDocument()
  })

  test('botón volver al inicio navega a / cuando no hay state', async () => {
    const user = userEvent.setup()
    render(
      <reactRouter.MemoryRouter>
        <GameOver />
      </reactRouter.MemoryRouter>
    )
    await user.click(screen.getByRole('button', { name: /volver al inicio/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  test('muestra el nombre del ganador j1 en el título', () => {
    vi.spyOn(reactRouter, 'useLocation').mockReturnValue({ state: baseState } as any)
    render(<reactRouter.MemoryRouter><GameOver /></reactRouter.MemoryRouter>)

    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toHaveTextContent('Alice')
    expect(title).toHaveTextContent('ha ganado')
  })

  test('muestra el nombre del ganador j2 en el título', () => {
    vi.spyOn(reactRouter, 'useLocation').mockReturnValue({
      state: { ...baseState, winner: 'j2' },
    } as any)
    render(<reactRouter.MemoryRouter><GameOver /></reactRouter.MemoryRouter>)

    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toHaveTextContent('Bot')
    expect(title).toHaveTextContent('ha ganado')
  })

  test('muestra las tarjetas de ambos jugadores', () => {
    vi.spyOn(reactRouter, 'useLocation').mockReturnValue({ state: baseState } as any)
    render(<reactRouter.MemoryRouter><GameOver /></reactRouter.MemoryRouter>)

    const names = screen.getAllByText(/Alice|Bot/).filter(
      el => el.classList.contains('go-player-name')
    )
    expect(names).toHaveLength(2)
    expect(names[0]).toHaveTextContent('Alice')
    expect(names[1]).toHaveTextContent('Bot')
  })

  test('muestra los puntos de los jugadores con padding a 4 dígitos', () => {
    vi.spyOn(reactRouter, 'useLocation').mockReturnValue({ state: baseState } as any)
    render(<reactRouter.MemoryRouter><GameOver /></reactRouter.MemoryRouter>)

    expect(screen.getByText('0005')).toBeInTheDocument()
    expect(screen.getByText('0003')).toBeInTheDocument()
  })

  test('muestra el trofeo 🏆', () => {
    vi.spyOn(reactRouter, 'useLocation').mockReturnValue({ state: baseState } as any)
    render(<reactRouter.MemoryRouter><GameOver /></reactRouter.MemoryRouter>)
    expect(screen.getByText('🏆')).toBeInTheDocument()
  })

  test('botón Nueva partida navega a /select', async () => {
    const user = userEvent.setup()
    vi.spyOn(reactRouter, 'useLocation').mockReturnValue({ state: baseState } as any)
    render(<reactRouter.MemoryRouter><GameOver /></reactRouter.MemoryRouter>)

    await user.click(screen.getByRole('button', { name: /nueva partida/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/select')
  })

  test('botón Inicio navega a /', async () => {
    const user = userEvent.setup()
    vi.spyOn(reactRouter, 'useLocation').mockReturnValue({ state: baseState } as any)
    render(<reactRouter.MemoryRouter><GameOver /></reactRouter.MemoryRouter>)

    await user.click(screen.getByRole('button', { name: /^inicio$/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  test('renderiza el Triangle con los hexData', () => {
    vi.spyOn(reactRouter, 'useLocation').mockReturnValue({ state: baseState } as any)
    render(<reactRouter.MemoryRouter><GameOver /></reactRouter.MemoryRouter>)
    expect(screen.getByTestId('triangle')).toBeInTheDocument()
  })

  test('click en triangle no hace nada (onHexClick vacío)', async () => {
    const user = userEvent.setup()
    vi.spyOn(reactRouter, 'useLocation').mockReturnValue({ state: baseState } as any)
    render(<reactRouter.MemoryRouter><GameOver /></reactRouter.MemoryRouter>)
    await user.click(screen.getByTestId('triangle')) // no debe lanzar error
  })
})