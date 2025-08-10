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
      {pokemons.map((pokemon) => (
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
            <h3 className="pokemon-name">{pokemon.name}</h3>
            <p className="pokemon-loading">Details available on click</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
