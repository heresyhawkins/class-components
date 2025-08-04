import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { togglePokemon } from '../../store/selectedPokemonSlice';
import { Pokemon } from '../../types/PokemonTypes';
import './ResultsList.css';

interface ResultsListProps {
  pokemons: Pokemon[];
  onPokemonClick?: (name: string) => void;
}

export default function ResultsList({ pokemons, onPokemonClick }: ResultsListProps) {
  const { selectedPokemons } = useAppSelector((state) => state.selectedPokemon);
  const dispatch = useAppDispatch();

  const selectedNames = new Set(selectedPokemons.map((p) => p.name));

  if (pokemons.length === 0) {
    return <div className="no-results">No Pokémon found.</div>;
  }

  return (
    <ul className="pokemon-list">
      {pokemons.map((pokemon) => (
        <li key={pokemon.id} className="pokemon-card">
          <div className="pokemon-checkbox">
            <input
              type="checkbox"
              id={`select-${pokemon.name}`}
              checked={selectedNames.has(pokemon.name)}
              onChange={() =>
                dispatch(
                  togglePokemon({
                    name: pokemon.name,
                    url: `https://pokeapi.co/api/v2/pokemon/${pokemon.name}/`,
                    imageUrl: undefined,
                    types: pokemon.types.map((t) => t.type.name),
                    weight: pokemon.weight,
                    height: pokemon.height,
                  })
                )
              }
            />
            <label htmlFor={`select-${pokemon.name}`}></label>
          </div>
          <div
            className="pokemon-card-content"
            onClick={() => onPokemonClick?.(pokemon.name)}
            role="button"
            tabIndex={0}
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
          </div>
        </li>
      ))}
    </ul>
  );
}
