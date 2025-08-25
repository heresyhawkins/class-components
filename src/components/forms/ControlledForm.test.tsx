import { render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';


import ControlledForm from './ControlledForm';

const mockStore = {
  form: {
    countries: ['USA', 'Germany', 'Japan'],
  },
};

vi.mock('../../store/hooks', () => ({
  useAppSelector: (selector: (state: { form: any }) => any) => selector(mockStore),
  useAppDispatch: () => vi.fn(),
}));

const mockOnClose = vi.fn();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui);
};

describe('ControlledForm (Simple)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });



  test('should call onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ControlledForm onClose={mockOnClose} />);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});