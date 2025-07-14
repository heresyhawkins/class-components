import { Component } from 'react';

interface PaginationControlsProps {
  pagination: {
    offset: number;
    limit: number;
    total: number | null;
  };
  onPageChange: (newOffset: number) => void;
}

class PaginationControls extends Component<PaginationControlsProps> {
  handlePrev = () => {
    const { offset, limit } = this.props.pagination;
    if (offset - limit >= 0) {
      this.props.onPageChange(offset - limit);
    }
  };

  handleNext = () => {
    const { offset, limit, total } = this.props.pagination;
    if (total === null || offset + limit < total) {
      this.props.onPageChange(offset + limit);
    }
  };

  render() {
    const { offset, limit, total } = this.props.pagination;

    return (
      <div className="pagination-controls">
        <button type="button" onClick={this.handlePrev} disabled={offset === 0}>
          Previous
        </button>
        <span>
          Page {Math.floor(offset / limit) + 1}{' '}
          {total !== null ? `of ${Math.ceil(total / limit)}` : ''}
        </span>
        <button
          type="button"
          onClick={this.handleNext}
          disabled={total !== null && offset + limit >= total}
        >
          Next
        </button>
      </div>
    );
  }
}

export default PaginationControls;
