import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

export const renderWithProviders = (ui: ReactElement) => {
  return render(<Provider store={store}>{ui}</Provider>);
};
