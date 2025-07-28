import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from './About';
import { describe, it, expect } from 'vitest';

describe('About', () => {
  it('renders the About page with correct content', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About');

    const authorLink = screen.getByRole('link', { name: 'heresyhawkins' });
    expect(authorLink).toHaveAttribute('href', 'https://github.com/heresyhawkins');


    const rsSchoolLink = screen.getByRole('link', { name: 'RS School React Course' });
    expect(rsSchoolLink).toHaveAttribute('href', 'https://rs.school/react/');
    expect(rsSchoolLink).toHaveAttribute('target', '_blank');
    expect(rsSchoolLink).toHaveAttribute('rel', 'noreferrer');

    const backLink = screen.getByRole('link', { name: '← Back to App' });
    expect(backLink).toHaveAttribute('href', '/');
    expect(backLink).toHaveClass('about-back-link');
  });
});