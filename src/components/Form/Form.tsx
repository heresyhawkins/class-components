import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchInput } from '../SearchInput/SearchInput';
import { SearchButton } from '../SearchButton/SearchButton';
import './Form.css';
import { NamedAPIResource } from '../../types/PokemonTypes';
import PokemonList from '../ResultsList/ResultsList';
import PaginationControls from '../PaginationControls/PaginationControls';
import { Link } from 'react-router-dom';
import { useSearchFromLocalStorage } from '../../hooks/useSearchFromLocalStorage';
import { useGetPokemonListQuery } from '../../store/pokemonApiSlice';

const POKEMON_LIMIT_PER_PAGE = 20;
const DEFAULT_PAGE = 1;
const MIN_PAGE = 1;

const calculateOffset = (page: number): number => (page - 1) * POKEMON_LIMIT_PER_PAGE;
const calculatePage = (offset: number): number => Math.floor(offset / POKEMON_LIMIT_PER_PAGE) + 1;

export default function Form() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useSearchFromLocalStorage();

  const urlPage = parseInt(searchParams.get('page') ?? String(DEFAULT_PAGE), 10);
  const initialPage = isNaN(urlPage) || urlPage < MIN_PAGE ? MIN_PAGE : urlPage;
  const initialOffset = calculateOffset(initialPage);

  const [offset, setOffset] = useState(initialOffset);

  const {
    data: pokemonListData,
    error,
    isLoading,
    refetch,
  } = useGetPokemonListQuery({ offset, limit: POKEMON_LIMIT_PER_PAGE });

  useEffect(() => {
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const validPage = isNaN(page) || page < MIN_PAGE ? MIN_PAGE : page;
    const newOffset = calculateOffset(validPage);
    if (newOffset !== offset) {
      setOffset(newOffset);
    }
  }, [searchParams]);

  const [filteredResults, setFilteredResults] = useState<NamedAPIResource[]>([]);

  useEffect(() => {
    if (pokemonListData?.results) {
      const filtered = searchTerm
        ? pokemonListData.results.filter((p) =>
            p.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
          )
        : pokemonListData.results;
      setFilteredResults(filtered);
    }
  }, [pokemonListData, searchTerm]);

  useEffect(() => {
    const currentPage = calculatePage(offset);
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', String(currentPage));
    setSearchParams(params, { replace: true });
  }, [offset, searchTerm, setSearchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentPage = calculatePage(offset);
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', String(currentPage));
    void navigate(`/page/${currentPage}?${params.toString()}`);
  };

  const handlePageChange = (newOffset: number) => {
    const newPage = calculatePage(newOffset);
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', String(newPage));
    void navigate(`/page/${newPage}?${params.toString()}`);
    setOffset(newOffset);
  };

  const handlePokemonClick = (name: string) => {
    const currentPage = calculatePage(offset);
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', String(currentPage));
    void navigate(`/page/${currentPage}/pokemon/${name}`);
  };

  return (
    <form className="form-action" onSubmit={handleSearch}>
      <div className="button-form">
        <SearchInput
          placeholder="Write Something"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <SearchButton textContent="Search" />
        <button type="button" onClick={() => void refetch()} className="refresh-button">
          Refresh
        </button>
      </div>

      <div className="results-form">
        <h2>Results:</h2>
        <Link to="/about" className="about-link">
          About Us
        </Link>

        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="error-box">
            <p>Failed to load Pokémon data.</p>
          </div>
        ) : filteredResults.length > 0 ? (
          <>
            <PokemonList pokemons={filteredResults} onPokemonClick={handlePokemonClick} />
            <PaginationControls
              pagination={{
                offset,
                limit: POKEMON_LIMIT_PER_PAGE,
                total: pokemonListData?.count ?? null,
              }}
              onPageChange={handlePageChange}
            />
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
