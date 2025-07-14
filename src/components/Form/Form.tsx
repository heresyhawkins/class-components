import React, { Component } from 'react';
import { SearchInput } from '../SearchInput/SearchInput';
import { SearchButton } from '../SearchButton/SearchButton';
import './Form.css';
import { Pokemon, APIResourceList, NamedAPIResource } from '../../types/PokemonTypes';
import PokemonList from '../ResultsList/ResultsList';
import PaginationControls from '../PaginationControls/PaginationControls';

interface FormState {
  data: Pokemon[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filteredResults: Pokemon[];
  pagination: {
    offset: number;
    limit: number;
    total: number | null;
  };
}

const INITIAL_PAGINATION = {
  offset: 0,
  limit: 20,
  total: null as number | null,
};

const SEARCH_TERM_KEY = 'pokemon_search_term';

class Form extends Component<object, FormState> {
  constructor(props: object) {
    super(props);
    const savedSearchTerm = localStorage.getItem(SEARCH_TERM_KEY) ?? '';

    this.state = {
      data: [] as Pokemon[],
      loading: true,
      error: null,
      searchTerm: savedSearchTerm,
      filteredResults: [] as Pokemon[],
      pagination: { ...INITIAL_PAGINATION },
    };
  }

  fetchData = async (offset = 0, limit = INITIAL_PAGINATION.limit) => {
    try {
      this.setState({ loading: true });

      const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Failed to load Pokémon data');

      const result = (await response.json()) as APIResourceList<NamedAPIResource>;

      const pokemonPromises = result.results.map(async (item) => {
        const res = await fetch(item.url);
        return res.json() as Promise<Pokemon>;
      });

      const pokemonData = await Promise.all(pokemonPromises);

      this.setState((prevState) => {
        const newState = {
          data: pokemonData,
          filteredResults: prevState.searchTerm
            ? pokemonData.filter((p) =>
                p.name.toLowerCase().includes(prevState.searchTerm.trim().toLowerCase())
              )
            : pokemonData,
          pagination: {
            ...prevState.pagination,
            total: result.count,
          },
          error: null,
        };
        return newState;
      });
    } catch (err) {
      console.error(err);
      this.setState({
        error: 'Failed to load Pokémon data.',
        loading: false,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  componentDidMount() {
    void this.fetchData(this.state.pagination.offset, this.state.pagination.limit);
  }
  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    this.setState({ searchTerm: term });

    localStorage.setItem(SEARCH_TERM_KEY, term);
  };

  handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.setState((prevState) => {
      const term = prevState.searchTerm.trim().toLowerCase();
      const filtered = prevState.data.filter((item) => item.name.toLowerCase().includes(term));

      return { filteredResults: filtered };
    });
  };

  handlePageChange = (newOffset: number) => {
    this.setState((prevState) => {
      const newPagination = {
        ...prevState.pagination,
        offset: newOffset,
      };

      void this.fetchData(newPagination.offset, newPagination.limit);

      return { pagination: newPagination };
    });
  };

  render() {
    const { loading, error, filteredResults, pagination, searchTerm } = this.state;

    return (
      <form className="form-action" onSubmit={this.handleSearch}>
        <div className="button-form">
          <SearchInput
            placeholder="Write Something"
            value={searchTerm}
            onChange={this.handleInputChange}
          />
          <SearchButton textContent="Search" />
        </div>

        <div className="results-form">
          <h2>Results:</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className="error-box">
              <p>{error}</p>
            </div>
          ) : filteredResults.length > 0 ? (
            <>
              <PokemonList pokemons={filteredResults} />
              <PaginationControls pagination={pagination} onPageChange={this.handlePageChange} />
            </>
          ) : (
            <div className="no-results">
              <p>No results found.</p>
            </div>
          )}
        </div>
      </form>
    );
  }
}

export default Form;
