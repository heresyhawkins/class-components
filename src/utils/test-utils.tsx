import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState,
  }: {
    preloadedState?: {
      pokemonApi?: {
        queries: Record<string, { status: string; data: unknown; error: unknown }>;
      };
    };
  } = {}
) => {
  return render(<Provider store={store}>{ui}</Provider>);
  console.log(preloadedState);
};
