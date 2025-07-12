import { FC, useEffect, useState } from 'react';
import { SearchInput } from '../SearchInput/SearchInput';
import { SearchButton } from '../SearchButton/SearchButton';
import { ResultsList } from '../ResultsList/ResultsList';
import './Form.css';

interface INamedApiResource {
  name: string;
  url: string;
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

export const Form: FC = () => {
  const [data, setData] = useState<IAbility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredResults, setFilteredResults] = useState<IAbility[]>([]);

  const fetchData = async (url = 'https://pokeapi.co/api/v2/ability ') => {
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error to load list');
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
    } catch (err) {
      setError('Error to load list');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

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
          <ResultsList results={filteredResults} />
        ) : (
          <div className="no-results">
            <p>Empty...</p>
          </div>
        )}
      </div>
    </form>
  );
};
