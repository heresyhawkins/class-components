import { useState, useEffect, use } from 'react';
import { CountryData, DataValue, YearlyData } from '../types';

interface RawCountryInfo {
  iso_code?: string;
  data: YearlyData[];
  [key: string]: DataValue;
}

let dataCache: Record<string, CountryData> | null = null;

async function fetchData(): Promise<Record<string, CountryData>> {
  if (dataCache) {
    return dataCache;
  }

  const response = await fetch('/data/owid-co2-data.json');

  const raw = (await response.json()) as Record<string, RawCountryInfo>;

  const transformed: Record<string, CountryData> = {};

  for (const [country, info] of Object.entries(raw)) {
    if (!info.data || !Array.isArray(info.data)) continue;

    transformed[country] = info.data.map((entry) => {
      const { year, population, co2, co2_per_capita, ...rest } = entry;
      return {
        year,
        population,
        co2,
        co2_per_capita,
        ...rest,
      };
    });
  }

  dataCache = transformed;
  return transformed;
}

export function useData(): Record<string, CountryData> {
  const [dataPromise, setDataPromise] = useState(() => fetchData());

  useEffect(() => {
    if (!dataCache) {
      setDataPromise(fetchData());
    }
  }, []);

  return use(dataPromise);
}
