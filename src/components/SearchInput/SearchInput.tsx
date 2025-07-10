import { FC } from 'react';

interface InputProps {
  value?: string;
  placeholder?: string;
}

export const SearchInput: FC<InputProps> = ({ placeholder }) => {
  return (
    <div className="search-input">
      <input type="text" placeholder={placeholder} />
    </div>
  );
};
