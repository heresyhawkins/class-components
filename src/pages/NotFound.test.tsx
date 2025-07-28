import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';
import { describe, it, expect } from 'vitest';

describe('NotFound', () => {
  it('renders the 404 error message and home link', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404 — Not Found');

    expect(screen.getByText('The page you\'re looking for does not exist.')).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: /go home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).toHaveClass('home-link');
  });
});