import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { screen, render } from '@testing-library/react';
import Flyout from './Flyout';
import { useSelector, useDispatch } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { AppDispatch, RootState } from '../../store';

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

const mockUseSelector = useSelector as unknown as Mock<
  TypedUseSelectorHook<RootState>
>;
const mockUseDispatch = useDispatch as unknown as Mock<() => AppDispatch>;

describe('Flyout', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSelector.mockReturnValue({ selectedPokemons: [] });
    mockUseDispatch.mockReturnValue(mockDispatch);
  });

  it('test1', () => {
    render(<Flyout />);

    expect(screen.queryByText(/items are selected/i)).not.toBeInTheDocument();
  });

  it('test2', () => {
    mockUseSelector.mockReturnValue({
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
    mockUseSelector.mockReturnValue({
      selectedPokemons: [{ name: 'pikachu', url: '', types: [], weight: 0, height: 0 }],
    });

    render(<Flyout />);

    const button = screen.getByText('Unselect all');
    button.click();

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const action = mockDispatch.mock.calls[0]![0];
    expect(action.type).toBe('selectedPokemon/clearAll');
  });
});