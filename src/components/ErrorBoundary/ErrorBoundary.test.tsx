
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';

vi.spyOn(console, 'error').mockImplementation(() => {});


const Bomb = () => {
  throw new Error('Kaboom!');
};

const ErrorTrigger = () => {
  const [hasError, setHasError] = useState(false);
  if (hasError) throw new Error('Test error in render');

  return (
    <button type="button" onClick={() => setHasError(true)}>
      Crash me
    </button>
  );
};


const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    renderWithRouter(
      <ErrorBoundary>
        <div data-testid="safe-child">All good</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('safe-child')).toBeInTheDocument();
  });

  it('catches an error thrown during rendering and shows fallback UI', () => {
    renderWithRouter(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Kaboom!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('shows error details in <details> tag', () => {
    renderWithRouter(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    const details = screen.getByRole('group');
    expect(details).toHaveTextContent('Error: Kaboom!');
  });

  it('resets the error state when "Try again" button is clicked', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ErrorTrigger />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /crash me/i }));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(screen.getByRole('button', { name: /crash me/i })).toBeInTheDocument();
  });

  it('calls componentDidCatch with error and errorInfo', () => {
    const mockComponentDidCatch = vi.spyOn(
      ErrorBoundary.prototype,
      'componentDidCatch'
    );

    renderWithRouter(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(mockComponentDidCatch).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.stringContaining('Bomb'),
      })
    );

    mockComponentDidCatch.mockRestore();
  });

  it('does not catch errors in event handlers (expected behavior)', () => {
    const ConsoleError = () => {
      return (
        <button
          type="button"
          onClick={() => {
            throw new Error('Event handler error');
          }}
        >
          Click me
        </button>
      );
    };

    renderWithRouter(
      <ErrorBoundary>
        <ConsoleError />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });
});