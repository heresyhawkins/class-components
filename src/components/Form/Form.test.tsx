import { describe, it, expect, vi } from 'vitest';
import { render, screen,  } from '@testing-library/react';
import Form from './Form';
import { useGetPokemonListQuery } from '../../store/pokemonApiSlice';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

vi.mock('../../hooks/useSearchFromLocalStorage', () => ({
  useSearchFromLocalStorage: () => ['', vi.fn()],
}));

vi.mock('../../store/pokemonApiSlice', () => ({
  useGetPokemonListQuery: vi.fn(),
}));

describe('Form Component - Simple Tests', () => {
  it('renders search input and button', () => {
    vi.mocked(useGetPokemonListQuery).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      refetch: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Form />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Write Something')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useGetPokemonListQuery).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      refetch: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Form />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });



  
});