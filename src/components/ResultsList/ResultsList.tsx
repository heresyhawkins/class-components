import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { togglePokemon } from '../../store/selectedPokemonSlice';
import { NamedAPIResource } from '../../types/PokemonTypes';
import './ResultsList.css';

interface ResultsListProps {
  pokemons: NamedAPIResource[];
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
      {pokemons.map((pokemon) => {
        const id = pokemon.url.split('/').filter(Boolean).pop() ?? '';

        return (
          <li key={pokemon.name} className="pokemon-card">
            <div className="pokemon-checkbox">
              <input
                type="checkbox"
                id={`select-${pokemon.name}`}
                checked={selectedNames.has(pokemon.name)}
                onChange={() =>
                  dispatch(
                    togglePokemon({
                      name: pokemon.name,
                      url: pokemon.url,
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
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                alt={pokemon.name}
                className="pokemon-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                }}
              />
              <h3 className="pokemon-name">{pokemon.name}</h3>
              <div className="pokemon-id">#{id}</div>
              <div className="pokemon-loading">Click for details</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
