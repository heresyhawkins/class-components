import { FC } from 'react';

interface SearchButtonProps {
  textContent?: string;
}

export const SearchButton: FC<SearchButtonProps> = ({ textContent }) => {
  return (
    <div className="search-button">
      <button type="submit">{textContent}</button>
    </div>
  );
};
