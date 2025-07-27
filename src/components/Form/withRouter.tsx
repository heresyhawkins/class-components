import { useNavigate, useSearchParams } from 'react-router-dom';
import { ComponentType } from 'react';

interface WithRouterProps {
  navigate?: (path: string) => void;
  searchParams?: URLSearchParams;
}

function withRouter<T extends WithRouterProps>(Component: ComponentType<T>) {
  return (props: Omit<T, 'navigate' | 'searchParams'>) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const safeNavigate = (path: string) => {
      void navigate(path);
    };

    return <Component {...(props as T)} navigate={safeNavigate} searchParams={searchParams} />;
  };
}

export default withRouter;
