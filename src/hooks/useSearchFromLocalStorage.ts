import { useState, useEffect, useCallback } from 'react';

const SEARCH_STORAGE_KEY = 'pokemon_search_term';

export const useSearchFromLocalStorage = () => {
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    const saved = localStorage.getItem(SEARCH_STORAGE_KEY);
    return saved ?? '';
  });

  useEffect(() => {
    localStorage.setItem(SEARCH_STORAGE_KEY, searchTerm);
  }, [searchTerm]);

  const setSearchAndReturn = useCallback(
    (value: string | ((prev: string) => string)) => {
      const newValue = typeof value === 'function' ? value(searchTerm) : value;
      localStorage.setItem(SEARCH_STORAGE_KEY, newValue);
      setSearchTerm(newValue);
      return newValue;
    },
    [searchTerm]
  );

  return [searchTerm, setSearchAndReturn] as const;
};
