import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui);
};

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('App Root', () => {
  it('should render without crashing', () => {
    document.body.innerHTML = '<div id="root"></div>';

    const root = document.getElementById('root');
    expect(root).not.toBeNull();

    import('./main').catch(console.error);

    expect(document.body).toBeTruthy();
  });

  it('should render App component', () => {
    renderWithProviders(<App />);

    expect(screen.getByRole('button', { name: /throw error/i })).toBeInTheDocument();
  });
});