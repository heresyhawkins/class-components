import React, { useMemo } from 'react';
import DataTable from './DataTable';
import { getCountryInfo } from '../utils/parseData';
import { CountryData, DataColumn } from '../types';

interface Props {
  country: string;
  data: CountryData;
  year: number;
  selectedColumns: DataColumn[];
}

const CountryCard = React.memo(function CountryCard({
  country,
  data,
  year,
  selectedColumns,
}: Props) {
  const info = useMemo(() => getCountryInfo(country, data), [country, data]);

  return (
    <div className="country-card">
      <h3>
        {info.name} {info.iso_code !== 'N/A' && `(${info.iso_code})`}
      </h3>
      <p>
        <strong>Latest Population:</strong>{' '}
        {info.population !== 'N/A' ? info.population.toLocaleString() : 'N/A'}
      </p>
      <DataTable data={data} year={year} selectedColumns={selectedColumns} />
    </div>
  );
});

export default CountryCard;
