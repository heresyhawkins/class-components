import { FC } from 'react';

interface ButtonProps {
  textContent?: string;
}

export const SearchButton: FC<ButtonProps> = ({ textContent }) => {
  return (
    <div className="search-button">
      <button type="button">{textContent}</button>
    </div>
  );
};
