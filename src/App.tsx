import './App.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <>
      <ErrorBoundary>
        <ErrorTriggerButton />
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
      <button type="button" onClick={throwError}>
        Throw Error
      </button>
    </div>
  );
};

export default App;
