import React from 'react';

interface PaginationControlsProps {
  pagination: {
    offset: number;
    limit: number;
    total: number | null;
  };
  onPageChange: (newOffset: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange,
}) => {
  const { offset, limit, total } = pagination;

  const handlePrev = () => {
    if (offset - limit >= 0) {
      onPageChange(offset - limit);
    }
  };

  const handleNext = () => {
    if (total === null || offset + limit < (total ?? 0)) {
      onPageChange(offset + limit);
    }
  };

  return (
    <div className="pagination-controls">
      <button type="button" onClick={handlePrev} disabled={offset === 0}>
        Previous
      </button>
      <span>
        Page {Math.floor(offset / limit) + 1}{' '}
        {total !== null ? `of ${Math.ceil(total / limit)}` : ''}
      </span>
      <button
        type="button"
        onClick={handleNext}
        disabled={total !== null && offset + limit >= total}
      >
        Next
      </button>
    </div>
  );
};
