import './App.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

import { Form } from './components/Form/Form';

function App() {
  return (
    <>
      <ErrorBoundary>
        <ErrorTriggerButton />
        <Form />
      </ErrorBoundary>
    </>
  );
}
const ErrorTriggerButton = () => {
  const throwError = () => {
    throw new Error('Test error thrown intentionally!');
  };

  return (
    <div>
      <button onClick={throwError}>Throw Error</button>
    </div>
  );
};

export default App;
