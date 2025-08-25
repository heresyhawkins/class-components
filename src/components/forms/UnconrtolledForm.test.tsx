import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import UncontrolledForm from './UncontrolledForm';

const setupStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      form: (state = { countries: ['USA', 'Germany', 'Japan'] }) => state,
    },
    preloadedState,
  });
};

const mockOnClose = vi.fn();

const renderWithProviders = (ui: React.ReactElement) => {
  const store = setupStore();
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('UncontrolledForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('submit button is enabled (uncontrolled forms do not disable submit)', () => {
    renderWithProviders(<UncontrolledForm onClose={mockOnClose} />);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    expect(submitButton).not.toBeDisabled();
  });

  test('clicking Cancel calls onClose', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UncontrolledForm onClose={mockOnClose} />);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

 
});