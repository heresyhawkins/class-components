import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PaginationControls from './PaginationControls';

interface Pagination {
  offset: number;
  limit: number;
  total: number | null;
}

describe('PaginationControls', () => {
  const onPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = (pagination: Pagination) =>
    render(<PaginationControls pagination={pagination} onPageChange={onPageChange} />);

  it('should display correct page info', () => {
    setup({ offset: 20, limit: 20, total: 100 });
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  it('should disable Previous on first page', () => {
    setup({ offset: 0, limit: 20, total: 100 });
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  it('should enable Previous when not on first page', () => {
    setup({ offset: 20, limit: 20, total: 100 });
    expect(screen.getByRole('button', { name: 'Previous' })).not.toBeDisabled();
  });

  it('should disable Next on last page', () => {
    setup({ offset: 80, limit: 20, total: 100 });
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('should enable Next when not on last page', () => {
    setup({ offset: 60, limit: 20, total: 100 });
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();
  });

  it('should call onPageChange with offset - limit on Previous click', () => {
    setup({ offset: 40, limit: 20, total: 100 });
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).toHaveBeenCalledWith(20);
  });

  it('should call onPageChange with offset + limit on Next click', () => {
    setup({ offset: 20, limit: 20, total: 100 });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(40);
  });

  it('should not call onPageChange if disabled Previous is clicked', () => {
    setup({ offset: 0, limit: 20, total: 100 });
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('should not call onPageChange if disabled Next is clicked', () => {
    setup({ offset: 80, limit: 20, total: 100 });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('should show only current page when total is null', () => {
    setup({ offset: 40, limit: 20, total: null });
    expect(screen.getByText('Page 3')).toBeInTheDocument();
    expect(screen.queryByText(/of \d+/)).not.toBeInTheDocument();
  });
});
