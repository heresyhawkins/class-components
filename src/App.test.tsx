import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';


vi.mock('./components/Form/Form', () => ({
  default: () => <div data-testid="form-component">Pokemon Form</div>,
}));

console.error = vi.fn();

describe('App', () => {
  it('should render Form and ErrorTriggerButton', () => {
    render(<App />);

    expect(screen.getByTestId('form-component')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /throw error/i })).toBeInTheDocument();
  });
});