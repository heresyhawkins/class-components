import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchButton } from './SearchButton';

describe('SearchButton Component', () => {
  it('should render button with provided text content', () => {
    render(<SearchButton textContent="Search" />);
    const button = screen.getByRole('button', { name: /Search/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Search');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should render button without text content', () => {
    render(<SearchButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeEmptyDOMElement();
  });
});
