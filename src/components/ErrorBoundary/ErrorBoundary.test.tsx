import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';

const Bomb = () => {
  throw new Error('💥 KABOOM');
};

describe('ErrorBoundary', () => {
  const originalError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>I am fine!</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('I am fine!')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument();
  });

  it('should catch an error and render fallback UI', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('💥 KABOOM'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should log the error and errorInfo in componentDidCatch', () => {
    const consoleSpy = console.error as jest.Mock;
    consoleSpy.mockClear();

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalled();

    const call = consoleSpy.mock.calls[0];

    expect(call[1]).toBeInstanceOf(Error);
    expect(call[1]?.message).toBe('💥 KABOOM');
  });

  it('should retry rendering children after "Try again" button click', () => {
    let shouldThrow = true;

    const TestComponent = () => {
      if (shouldThrow) {
        throw new Error('Oops');
      }
      return <div>Recovered!</div>;
    };

    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    shouldThrow = false;

    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Recovered!')).toBeInTheDocument();
  });
});
