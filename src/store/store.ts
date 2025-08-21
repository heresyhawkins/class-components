import { configureStore } from '@reduxjs/toolkit';
import selectedPokemonReducer from './selectedPokemonSlice';
import { pokemonApi } from './pokemonApiSlice';
import formReducer from './formSlice';

export const store = configureStore({
  reducer: {
    selectedPokemon: selectedPokemonReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    form: formReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
