import { FC, useEffect, useState } from 'react';
import { SearchInput } from '../SearchInput/SearchInput';
import { SearchButton } from '../SearchButton/SearchButton';
import { ResultsList } from '../ResultsList/ResultsList';
import { PaginationControls } from '../PaginationControls/PaginationControls';
import './Form.css';

interface INamedApiResource {
  name: string;
  url: string;
}

interface PaginationState {
  offset: number;
  limit: number;
  total: number | null;
}

interface INamedAPIResourceList {
  count: number;
  next: string | null;
  previous: string | null;
  results: INamedApiResource[];
}

interface IAbilityEffectEntry {
  effect: string;
  language: INamedApiResource;
}

interface IAbility {
  name: string;
  effect_entries: IAbilityEffectEntry[];
}

interface IPokeAPIAbilityResponse {
  name: string;
  effect_entries: IAbilityEffectEntry[];
}

const INITIAL_PAGINATION: PaginationState = {
  offset: 0,
  limit: 20,
  total: null,
};

const LIMIT_ELEMENT = 20;

export const Form: FC = () => {
  const [data, setData] = useState<IAbility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredResults, setFilteredResults] = useState<IAbility[]>([]);
  const [pagination, setPagination] = useState<PaginationState>(INITIAL_PAGINATION);

  const fetchData = async (offset = 0, limit = LIMIT_ELEMENT) => {
    try {
      setLoading(true);
      const url = `https://pokeapi.co/api/v2/ability?offset=${offset}&limit=${limit}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load data');
      const result = (await response.json()) as INamedAPIResourceList;

      const abilitiesPromises = result.results.map(async (item) => {
        const abilityResponse = await fetch(item.url);
        if (!abilityResponse.ok) throw new Error(`Failed to load ability: ${item.name}`);
        return abilityResponse.json() as Promise<IPokeAPIAbilityResponse>;
      });

      const abilitiesData = await Promise.all(abilitiesPromises);

      const mappedData = abilitiesData.map((ability) => ({
        name: ability.name,
        effect_entries: ability.effect_entries ?? [],
      }));

      setData(mappedData);
      setFilteredResults(mappedData);
      setPagination((prev) => ({ ...prev, total: result.count }));
    } catch (err) {
      setError('Failed to load data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData(pagination.offset, pagination.limit);
  }, [pagination.limit, pagination.offset]);

  const handlePageChange = (newOffset: number) => {
    setPagination((prev) => ({ ...prev, offset: newOffset }));
    void fetchData(newOffset, pagination.limit);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();

    if (term) {
      const filtered = data.filter((item) => item.name.toLowerCase().includes(term));
      setFilteredResults(filtered);
    } else {
      setFilteredResults(data);
    }
  };

  return (
    <form className="form-action" onSubmit={handleSearch}>
      <div className="button-form">
        <SearchInput
          placeholder="Write Something"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            <ResultsList results={filteredResults} />
            <PaginationControls pagination={pagination} onPageChange={handlePageChange} />
          </>
        ) : (
          <div className="no-results">
            <p>No results found.</p>
          </div>
        )}
      </div>
    </form>
  );
};
