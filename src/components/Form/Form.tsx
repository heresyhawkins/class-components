import { FC, useState } from 'react';
import { SearchInput } from '../SearchInput/SearchInput';
import { SearchButton } from '../SearchButton/SearchButton';
import './Form.css';

interface INamedApiResourse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { url: string }[];
}

export const Form: FC = () => {
  const [data, setData] = useState<{ url: string }[]>([]);

  const fetchData = async (url = 'https://pokeapi.co/api/v2/ability') => {
    try {
      const response = await fetch(url);
      const result = (await response.json()) as INamedApiResourse;

      setData(result.results);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(data, fetchData);

  return (
    <>
      <form action="" className="form-action">
        <div className="button-form">
          <SearchInput placeholder="Write Something" />
          <SearchButton textContent="Search" />
        </div>
        <div className="results-form"></div>
      </form>
    </>
  );
};
