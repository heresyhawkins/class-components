import { useEffect, useState } from 'react';

export const useErrorBoundary = () => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const triggerError = (error: Error) => {
    setError(error);
    setHasError(true);
    console.error('Error caught by boundary:', error);
  };

  const resetError = () => {
    setHasError(false);
    setError(null);
  };

  return { hasError, error, triggerError, resetError };
};
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const { hasError, error, resetError } = useErrorBoundary();

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error(event);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="error-fallback">
        <h2>Something went wrong.</h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>{error?.toString()}</details>
        <button type="button" onClick={resetError}>
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
