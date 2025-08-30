export type DataValue = number | string | null | undefined | YearlyData[];

export interface YearlyData {
  year?: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  methane?: number;
  oil_co2?: number;
  coal_co2?: number;
  gas_co2?: number;
  cement_co2?: number;
  flaring_co2?: number;
  temperature_change_from_co2?: number;
  iso_code?: string;
  continent?: string;
  [key: string]: DataValue;
}

export type CountryData = YearlyData[];

export type DisplayValue<T = number> = T | 'N/A';

export type DataColumn =
  | 'co2'
  | 'co2_per_capita'
  | 'methane'
  | 'oil_co2'
  | 'coal_co2'
  | 'gas_co2'
  | 'cement_co2'
  | 'flaring_co2'
  | 'temperature_change_from_co2';
