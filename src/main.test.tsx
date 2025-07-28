import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRouter';
import { describe, it, expect, vi } from 'vitest';

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
    (createRoot as any).mockImplementation(() => ({
      render: mockRender,
    }));

    await import('./main.tsx'); 

    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(mockRender).toHaveBeenCalledWith(<RouterProvider router={router} />);
  });
});