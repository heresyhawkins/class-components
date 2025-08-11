import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

export const renderWithProviders = (
  ui: ReactElement,
  p0: {
    preloadedState: {
      pokemonApi: {
        queries: {
          'getPokemonByName(pikachu)': { status: string; data: undefined; error: undefined };
        };
      };
    };
  }
) => {
  return render(<Provider store={store}>{ui}</Provider>);
};
