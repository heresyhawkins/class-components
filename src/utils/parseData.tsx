import { CountryData, DisplayValue, YearlyData } from '../types';

export function getLatestPopulation(data: CountryData): number | 'N/A' {
  const sorted = [...data].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  return sorted[0]?.population ?? 'N/A';
}

export function getCountryInfo(
  country: string,
  data: CountryData
): {
  name: string;
  iso_code: DisplayValue<string>;
  population: number | 'N/A';
} {
  if (!data || data.length === 0) {
    return { name: country, iso_code: 'N/A', population: 'N/A' };
  }

  return {
    name: country,
    iso_code: data[0]?.iso_code ?? 'N/A',
    population: getLatestPopulation(data),
  };
}

export function getYearlyDataForYear(data: CountryData, year: number): YearlyData {
  return data.find((d) => d.year === year) ?? {};
}
