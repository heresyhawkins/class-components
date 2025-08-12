
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import PokemonDetails from './PokemonDetails';
import { renderWithProviders } from '../utils/test-utils';

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

const mockUseParams = vi.mocked(useParams);
const mockUseNavigate = vi.mocked(useNavigate);

describe('PokemonDetails', () => {
  const mockNavigate = vi.fn();
  const mockName = 'pikachu';

  beforeEach(() => {
    mockUseParams.mockReturnValue({ name: mockName });
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  it('should render loading state when isLoading is true', () => {
    const preloadedState = {
      pokemonApi: {
        queries: {
          'getPokemonByName(pikachu)': { status: 'pending', data: undefined, error: undefined },
        },
      },
    };

    renderWithProviders(<PokemonDetails />, { preloadedState });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  
});