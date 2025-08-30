import { useState, useMemo, useCallback } from 'react';
import CountryCard from './CountryCard';
import SearchBar from './SearchBar';
import YearSelector from './YearSelector';
import RegionFilter from './RegionFilter';
import ColumnSelectorModal from './ColumnSelectorModal';
import { getYearlyDataForYear } from '../utils/parseData';
import { CountryData } from '../types';

const AVAILABLE_REGIONS = [
  'Europe',
  'Asia',
  'Africa',
  'North America',
  'South America',
  'Oceania',
  'International transport',
] as const;

const ALL_COLUMNS = [
  'co2',
  'co2_per_capita',
  'methane',
  'oil_co2',
  'coal_co2',
  'gas_co2',
  'cement_co2',
  'flaring_co2',
  'temperature_change_from_co2',
] as const;

type DataColumn = (typeof ALL_COLUMNS)[number];

export default function CountryList({
  data,
  countries: allCountries,
}: {
  data: Record<string, CountryData>;
  countries: string[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(2020);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'population'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedColumns, setSelectedColumns] = useState<DataColumn[]>(['co2', 'co2_per_capita']);

  const handleSearch = useCallback((term: string) => setSearchTerm(term), []);
  const handleYearChange = useCallback((year: number) => setSelectedYear(year), []);
  const handleRegionChange = useCallback((region: string) => setSelectedRegion(region), []);
  const handleSort = useCallback(
    (key: 'name' | 'population') => {
      setSortKey(key);
      setSortOrder((prev) => (prev === 'asc' && sortKey === key ? 'desc' : 'asc'));
    },
    [sortKey]
  );

  const handleColumnToggle = useCallback((col: DataColumn) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  }, []);

  const filteredCountries = useMemo(() => {
    return allCountries.filter((country) => {
      const entries = data[country];
      if (!entries || !Array.isArray(entries) || entries.length === 0) return false;

      const latest = entries[entries.length - 1];
      const regionMatch = !selectedRegion || latest?.continent === selectedRegion;
      const searchMatch = country.toLowerCase().includes(searchTerm.toLowerCase());

      return regionMatch && searchMatch;
    });
  }, [allCountries, data, selectedRegion, searchTerm]);

  const sortedCountries = useMemo(() => {
    return [...filteredCountries].sort((a, b) => {
      const aData = data[a];
      const bData = data[b];
      const aYearData = getYearlyDataForYear(aData, selectedYear);
      const bYearData = getYearlyDataForYear(bData, selectedYear);

      let aVal: string | number = a;
      let bVal: string | number = b;

      if (sortKey === 'population') {
        aVal = typeof aYearData.population === 'number' ? aYearData.population : 0;
        bVal = typeof bYearData.population === 'number' ? bYearData.population : 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCountries, data, selectedYear, sortKey, sortOrder]);

  return (
    <div className="controls-layout">
      <div className="controls">
        <SearchBar value={searchTerm} onChange={handleSearch} />
        <YearSelector value={selectedYear} onChange={handleYearChange} />
        <RegionFilter
          value={selectedRegion}
          onChange={handleRegionChange}
          options={AVAILABLE_REGIONS}
        />
        <ColumnSelectorModal
          columns={ALL_COLUMNS}
          selected={selectedColumns}
          onToggle={handleColumnToggle}
        />
        <button type="button" onClick={() => handleSort('name')}>
          Sort by Name ({sortOrder})
        </button>
        <button type="button" onClick={() => handleSort('population')}>
          Sort by Population ({sortOrder})
        </button>
      </div>

      <div className="country-list">
        {sortedCountries.map((country) => (
          <CountryCard
            key={country}
            country={country}
            data={data[country]}
            year={selectedYear}
            selectedColumns={selectedColumns}
          />
        ))}
      </div>
    </div>
  );
}
