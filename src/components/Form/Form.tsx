import React, { Component } from 'react';
import { SearchInput } from '../SearchInput/SearchInput';
import { SearchButton } from '../SearchButton/SearchButton';
import './Form.css';
import { Pokemon, APIResourceList, NamedAPIResource } from '../../types/PokemonTypes';
import PokemonList from '../ResultsList/ResultsList';
import PaginationControls from '../PaginationControls/PaginationControls';
import { Link } from 'react-router-dom';

const POKEMON_LIMIT_PER_PAGE = 20;
const DEFAULT_PAGE = 1;
const MIN_PAGE = 1;
const SEARCH_STORAGE_KEY = 'pokemon_search_term';
const BASE_POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon';

const calculateOffset = (page: number): number => (page - 1) * POKEMON_LIMIT_PER_PAGE;
const calculatePage = (offset: number): number => Math.floor(offset / POKEMON_LIMIT_PER_PAGE) + 1;

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
  offset: calculateOffset(DEFAULT_PAGE),
  limit: POKEMON_LIMIT_PER_PAGE,
  total: null as number | null,
};

class Form extends Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);
    const savedSearchTerm = localStorage.getItem(SEARCH_STORAGE_KEY) ?? '';
    const urlPage = this.getPageFromParams(props.searchParams);
    const offset = calculateOffset(urlPage);

    this.state = {
      data: [] as Pokemon[],
      loading: true,
      error: null,
      searchTerm: savedSearchTerm,
      filteredResults: [] as Pokemon[],
      pagination: { ...INITIAL_PAGINATION, offset },
    };
  }

  private getPageFromParams = (searchParams?: URLSearchParams): number => {
    const pageParam = searchParams?.get('page');
    const page = parseInt(pageParam ?? String(DEFAULT_PAGE), 10);
    return isNaN(page) || page < MIN_PAGE ? MIN_PAGE : page;
  };

  fetchData = async (offset = 0, limit = POKEMON_LIMIT_PER_PAGE) => {
    try {
      this.setState({ loading: true });

      const url = `${BASE_POKEMON_URL}?offset=${offset}&limit=${limit}`;
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
    const prevPage = this.getPageFromParams(prevProps.searchParams);
    const currentPage = this.getPageFromParams(searchParams);

    if (currentPage !== prevPage) {
      const offset = calculateOffset(currentPage);

      this.setState(
        (prevState) => ({
          pagination: { ...prevState.pagination, offset },
        }),
        () => {
          void this.fetchData(offset, POKEMON_LIMIT_PER_PAGE);
        }
      );
    }

    const prevSearch = prevProps.searchParams?.get('search');
    const currentSearch = searchParams?.get('search');

    if (currentSearch !== prevSearch) {
      const { searchTerm } = this.state;
      const filtered = this.state.data.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
      this.setState({ filteredResults: filtered });
    }
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    this.setState({ searchTerm: term });
    localStorage.setItem(SEARCH_STORAGE_KEY, term);
  };

  handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { navigate } = this.props;
    const { searchTerm } = this.state;
    const currentPage = calculatePage(this.state.pagination.offset);

    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', String(currentPage));

    navigate?.(`/page/${currentPage}?${params.toString()}`);
  };

  handlePageChange = (newOffset: number) => {
    const { navigate } = this.props;
    const { searchTerm } = this.state;
    const newPage = calculatePage(newOffset);

    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', String(newPage));

    navigate?.(`/page/${newPage}?${params.toString()}`);

    this.setState(
      (prevState) => ({
        pagination: { ...prevState.pagination, offset: newOffset },
      }),
      () => {
        void this.fetchData(newOffset, POKEMON_LIMIT_PER_PAGE);
      }
    );
  };

  handlePokemonClick = (name: string) => {
    const { navigate, searchParams } = this.props;
    const { searchTerm } = this.state;

    if (!navigate) {
      console.error('navigate is not available');
      return;
    }

    const currentPage = this.getPageFromParams(searchParams);

    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', String(currentPage));

    navigate(`/page/${currentPage}/pokemon/${name}`);
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
          <Link to="/about" className="about-link">
            About Us
          </Link>

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
