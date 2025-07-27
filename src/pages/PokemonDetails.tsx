import './PokemonDetails.scss';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pokemon } from '../types/PokemonTypes';

export default function PokemonDetails() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const close = () => void navigate(-1);

  useEffect(() => {
    if (!name) return;

    setPokemon(null);
    setError(null);
    setLoading(true);

    fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Pokémon not found');
        return res.json();
      })
      .then((data: Pokemon) => {
        setPokemon(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Failed to fetch Pokémon:', err);
        setError((err as Error).message);
        setLoading(false);
      });
  }, [name]);

  return (
    <div className="details-panel" onClick={close}>
      <div className="details-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={close} className="close-button">
          Close
        </button>

        {error ? (
          <p>Error: {error}</p>
        ) : loading ? (
          <p>Loading...</p>
        ) : pokemon ? (
          <div>
            <img
              src={pokemon.sprites?.front_default ?? undefined}
              alt={pokemon.name}
              className="pokemon-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
              }}
            />
            <h2 className="pokemon-name">{pokemon.name}</h2>
            <div className="pokemon-type">
              <strong>Type:</strong> {pokemon.types.map((t) => t.type.name).join(', ')}
            </div>
            <div className="pokemon-stat">
              <strong>HP:</strong> {pokemon.stats[0].base_stat}
            </div>
            <div className="pokemon-stat">
              <strong>Weight:</strong> {pokemon.weight}
            </div>
            <div className="pokemon-stat">
              <strong>Height:</strong> {pokemon.height}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
