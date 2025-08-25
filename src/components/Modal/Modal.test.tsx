import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Modal from './Modal';

const mockOnClose = vi.fn();

const setup = (isOpen = true) => {
  return render(<Modal isOpen={isOpen} onClose={mockOnClose}>
    <div>Modal Content</div>
  </Modal>);
};

describe('Modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  test('does not render when isOpen is false', () => {
    setup(false);

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  test('renders modal content when isOpen is true', () => {
    setup();

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  test('calls onClose when clicking outside the modal', () => {
    setup();

    const overlay = screen.getByRole('dialog').parentElement; 
    if (!overlay) throw new Error('Overlay not found');

    fireEvent.mouseDown(overlay);
    fireEvent.mouseUp(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when clicking inside the modal', () => {
    setup();

    const modalContent = screen.getByText('Modal Content');
    fireEvent.mouseDown(modalContent);
    fireEvent.mouseUp(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    setup();

    await user.keyboard('{Escape}');

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('focuses modal content when opened', () => {
    setup();

    const modalContent = screen.getByRole('dialog');
    expect(modalContent).toHaveFocus();
  });

  test('cleans up event listeners on unmount', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = setup();

    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
  });
});