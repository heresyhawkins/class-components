import React from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search country..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="search-bar"
    />
  );
};

export default SearchBar;
