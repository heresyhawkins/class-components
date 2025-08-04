import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Home from './Home';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider } from '../context/ThemeContext';
import { describe, it, expect } from 'vitest';

describe('Home', () => {
  it('renders the Form component', () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          <RouterProvider
            router={createMemoryRouter(
              [
                {
                  path: '/',
                  element: <Home />,
                },
              ],
              { initialEntries: ['/'], initialIndex: 0 }
            )}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByPlaceholderText('Write Something')).toBeInTheDocument();
  });

  it('renders nested route content in Outlet when navigating', () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          <RouterProvider
            router={createMemoryRouter(
              [
                {
                  path: '/',
                  element: <Home />,
                  children: [
                    { path: 'about', element: <div data-testid="about-content">About Page</div> },
                  ],
                },
              ],
              { initialEntries: ['/about'], initialIndex: 0 }
            )}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByPlaceholderText('Write Something')).toBeInTheDocument();
    expect(screen.getByTestId('about-content')).toBeInTheDocument();
  });
});