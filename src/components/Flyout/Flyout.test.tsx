import { describe, it, expect, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import Flyout from './Flyout';

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

import { useSelector, useDispatch } from 'react-redux';

describe('Flyout', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useSelector as any).mockReturnValue({ selectedPokemons: [] });
    (useDispatch as any).mockReturnValue(vi.fn());
  });

  it('test1', () => {
    render(<Flyout />);

    expect(screen.queryByText(/items are selected/i)).not.toBeInTheDocument();
  });

  it('test2', () => {
    (useSelector as any).mockReturnValue({
      selectedPokemons: [
        { name: 'bulbasaur', url: '', types: ['grass'], weight: 69, height: 7 },
        { name: 'charmander', url: '', types: ['fire'], weight: 85, height: 6 },
      ],
    });

    render(<Flyout />);

    expect(screen.getByText('2 items are selected')).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('test3', () => {
    const mockDispatch = vi.fn();
    (useDispatch as any).mockReturnValue(mockDispatch);

    (useSelector as any).mockReturnValue({
      selectedPokemons: [{ name: 'pikachu', url: '', types: [], weight: 0, height: 0 }],
    });

    render(<Flyout />);

    const button = screen.getByText('Unselect all');
    button.click();

    expect(mockDispatch).toHaveBeenCalledOnce();
    const action = mockDispatch.mock.calls[0][0];
    expect(action.type).toBe('selectedPokemon/clearAll');
  });


});