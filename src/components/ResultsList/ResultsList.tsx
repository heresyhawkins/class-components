import { Pokemon } from '../../types/PokemonTypes';
import './ResultsList.css';

interface ResultsListProps {
  pokemons: Pokemon[];
  onPokemonClick?: (name: string) => void;
}

export default function ResultsList({ pokemons, onPokemonClick }: ResultsListProps) {
  if (pokemons.length === 0) {
    return <div className="no-results">No Pokémon found.</div>;
  }

  return (
    <ul className="pokemon-list">
      {pokemons.map((pokemon) => (
        <li
          key={pokemon.id}
          className="pokemon-card"
          onClick={() => onPokemonClick?.(pokemon.name)}
        >
          <img
            src={pokemon.sprites?.front_default ?? undefined}
            alt={pokemon.name}
            className="pokemon-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
            }}
          />
          <h3 className="pokemon-name">{pokemon.name}</h3>
          <div className="pokemon-types">
            <strong>Types:</strong> {pokemon.types.map((t) => t.type.name).join(', ')}
          </div>
          <div className="pokemon-stats">
            <strong>HP:</strong> {pokemon.stats[0].base_stat}
          </div>
        </li>
      ))}
    </ul>
  );
}
