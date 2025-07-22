import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

describe('SearchInput Component', () => {
  it('should render input with provided placeholder', () => {
    render(<SearchInput placeholder="Write Something" />);
    expect(screen.getByPlaceholderText('Write Something')).toBeInTheDocument();
  });

  it('should call onChange when input value changes', async () => {
    const handleChange = vi.fn();

    render(<SearchInput value="" placeholder="Search..." onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Search...');

    await userEvent.type(input, 'hello');

    expect(handleChange).toHaveBeenCalled();
  });
});
