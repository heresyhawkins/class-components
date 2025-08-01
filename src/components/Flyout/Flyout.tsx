import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearAll } from '../../store/selectedPokemonSlice';
import './Flyout.css';

export default function Flyout() {
  const { selectedPokemons } = useAppSelector((state) => state.selectedPokemon);
  const dispatch = useAppDispatch();

  if (selectedPokemons.length === 0) return null;

  const handleDownload = () => {
    const headers = ['Name', 'URL', 'Types', 'Weight', 'Height'];
    const rows = selectedPokemons.map((p) => [
      p.name,
      p.url,
      p.types?.join(', ') ?? '',
      p.weight?.toString() ?? '',
      p.height?.toString() ?? '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedPokemons.length}_items.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flyout">
      <span>{selectedPokemons.length} items are selected</span>
      <div className="flyout-buttons">
        <button type="button" onClick={() => dispatch(clearAll())}>
          Unselect all
        </button>
        <button type="button" onClick={handleDownload}>
          Download
        </button>
      </div>
    </div>
  );
}
