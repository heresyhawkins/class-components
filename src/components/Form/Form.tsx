import { FC, useEffect, useState } from 'react';
import { SearchInput } from '../SearchInput/SearchInput';
import { SearchButton } from '../SearchButton/SearchButton';
import './Form.css';
interface INamedApiResource {
  name: string;
  url: string;
}

interface INamedApiResourceList {
  count: number;
  next: string | null;
  previous: string | null;
  results: INamedApiResource[];
}

export const Form: FC = () => {
  const [data, setData] = useState<INamedApiResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async (url = 'https://pokeapi.co/api/v2/ability') => {
    try {
      const response = await fetch(url);
      const result = (await response.json()) as INamedApiResourceList;

      setData(result.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData().catch((error) => {
      console.error(error);
    });
  }, []);

  console.log(data, fetchData);

  return (
    <>
      <form action="" className="form-action">
        <div className="button-form">
          <SearchInput placeholder="Write Something" />
          <SearchButton textContent="Search" />
        </div>
        <div className="results-form">
          <h2>Results:</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {data.map((item, index) => (
                <li key={index}>
                  <strong>{item.name}</strong>: {item.url}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </>
  );
};
