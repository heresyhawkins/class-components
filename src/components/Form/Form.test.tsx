import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Form from './Form';
import { renderWithProviders } from '../../utils/test-utils';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

const TestRouter = ({ children }: { children: React.ReactNode }) => {
  const router = createMemoryRouter(
    [{ path: '/page/1', element: children }],
    { initialEntries: ['/page/1'], initialIndex: 0 }
  );
  return <RouterProvider router={router} />;
};

describe('Form', () => {
  it('should render search input and button', () => {
    renderWithProviders(<TestRouter><Form /></TestRouter>);

    expect(screen.getByPlaceholderText('Write Something')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });
});