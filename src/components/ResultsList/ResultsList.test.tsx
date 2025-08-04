import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { Pokemon } from '../../types/PokemonTypes';
import ResultsList from './ResultsList';
import { renderWithProviders } from '../../utils/test-utils';


const mockPokemons: Pokemon[] = [
  {
    id: 1,
    name: 'bulbasaur',
    sprites: {
      front_default: 'https://example.com/bulbasaur.png',
      front_shiny: null,
    },
    types: [
      { slot: 1, type: { name: 'grass', url: '' } },
      { slot: 2, type: { name: 'poison', url: '' } },
    ],
    stats: [{ base_stat: 45, effort: 0, stat: { name: 'hp', url: '' } }],
    base_experience: 0,
    height: 0,
    is_default: false,
    order: 0,
    weight: 0,
    abilities: [],
    forms: [],
    game_indices: [],
    held_items: [],
    location_area_encounters: '',
    moves: [],
    past_types: [],
    past_abilities: [],
    cries: undefined,
    species: undefined,
  },
  {
    id: 2,
    name: 'charmander',
    sprites: {
      front_default: null,
      front_shiny: null,
    },
    types: [{ slot: 1, type: { name: 'fire', url: '' } }],
    stats: [{ base_stat: 39, effort: 0, stat: { name: 'hp', url: '' } }],
    base_experience: 0,
    height: 0,
    is_default: false,
    order: 0,
    weight: 0,
    abilities: [],
    forms: [],
    game_indices: [],
    held_items: [],
    location_area_encounters: '',
    moves: [],
    past_types: [],
    past_abilities: [],
    cries: undefined,
    species: undefined,
  },
];

describe('PokemonList', () => {
  it('should render list of pokemons', () => {
    renderWithProviders(<ResultsList pokemons={mockPokemons} />);

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();

    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === 'Types: grass, poison';
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === 'Types: fire';
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === 'HP: 45';
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === 'HP: 39';
      })
    ).toBeInTheDocument();
  });

  it('should show "No Pokémon found" when pokemons array is empty', () => {
    renderWithProviders(<ResultsList pokemons={[]} />); 

    expect(screen.getByText(/No Pokémon found/i)).toBeInTheDocument();
  });

  it('should render placeholder image when sprite is null', () => {
    renderWithProviders(<ResultsList pokemons={mockPokemons} />); 

    const image = screen.getByAltText('charmander');
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', expect.stringContaining('via.placeholder.com'));
  });
});