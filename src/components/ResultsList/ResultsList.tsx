import { Component } from 'react';
import { Pokemon } from '../../types/PokemonTypes';
import './ResultsList.css';

interface PokemonListProps {
  pokemons: Pokemon[];
}

class PokemonList extends Component<PokemonListProps> {
  render() {
    const { pokemons } = this.props;

    if (!pokemons.length) {
      return <p>No Pokémon found.</p>;
    }

    return (
      <ul className="pokemon-list">
        {pokemons.map((pokemon) => (
          <li key={pokemon.id} className="pokemon-card">
            <img
              src={pokemon.sprites.front_default ?? ''}
              alt={pokemon.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = ' https://via.placeholder.com/100 ';
              }}
              className="pokemon-image"
            />
            <h3 className="pokemon-name">{pokemon.name}</h3>
            <div className="pokemon-types">
              <strong>Types:</strong> {pokemon.types.map((t) => t.type.name).join(', ') || 'None'}
            </div>
            <div className="pokemon-stats">
              <strong>HP:</strong> {pokemon.stats[0]?.base_stat || 0}
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

export default PokemonList;
