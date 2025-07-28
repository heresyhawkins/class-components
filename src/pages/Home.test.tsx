import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import { describe, it, expect } from 'vitest';

describe('Home', () => {
  it('renders the Form component', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Write Something')).toBeInTheDocument();
  });

  it('renders nested route content in Outlet when navigating', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="about" element={<div data-testid="about-content">About Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Write Something')).toBeInTheDocument();
    expect(screen.getByTestId('about-content')).toBeInTheDocument();
  });
});