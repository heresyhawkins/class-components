import { Suspense } from 'react';
import { useData } from './hooks/useDataLoader';
import CountryList from './components/CountryList';
import './styles/index.css';

function AppContent() {
  const data = useData();
  const countries = Object.keys(data);

  return (
    <div className="app">
      <h1>🌍 CO₂ Emissions Dashboard</h1>
      <CountryList data={data} countries={countries} />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="spinner">Loading massive dataset...</div>}>
      <AppContent />
    </Suspense>
  );
}
