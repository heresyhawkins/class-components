import { FC } from 'react';
interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchInput: FC<SearchInputProps> = ({ value, placeholder, onChange }) => {
  return (
    <div className="search-input">
      <input type="text" value={value} placeholder={placeholder} onChange={onChange} />
    </div>
  );
};
