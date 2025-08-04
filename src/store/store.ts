import { configureStore } from '@reduxjs/toolkit';
import selectedPokemonReducer from './selectedPokemonSlice';

export const store = configureStore({
  reducer: {
    selectedPokemon: selectedPokemonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
