import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchButton } from './SearchButton';

describe('SearchButton Component', () => {
  it('should render button with provided text content', () => {
    render(<SearchButton textContent="Search" />);

    const buttonElement = screen.getByRole('button', { name: /Search/i });

    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('Search');
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });

  it('should render button without text content', () => {
    render(<SearchButton />);

    const buttonElement = screen.getByRole('button');

    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute('type', 'submit');
    expect(buttonElement).toBeEmptyDOMElement();
  });
});
