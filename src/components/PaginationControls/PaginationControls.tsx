interface PaginationControlsProps {
  pagination: {
    offset: number;
    limit: number;
    total: number | null;
  };
  onPageChange: (newOffset: number) => void;
}

export default function PaginationControls({ pagination, onPageChange }: PaginationControlsProps) {
  const { offset, limit, total } = pagination;

  const handlePrev = () => {
    if (offset - limit >= 0) {
      onPageChange(offset - limit);
    }
  };

  const handleNext = () => {
    if (total === null || offset + limit < total) {
      onPageChange(offset + limit);
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = total !== null ? Math.ceil(total / limit) : null;

  return (
    <div className="pagination-controls">
      <button type="button" onClick={handlePrev} disabled={offset === 0}>
        Previous
      </button>
      <span>
        Page {currentPage} {totalPages !== null ? `of ${totalPages}` : ''}
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
}
