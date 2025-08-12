import { useParams, useNavigate } from 'react-router-dom';
import { useGetPokemonByNameQuery } from '../store/pokemonApiSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import './PokemonDetails.scss';

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

function isSerializedError(error: unknown): error is SerializedError {
  return typeof error === 'object' && error != null && 'message' in error;
}

export default function PokemonDetails() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const { data: pokemon, error, isLoading } = useGetPokemonByNameQuery(name!, { skip: !name });

  const close = () => void navigate(-1);

  let errorMessage = 'Failed to load Pokémon';

  if (isFetchBaseQueryError(error)) {
    errorMessage = `Error: ${error.status}`;
  } else if (isSerializedError(error)) {
    errorMessage = error.message ?? errorMessage;
  }

  return (
    <div className="details-panel" onClick={close}>
      <div className="details-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={close} className="close-button">
          Close
        </button>

        {error && <p>{errorMessage}</p>}
        {isLoading && <p>Loading...</p>}
        {pokemon && (
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
        )}
      </div>
    </div>
  );
}
