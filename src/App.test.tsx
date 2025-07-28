import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { describe, it, expect } from 'vitest';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('App', () => {
  it('renders without crashing and shows ErrorTriggerButton and Form', () => {
    renderWithRouter(<App />);

    expect(screen.getByText('Throw Error')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write Something')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

});