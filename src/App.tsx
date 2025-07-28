import './App.css';
import { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Form from './components/Form/Form';

function App() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    throw new Error('Test error thrown intentionally!');
  }

  const triggerError = () => {
    setHasError(true);
  };

  return (
    <ErrorBoundary>
      <div>
        <button type="button" onClick={triggerError}>
          Throw Error
        </button>
      </div>
      <Form />
    </ErrorBoundary>
  );
}

export default App;
