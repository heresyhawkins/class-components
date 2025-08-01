import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRouter';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { ThemeProvider } from './context/ThemeContext';
import React from 'react';

vi.mock('react-dom/client', async () => {
  const actual = await vi.importActual('react-dom/client');
  return {
    ...actual,
    createRoot: vi.fn(),
  };
});

describe('main.tsx', () => {
  it('renders the app into #root with RouterProvider', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    const mockRender = vi.fn();
    const { createRoot } = await import('react-dom/client');

    (createRoot as any).mockImplementation((container: any) => {
      if (!container) throw new Error('Container is null');
      return { render: mockRender };
    });

    await import('./main.tsx');

    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(mockRender).toHaveBeenCalled();

    const rootElement = mockRender.mock.calls[0][0];

    expect(rootElement.type).toBe(React.StrictMode);

    const provider = rootElement.props.children;
    expect(provider.type).toBe(Provider);

    const themeProvider = provider.props.children;
    expect(themeProvider.type).toBe(ThemeProvider);

    const routerProvider = themeProvider.props.children;
    expect(routerProvider.type).toBe(RouterProvider);
    expect(routerProvider.props.router).toBe(router);
  });
});