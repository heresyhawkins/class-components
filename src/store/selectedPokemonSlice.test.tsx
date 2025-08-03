import { describe, it, expect } from 'vitest';
import { Pokemon, selectedPokemonSlice } from './selectedPokemonSlice';


const { reducer, actions } = selectedPokemonSlice;

const mockPokemon1: Pokemon = {
  name: 'bulbasaur',
  url: 'https://pokeapi.co/api/v2/pokemon/1/',
  types: ['grass', 'poison'],
  weight: 69,
  height: 7,
};

const mockPokemon2: Pokemon = {
  name: 'charmander',
  url: 'https://pokeapi.co/api/v2/pokemon/4/',
  types: ['fire'],
  weight: 85,
  height: 6,
};

describe('selectedPokemonSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      selectedPokemons: [],
    });
  });

  it('should add a new pokemon with addPokemon', () => {
    let state = reducer(undefined, { type: 'unknown' });

    state = reducer(state, actions.addPokemon(mockPokemon1));

    expect(state.selectedPokemons).toHaveLength(1);
    expect(state.selectedPokemons[0].name).toBe('bulbasaur');
  });

  it('should not add a pokemon if it already exists', () => {
    let state = reducer(undefined, { type: 'unknown' });

    state = reducer(state, actions.addPokemon(mockPokemon1));
    state = reducer(state, actions.addPokemon(mockPokemon1));

    expect(state.selectedPokemons).toHaveLength(1);
    expect(state.selectedPokemons[0].name).toBe('bulbasaur');
  });

  it('should remove a pokemon by name with removePokemon', () => {
    let state = reducer(undefined, { type: 'unknown' });

    state = reducer(state, actions.addPokemon(mockPokemon1));
    state = reducer(state, actions.addPokemon(mockPokemon2));

    expect(state.selectedPokemons).toHaveLength(2);

    state = reducer(state, actions.removePokemon('bulbasaur'));

    expect(state.selectedPokemons).toHaveLength(1);
    expect(state.selectedPokemons[0].name).toBe('charmander');
  });

  it('should do nothing when removing a non-existent pokemon', () => {
    let state = reducer(undefined, { type: 'unknown' });

    state = reducer(state, actions.addPokemon(mockPokemon1));

    state = reducer(state, actions.removePokemon('pikachu'));

    expect(state.selectedPokemons).toHaveLength(1);
    expect(state.selectedPokemons[0].name).toBe('bulbasaur');
  });

  it('should toggle pokemon: add if not exists, remove if exists', () => {
    let state = reducer(undefined, { type: 'unknown' });

    state = reducer(state, actions.togglePokemon(mockPokemon1));
    expect(state.selectedPokemons).toHaveLength(1);
    expect(state.selectedPokemons[0].name).toBe('bulbasaur');
    
    state = reducer(state, actions.togglePokemon(mockPokemon1));
    expect(state.selectedPokemons).toHaveLength(0);
  });

  it('should clear all pokemons with clearAll', () => {
    let state = reducer(undefined, { type: 'unknown' });

    state = reducer(state, actions.addPokemon(mockPokemon1));
    state = reducer(state, actions.addPokemon(mockPokemon2));

    expect(state.selectedPokemons).toHaveLength(2);

    state = reducer(state, actions.clearAll());

    expect(state.selectedPokemons).toHaveLength(0);
  });
});