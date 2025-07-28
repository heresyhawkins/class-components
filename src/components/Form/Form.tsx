import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

export default function Form() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const savedSearchTerm = localStorage.getItem(SEARCH_STORAGE_KEY) ?? '';
  const urlPage = parseInt(searchParams.get('page') ?? String(DEFAULT_PAGE), 10);
  const initialPage = isNaN(urlPage) || urlPage < MIN_PAGE ? MIN_PAGE : urlPage;
  const initialOffset = calculateOffset(initialPage);

  const [state, setState] = useState<{
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
  }>({
    data: [],
    loading: true,
    error: null,
    searchTerm: savedSearchTerm,
    filteredResults: [],
    pagination: {
      offset: initialOffset,
      limit: POKEMON_LIMIT_PER_PAGE,
      total: null,
    },
  });

  const fetchData = async (offset = 0, limit = POKEMON_LIMIT_PER_PAGE) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      const url = `${BASE_POKEMON_URL}?offset=${offset}&limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Failed to load Pokémon data');

      const result = (await response.json()) as APIResourceList<NamedAPIResource>;

      const pokemonPromises = result.results.map(async (item) => {
        const res = await fetch(item.url);
        return res.json() as Promise<Pokemon>;
      });

      const pokemonData = await Promise.all(pokemonPromises);

      setState((prev) => {
        const filtered = prev.searchTerm
          ? pokemonData.filter((p) =>
              p.name.toLowerCase().includes(prev.searchTerm.trim().toLowerCase())
            )
          : pokemonData;

        return {
          ...prev,
          data: pokemonData,
          filteredResults: filtered,
          pagination: { ...prev.pagination, total: result.count },
          error: null,
          loading: false,
        };
      });
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        error: 'Failed to load Pokémon data.',
        loading: false,
      }));
    }
  };

  useEffect(() => {
    void fetchData(state.pagination.offset, POKEMON_LIMIT_PER_PAGE);
  }, [state.pagination.offset]);

  useEffect(() => {
    const currentPage = calculatePage(state.pagination.offset);
    const params = new URLSearchParams();

    if (state.searchTerm) params.set('search', state.searchTerm);
    params.set('page', String(currentPage));

    setSearchParams(params, { replace: true });
  }, [state.pagination.offset, state.searchTerm, setSearchParams]);

  useEffect(() => {
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const validPage = isNaN(page) || page < MIN_PAGE ? MIN_PAGE : page;
    const offset = calculateOffset(validPage);

    if (offset !== state.pagination.offset) {
      setState((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, offset },
      }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setState((prev) => ({ ...prev, searchTerm: term }));
    localStorage.setItem(SEARCH_STORAGE_KEY, term);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentPage = calculatePage(state.pagination.offset);
    const params = new URLSearchParams();

    if (state.searchTerm) params.set('search', state.searchTerm);
    params.set('page', String(currentPage));

    void navigate(`/page/${currentPage}?${params.toString()}`);
  };

  const handlePageChange = (newOffset: number) => {
    const newPage = calculatePage(newOffset);
    const params = new URLSearchParams();

    if (state.searchTerm) params.set('search', state.searchTerm);
    params.set('page', String(newPage));

    void navigate(`/page/${newPage}?${params.toString()}`);

    setState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, offset: newOffset },
    }));
  };

  const handlePokemonClick = (name: string) => {
    const currentPage = calculatePage(state.pagination.offset);
    const params = new URLSearchParams();

    if (state.searchTerm) params.set('search', state.searchTerm);
    params.set('page', String(currentPage));

    void navigate(`/page/${currentPage}/pokemon/${name}`);
  };

  const { loading, error, filteredResults, searchTerm } = state;

  return (
    <form className="form-action" onSubmit={handleSearch}>
      <div className="button-form">
        <SearchInput
          placeholder="Write Something"
          value={searchTerm}
          onChange={handleInputChange}
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
            <PokemonList pokemons={filteredResults} onPokemonClick={handlePokemonClick} />
            <PaginationControls pagination={state.pagination} onPageChange={handlePageChange} />
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
