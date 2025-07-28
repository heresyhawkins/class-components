import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pokemon } from '../../types/PokemonTypes';
import PokemonList from '../ResultsList/ResultsList';

const mockPokemons: Pokemon[] = [
  {
    id: 1,
    name: 'bulbasaur',
    sprites: {
      front_default: 'https://example.com/bulbasaur.png ',
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
    species: undefined,
    cries: undefined,
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
    species: undefined,
    cries: undefined,
  },
];

describe('PokemonList', () => {
  it('should render list of pokemons', () => {
    render(<PokemonList pokemons={mockPokemons} />);

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();
  });

  it('should show "No Pokémon found" when pokemons array is empty', () => {
    render(<PokemonList pokemons={[]} />);
    expect(screen.getByText(/No Pokémon found/i)).toBeInTheDocument();
  });

  it('should not throw error when sprite is null', () => {
    render(<PokemonList pokemons={mockPokemons} />);
    expect(() => {
      screen.getByAltText('charmander');
    }).not.toThrow();
  });
});
