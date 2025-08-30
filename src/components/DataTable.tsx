import React, { useMemo } from 'react';
import { CountryData, DataValue } from '../types';

interface Props {
  data: CountryData;
  year: number;
  selectedColumns: string[];
}

const DataTable = React.memo(function DataTable({ data, year, selectedColumns }: Props) {
  const columns = useMemo(
    () => [
      'year',
      'population',
      'co2',
      'co2_per_capita',
      ...selectedColumns.filter(
        (col) => !['year', 'population', 'co2', 'co2_per_capita'].includes(col)
      ),
    ],
    [selectedColumns]
  );

  const rows = useMemo(() => {
    return data.map((row) => ({
      ...row,
      changed: row.year === year,
    }));
  }, [data, year]);

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col.replace('_', ' ')}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} className={row.year === year ? 'highlighted-row' : ''}>
            {columns.map((col) => {
              const value = (row as unknown as Record<string, DataValue>)[col];
              return (
                <td key={col}>
                  {value != null ? (typeof value === 'number' ? value.toFixed(3) : value) : 'N/A'}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default DataTable;
