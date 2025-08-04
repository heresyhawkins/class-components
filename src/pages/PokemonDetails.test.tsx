import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, Mock } from 'vitest';

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

const mockUseParams = useParams as Mock<typeof useParams>;
const mockUseNavigate = useNavigate as Mock<typeof useNavigate>;

const mockNavigate = vi.fn();
mockUseNavigate.mockReturnValue(mockNavigate);

const mockFetch = vi.fn();
global.fetch = mockFetch;

import PokemonDetails from './PokemonDetails';

describe('PokemonDetails', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ name: 'pikachu' });
    mockNavigate.mockClear();
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'pikachu' }),
    });

    render(<PokemonDetails />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('fetches and displays Pokemon data on success', async () => {
    const mockPokemon = {
      name: 'Pikachu',
      sprites: { front_default: 'https://example.com/pikachu.png' },
      types: [{ type: { name: 'electric' } }],
      stats: [{ base_stat: 35 }],
      weight: 60,
      height: 4,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemon,
    });

    render(<PokemonDetails />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    const typeElement = screen.getByText(/Type:/i);
    expect(typeElement.parentElement).toHaveTextContent('Type: electric');

    expect(screen.getByText(/HP:/i).parentElement).toHaveTextContent('HP: 35');
    expect(screen.getByText(/Weight:/i).parentElement).toHaveTextContent('Weight: 60');
    expect(screen.getByText(/Height:/i).parentElement).toHaveTextContent('Height: 4');
  });

  it('displays error message when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    render(<PokemonDetails />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Network Error/i)).toBeInTheDocument();
    });
  });

  it('displays error when Pokemon not found (404)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<PokemonDetails />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Pokémon not found/i)).toBeInTheDocument();
    });
  });

  it('closes the panel when Close button is clicked', async () => {
    const mockPokemon = {
      name: 'pikachu',
      sprites: { front_default: 'https://example.com/pikachu.png' },
      types: [{ type: { name: 'electric' } }],
      stats: [{ base_stat: 35 }],
      weight: 60,
      height: 4,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemon,
    });

    render(<PokemonDetails />);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('closes the panel when backdrop is clicked', async () => {
    const mockPokemon = {
      name: 'pikachu',
      sprites: { front_default: 'https://example.com/pikachu.png' },
      types: [{ type: { name: 'electric' } }],
      stats: [{ base_stat: 35 }],
      weight: 60,
      height: 4,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemon,
    });

    render(<PokemonDetails />);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    const backdrop = screen.getByText('pikachu').closest('.details-panel');
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('does not close when content is clicked', async () => {
    const mockPokemon = {
      name: 'pikachu',
      sprites: { front_default: 'https://example.com/pikachu.png' },
      types: [{ type: { name: 'electric' } }],
      stats: [{ base_stat: 35 }],
      weight: 60,
      height: 4,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemon,
    });

    render(<PokemonDetails />);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    const content = screen.getByText('pikachu').closest('.details-content');
    if (content) {
      fireEvent.click(content);
    }

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles image load error and shows placeholder', async () => {
    const mockPokemon = {
      name: 'pikachu',
      sprites: { front_default: 'https://broken-image.com/404.png' },
      types: [{ type: { name: 'electric' } }],
      stats: [{ base_stat: 35 }],
      weight: 60,
      height: 4,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemon,
    });

    render(<PokemonDetails />);

    const img = (await screen.findByAltText('pikachu')) as HTMLImageElement;
    expect(img.src).toContain('broken-image.com');

    fireEvent.error(img);

    await waitFor(() => {
      expect(img.src).toContain('via.placeholder.com');
    });
  });
});