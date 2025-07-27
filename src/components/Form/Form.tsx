import React, { Component } from 'react';
import { SearchInput } from '../SearchInput/SearchInput';
import { SearchButton } from '../SearchButton/SearchButton';
import './Form.css';
import { Pokemon, APIResourceList, NamedAPIResource } from '../../types/PokemonTypes';
import PokemonList from '../ResultsList/ResultsList';
import PaginationControls from '../PaginationControls/PaginationControls';
import { Link } from 'react-router-dom';
interface FormProps {
  navigate?: (path: string) => void;
  searchParams?: URLSearchParams;
}

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

class Form extends Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);
    const savedSearchTerm = localStorage.getItem(SEARCH_TERM_KEY) ?? '';
    const urlPage = props.searchParams?.get('page');
    const page = Math.max(1, parseInt(urlPage ?? '1', 10));
    const offset = (page - 1) * 20;

    this.state = {
      data: [] as Pokemon[],
      loading: true,
      error: null,
      searchTerm: savedSearchTerm,
      filteredResults: [] as Pokemon[],
      pagination: { ...INITIAL_PAGINATION, offset },
    };
  }

  fetchData = async (offset = 0, limit = 20) => {
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

      this.setState((prevState) => ({
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
      }));
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
    const { offset, limit } = this.state.pagination;
    void this.fetchData(offset, limit);
  }

  componentDidUpdate(prevProps: FormProps) {
    const { searchParams } = this.props;
    const prevPage = prevProps.searchParams?.get('page');
    const currentPage = searchParams?.get('page');

    if (currentPage !== prevPage) {
      const page = Math.max(1, parseInt(currentPage ?? '1', 10));
      const offset = (page - 1) * 20;
      this.setState(
        (prevState) => ({
          pagination: { ...prevState.pagination, offset },
        }),
        () => {
          void this.fetchData(offset, 20);
        }
      );
    }
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    this.setState({ searchTerm: term });
    localStorage.setItem(SEARCH_TERM_KEY, term);
  };

  handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { navigate } = this.props;
    const { searchTerm } = this.state;
    const currentPage = Math.floor(this.state.pagination.offset / 20) + 1;

    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', currentPage.toString());

    navigate?.(`/page/${currentPage}?${params.toString()}`);
  };

  handlePageChange = (newOffset: number) => {
    const { navigate } = this.props;
    const { searchTerm } = this.state;
    const newPage = Math.floor(newOffset / 20) + 1;

    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', newPage.toString());

    navigate?.(`/page/${newPage}?${params.toString()}`);

    this.setState(
      (prevState) => ({
        pagination: { ...prevState.pagination, offset: newOffset },
      }),
      () => {
        void this.fetchData(newOffset, 20);
      }
    );
  };

  handlePokemonClick = (name: string) => {
    const { navigate } = this.props;
    const { searchTerm } = this.state;
    const currentPage = Math.floor(this.state.pagination.offset / 20) + 1;

    if (!navigate) {
      console.error('navigate is undefined');
      return;
    }

    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', currentPage.toString());

    if (typeof name !== 'string') {
      console.error('Invalid Pokémon name:', name);
      return;
    }

    navigate(`/page/${currentPage}/pokemon/${name}`);
  };

  render() {
    console.log('navigate exists:', !!this.props.navigate);
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
          <div style={{ marginBottom: '16px' }}>
            <Link to="/about" style={{ color: '#007bff', textDecoration: 'none' }}>
              About Us
            </Link>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className="error-box">
              <p>{error}</p>
            </div>
          ) : filteredResults.length > 0 ? (
            <>
              <PokemonList pokemons={filteredResults} onPokemonClick={this.handlePokemonClick} />
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
