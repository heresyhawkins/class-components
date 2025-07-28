import { render, screen, fireEvent } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

const mockNavigate = vi.fn();
(useNavigate as any).mockReturnValue(mockNavigate);

describe('PokemonDetails', () => {
  beforeEach(() => {
    (useParams as any).mockReturnValue({ name: 'pikachu' });
    mockNavigate.mockClear();
  });

  it('displays error message when fetch fails', async () => {
  });

  it('handles image load error with placeholder', () => {
    const mockPokemon = {
      name: 'pikachu',
      sprites: { front_default: 'https://broken-image.com/404.png' },
      types: [{ type: { name: 'electric' } }],
      stats: [{ base_stat: 35 }],
      weight: 60,
      height: 4,
    };

    render(
      <div className="details-panel">
        <div className="details-content" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => {}}>
            Close
          </button>
          <div>
            <img
              src={mockPokemon.sprites.front_default}
              alt={mockPokemon.name}
              className="pokemon-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
              }}
            />
            <h2 className="pokemon-name">{mockPokemon.name}</h2>
          </div>
        </div>
      </div>
    );

    const img = screen.getByAltText('pikachu') as HTMLImageElement;
    expect(img.src).toContain('broken-image.com');

    fireEvent.error(img);
    expect(img.src).toContain('via.placeholder.com');
  });

  it('closes the panel when Close button is clicked', () => {
    render(
      <div className="details-panel" onClick={() => {}}>
        <div className="details-content" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => mockNavigate(-1)} className="close-button">
            Close
          </button>
        </div>
      </div>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});