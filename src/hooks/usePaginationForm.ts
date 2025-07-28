import { useEffect, useState } from 'react';

export function usePaginationFromUrl() {
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = parseInt(params.get('page') ?? '1', 10);
    setPage(isNaN(p) || p < 1 ? 1 : p);
  }, []);

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    if (newPage > 1) {
      params.set('page', newPage.toString());
    } else {
      params.delete('page');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    setPage(newPage);
  };

  return { page, updatePage };
}
