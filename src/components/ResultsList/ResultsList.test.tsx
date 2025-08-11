import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import ResultsList from './ResultsList';
import { renderWithProviders } from '../../utils/test-utils';

const mockPokemons = [
  {
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
  },
  {
    name: 'charmander',
    url: 'https://pokeapi.co/api/v2/pokemon/4/',
  },
];

describe('ResultsList', () => {
  it('should render list of pokemons with name, ID, and sprite', () => {
    renderWithProviders(<ResultsList pokemons={mockPokemons} />);

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();

    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#4')).toBeInTheDocument();

    const bulbasaurImg = screen.getByAltText('bulbasaur');
    expect(bulbasaurImg).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
    );

    const charmanderImg = screen.getByAltText('charmander');
    expect(charmanderImg).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'
    );

    const detailTexts = screen.getAllByText('Click for details');
    expect(detailTexts).toHaveLength(2);
  });

  it('should show "No Pokémon found" when pokemons array is empty', () => {
    renderWithProviders(<ResultsList pokemons={[]} />);

    expect(screen.getByText('No Pokémon found.')).toBeInTheDocument();
  });

  it('should show placeholder image when original sprite fails to load', () => {
    renderWithProviders(<ResultsList pokemons={mockPokemons} />);

    const charmanderImg = screen.getByAltText('charmander');

    fireEvent.error(charmanderImg);

    expect(charmanderImg).toHaveAttribute('src', expect.stringContaining('via.placeholder.com'));
  });

  it('should call onPokemonClick when clicking on a pokemon card', () => {
    const mockOnPokemonClick = vi.fn();
    renderWithProviders(<ResultsList pokemons={mockPokemons} onPokemonClick={mockOnPokemonClick} />);

    const bulbasaurCard = screen.getByText('bulbasaur').closest('.pokemon-card-content');
    fireEvent.click(bulbasaurCard!);

    expect(mockOnPokemonClick).toHaveBeenCalledWith('bulbasaur');
  });

  it('should toggle checkbox when clicked', () => {
    renderWithProviders(<ResultsList pokemons={mockPokemons} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);

    const bulbasaurCheckbox = checkboxes[0];
    expect(bulbasaurCheckbox).not.toBeChecked();

    fireEvent.click(bulbasaurCheckbox);
    expect(bulbasaurCheckbox).toBeChecked();

    fireEvent.click(bulbasaurCheckbox);
    expect(bulbasaurCheckbox).not.toBeChecked();
  });
});