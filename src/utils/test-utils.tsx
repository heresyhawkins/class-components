import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../routes/AppRouter';

export const renderWithProviders = (_ui: ReactElement, { router: customRouter = router } = {}) => {
  return render(<RouterProvider router={customRouter} />, {
    wrapper: ({ children }) => <>{children}</>,
  });
};
