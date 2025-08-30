import React from 'react';

interface Props {
  value: number;
  onChange: (year: number) => void;
}

const YearSelector: React.FC<Props> = ({ value, onChange }) => {
  const years = Array.from({ length: 60 }, (_, i) => 2020 - i);

  return (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  );
};

export default YearSelector;
