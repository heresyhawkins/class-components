import React, { useState } from 'react';
import { DataColumn } from '../types';

interface Props {
  columns: readonly DataColumn[];
  selected: DataColumn[];
  onToggle: (col: DataColumn) => void;
}

const ColumnSelectorModal: React.FC<Props> = ({ columns, selected, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setIsOpen(true)}>
        ⚙️ Select Columns
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Select Additional Columns</h3>
            <ul>
              {columns.map((col) => (
                <li key={col}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selected.includes(col)}
                      onChange={() => onToggle(col)}
                    />
                    {col.replace('_', ' ')}
                  </label>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setIsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnSelectorModal;
