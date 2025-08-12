import { configureStore } from '@reduxjs/toolkit';
import selectedPokemonReducer from './selectedPokemonSlice';
import { pokemonApi } from './pokemonApiSlice';

export const store = configureStore({
  reducer: {
    selectedPokemon: selectedPokemonReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
