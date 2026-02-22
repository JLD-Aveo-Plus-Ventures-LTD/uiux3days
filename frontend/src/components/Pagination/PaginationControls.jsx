import React, { useMemo } from 'react';

/**
 * PaginationControls - Numbered pagination UI component
 * 
 * Renders pagination controls with numbered page buttons, previous/next buttons,
 * and ellipsis for large page counts.
 * 
 * @param {number} currentPage - Current page number (1-indexed)
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Callback function when page changes: (pageNumber) => void
 * @param {Object} options - Optional configuration
 * @param {number} options.siblingCount - Number of page buttons to show around current page (default: 1)
 * @param {boolean} options.disabled - Disable all buttons (default: false)
 * 
 * @returns {JSX.Element} Pagination controls
 * 
 * @example
 * <PaginationControls 
 *   currentPage={1} 
 *   totalPages={40} 
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 * // Renders: < 1 2 3 ... 40 >
 */

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  options = {},
}) => {
  const { siblingCount = 1, disabled = false } = options;

  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      // Show all pages if total is small
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return [
        ...Array.from({ length: leftItemCount }, (_, i) => i + 1),
        'ELLIPSIS',
        lastPageIndex,
      ];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return [
        firstPageIndex,
        'ELLIPSIS',
        ...Array.from(
          { length: rightItemCount },
          (_, i) => totalPages - rightItemCount + i + 1
        ),
      ];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      return [
        firstPageIndex,
        'ELLIPSIS',
        ...Array.from({ length: 2 * siblingCount + 1 }, (_, i) => leftSiblingIndex + i),
        'ELLIPSIS',
        lastPageIndex,
      ];
    }
  }, [currentPage, totalPages, siblingCount]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages === 0) return null;

  return (
    <div className="pagination">
      {/* Previous Button */}
      <button
        className={`pagination__btn pagination__btn--prev ${
          currentPage === 1 || disabled ? 'pagination__btn--disabled' : ''
        }`}
        onClick={handlePrevious}
        disabled={currentPage === 1 || disabled}
        aria-label="Previous page"
      >
        &lt;
      </button>

      {/* Page Numbers */}
      <div className="pagination__pages">
        {paginationRange.map((pageNumber, idx) => {
          if (pageNumber === 'ELLIPSIS') {
            return (
              <span key={`ellipsis-${idx}`} className="pagination__ellipsis">
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNumber}
              className={`pagination__btn ${
                pageNumber === currentPage ? 'pagination__btn--active' : ''
              } ${disabled ? 'pagination__btn--disabled' : ''}`}
              onClick={() => handlePageClick(pageNumber)}
              disabled={disabled}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
              aria-label={`Page ${pageNumber}`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        className={`pagination__btn pagination__btn--next ${
          currentPage === totalPages || disabled ? 'pagination__btn--disabled' : ''
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages || disabled}
        aria-label="Next page"
      >
        &gt;
      </button>
    </div>
  );
};

export default PaginationControls;
