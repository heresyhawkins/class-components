import React from 'react';

interface Props {
  value: string;
  onChange: (region: string) => void;
  options: readonly string[];
}

const RegionFilter: React.FC<Props> = ({ value, onChange, options }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">All Regions</option>
      {options.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
};

export default RegionFilter;
