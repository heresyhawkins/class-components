import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string;
  types?: string[];
  weight?: number;
  height?: number;
}

interface SelectedPokemonState {
  selectedPokemons: Pokemon[];
}

const initialState: SelectedPokemonState = {
  selectedPokemons: [],
};

export const selectedPokemonSlice = createSlice({
  name: 'selectedPokemon',
  initialState,
  reducers: {
    addPokemon: (state, action: PayloadAction<Pokemon>) => {
      if (!state.selectedPokemons.find((p) => p.name === action.payload.name)) {
        state.selectedPokemons.push(action.payload);
      }
    },
    removePokemon: (state, action: PayloadAction<string>) => {
      state.selectedPokemons = state.selectedPokemons.filter((p) => p.name !== action.payload);
    },
    togglePokemon: (state, action: PayloadAction<Pokemon>) => {
      const exists = state.selectedPokemons.find((p) => p.name === action.payload.name);
      if (exists) {
        state.selectedPokemons = state.selectedPokemons.filter(
          (p) => p.name !== action.payload.name
        );
      } else {
        state.selectedPokemons.push(action.payload);
      }
    },
    clearAll: (state) => {
      state.selectedPokemons = [];
    },
  },
});

export const { addPokemon, removePokemon, togglePokemon, clearAll } = selectedPokemonSlice.actions;

export default selectedPokemonSlice.reducer;
