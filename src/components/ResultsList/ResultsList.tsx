import React from 'react';
import './ResultsList.css';

interface IAbilityEffectEntry {
  effect: string;
  language: {
    name: string;
  };
}

interface IAbility {
  name: string;
  effect_entries: IAbilityEffectEntry[];
}

interface ResultsListProps {
  results: IAbility[];
}

export const ResultsList: React.FC<ResultsListProps> = ({ results }) => {
  return (
    <ul className="results-list">
      {results.map((item, index) => {
        const englishEffect =
          item.effect_entries.find((entry) => entry.language.name === 'en')?.effect ?? 'Nothing.';

        return (
          <li key={index} className="result-item">
            <strong>{item.name} </strong>
            <span>{englishEffect}</span>
          </li>
        );
      })}
    </ul>
  );
};
