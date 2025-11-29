import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from './button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  siblingCount?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  siblingCount = 1,
  className
}) => {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
      
      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
      
      if (!shouldShowLeftDots && shouldShowRightDots) {
        // No left dots, show right dots
        const leftItemCount = 3 + 2 * siblingCount;
        for (let i = 2; i <= leftItemCount; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        // Show left dots, no right dots
        const rightItemCount = 3 + 2 * siblingCount;
        pages.push('...');
        for (let i = totalPages - rightItemCount + 1; i < totalPages; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      } else if (shouldShowLeftDots && shouldShowRightDots) {
        // Show both dots
        pages.push('...');
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else {
        // Show all pages between first and last
        for (let i = 2; i < totalPages; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <nav className={cn('flex items-center justify-center space-x-1', className)}>
      {showFirstLast && currentPage > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          className="px-2"
        >
          First
        </Button>
      )}
      
      {showPrevNext && currentPage > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <Button
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className="px-3"
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}
      
      {showPrevNext && currentPage < totalPages && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      
      {showFirstLast && currentPage < totalPages && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          className="px-2"
        >
          Last
        </Button>
      )}
    </nav>
  );
};

export { Pagination };