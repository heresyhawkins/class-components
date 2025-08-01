import { useTheme } from '../../context/ThemeContext';

export default function ThemeSelector() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-selector">
      <label>
        <input type="radio" checked={theme === 'light'} onChange={toggleTheme} />
        Light
      </label>
      <label>
        <input type="radio" checked={theme === 'dark'} onChange={toggleTheme} />
        Dark
      </label>
    </div>
  );
}
